import type { Knowledge, Link, Reply } from './types';

/**
 * Free, offline assistant: matches a question to a topic by keywords (English, Hinglish, Hindi) and answers
 * only from the website's own content. No external service, no API key, no cost — and nothing is made up.
 * To teach it a new way of asking, add words to the topic's `words` list below.
 */

type Topic = {
  id: string;
  words: string[];
  answer: (k: Knowledge, hi: boolean, q: string) => Reply;
};

const SUGGEST_EN = ['Book an appointment', 'What are the practice areas?', 'Where are the offices?', 'Contact details'];
const SUGGEST_HI = ['अपॉइंटमेंट बुक करें', 'प्रैक्टिस एरिया क्या हैं?', 'ऑफिस कहाँ है?', 'संपर्क कैसे करें?'];
const suggest = (hi: boolean) => (hi ? SUGGEST_HI : SUGGEST_EN);

const normalise = (s: string) =>
  s
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^\p{L}\p{M}\p{N}\s.+-]/gu, ' ') // \p{M} keeps Hindi vowel signs
    .replace(/\s+/g, ' ')
    .trim();

// Whole-word match for short Latin words ("ip", "fee"), substring match for longer or Hindi words
function hits(q: string, word: string) {
  const w = word.toLowerCase();
  if (/^[a-z0-9 .+-]+$/.test(w) && w.length <= 4) return new RegExp(`(^|[^a-z0-9])${w.replace(/[.+]/g, '\\$&')}([^a-z0-9]|$)`).test(q);
  return q.includes(w);
}
const score = (q: string, words: string[]) => words.reduce((s, w) => (hits(q, w) ? s + 1 + Math.min(w.length, 12) / 12 : s), 0);

const contactLinks = (k: Knowledge): Link[] => [
  ...(k.phone && k.phoneHref ? [{ label: `Call ${k.phone}`, href: k.phoneHref }] : []),
  { label: `Email ${k.email}`, href: `mailto:${k.email}` },
  { label: 'Contact page', href: '/contact' },
];

const officeLinks = (k: Knowledge): Link[] =>
  k.offices.flatMap((o) => (o.directions ? [{ label: `Directions: ${o.title}`, href: o.directions, external: true }] : []));

const bookReply = (hi: boolean): Reply => ({
  text: hi ? 'ज़रूर — आइए आपके लिए अपॉइंटमेंट का समय तय करते हैं।' : 'Sure — let’s find a time for your appointment.',
  action: 'book',
});

const TOPICS: Topic[] = [
  {
    id: 'book',
    words: ['book', 'booking', 'appointment', 'appoint', 'meeting', 'meet', 'consultation', 'consult', 'schedule', 'slot', 'visit', 'milna', 'milne', 'mulakat', 'mulaqat', 'samay', 'अपॉइंटमेंट', 'मुलाकात', 'मिलना', 'मिलने', 'समय', 'बुक'],
    answer: (_k, hi) => bookReply(hi),
  },
  {
    id: 'advice',
    words: ['my case', 'mera case', 'meri problem', 'my problem', 'mere sath', 'mere saath', 'happened to me', 'cheated me', 'what should i do', 'what can i do', 'kya karu', 'kya karun', 'kya kare', 'help me', 'can i file', 'will i win', 'chances', 'bail', 'fir', 'arrest', 'police', 'notice aaya', 'divorce', 'talaq', 'case kaise', 'sue', 'मेरा केस', 'मेरे साथ', 'क्या करूं', 'क्या करें', 'जमानत', 'पुलिस', 'तलाक'],
    answer: (k, hi, q) => {
      const area = bestArea(k, q);
      const areaLine = area ? (hi ? ` यह विषय ${area.title} के अंतर्गत आता है।` : ` This falls under ${area.title}.`) : '';
      return {
        text: hi
          ? `मैं इस चैट में किसी व्यक्तिगत मामले पर कानूनी सलाह नहीं दे सकता।${areaLine} तथ्यों को समझने के बाद अधिवक्ता ${k.name} ही सलाह दे पाएँगे — आप अपॉइंटमेंट बुक कर सकते हैं। कृपया यहाँ गोपनीय जानकारी साझा न करें।`
          : `I can’t give legal advice on a personal matter in this chat.${areaLine} Advocate ${k.name} can advise once he understands the facts — you can book an appointment. Please don’t share confidential details here.`,
        links: area ? [{ label: area.title, href: area.href }] : undefined,
        suggestions: [hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment', hi ? 'संपर्क कैसे करें?' : 'Contact details'],
      };
    },
  },
  {
    id: 'fees',
    words: ['fee', 'fees', 'charge', 'charges', 'cost', 'price', 'rate', 'kitna', 'kitne', 'paisa', 'paise', 'rupees', 'free consultation', 'फीस', 'शुल्क', 'कितना', 'पैसे'],
    answer: (k, hi) => ({
      text: hi
        ? 'फीस की जानकारी वेबसाइट पर उपलब्ध नहीं है। यह मामले पर निर्भर करती है — कृपया ऑफिस से संपर्क करें या अपॉइंटमेंट बुक करें।'
        : 'Fees aren’t listed on the website, as they depend on the matter. Please contact the office or book an appointment to discuss.',
      links: contactLinks(k),
      suggestions: [hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment'],
    }),
  },
  {
    id: 'practice',
    words: ['practice', 'practise', 'area', 'areas', 'service', 'services', 'expertise', 'specialise', 'specialize', 'handle', 'deal', 'kaam', 'kya karte', 'type of case', 'kis tarah', 'सेवाएं', 'सेवाएँ', 'प्रैक्टिस', 'क्षेत्र', 'मामले'],
    answer: (k, hi) => ({
      text: hi
        ? `अधिवक्ता ${k.name} इन क्षेत्रों में कार्य करते हैं: ${k.practiceAreas.map((p) => p.title).join(', ')}।`
        : `Advocate ${k.name}’s practice areas are: ${k.practiceAreas.map((p) => p.title).join('; ')}. Choose one to read more.`,
      links: k.practiceAreas.map((p) => ({ label: p.title, href: p.href })),
    }),
  },
  {
    id: 'office',
    words: ['office', 'offices', 'address', 'location', 'located', 'where', 'directions', 'map', 'reach', 'kahan', 'kaha', 'kidhar', 'pata', 'petlawad', 'indore', 'high court', 'chamber', 'ऑफिस', 'कार्यालय', 'पता', 'कहाँ', 'कहां', 'पेटलावद', 'इंदौर'],
    answer: (k, hi) =>
      k.offices.length
        ? {
            text:
              (hi ? 'ऑफिस के पते:\n' : 'Office locations:\n') +
              k.offices.map((o) => `• ${o.title} — ${o.name ? `${o.name}, ` : ''}${o.address}`).join('\n'),
            links: [...officeLinks(k), { label: hi ? 'सभी ऑफिस मैप पर' : 'All offices on the map', href: '/contact#offices-heading' }],
          }
        : { text: hi ? `ऑफिस ${k.city}, ${k.region} में है।` : `The practice is based in ${k.city}, ${k.region}.`, links: contactLinks(k) },
  },
  {
    id: 'contact',
    words: ['contact', 'phone', 'number', 'mobile', 'call', 'email', 'mail', 'whatsapp', 'reach him', 'sampark', 'baat', 'संपर्क', 'फोन', 'नंबर', 'ईमेल', 'बात'],
    answer: (k, hi) => ({
      text: hi
        ? `आप ${k.phone ? `फोन ${k.phone} पर या ` : ''}ईमेल ${k.email} पर संपर्क कर सकते हैं, या यहीं अपॉइंटमेंट बुक कर सकते हैं।`
        : `You can reach the office ${k.phone ? `by phone on ${k.phone}, ` : ''}by email at ${k.email}, or book an appointment right here.`,
      links: contactLinks(k),
      suggestions: [hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment'],
    }),
  },
  {
    id: 'about',
    words: ['who', 'about', 'advocate', 'lawyer', 'vakil', 'vageesh', 'vagesh', 'samvedi', 'background', 'profile', 'experience', 'kaun', 'firm', 'law astra', 'associates', 'वकील', 'अधिवक्ता', 'कौन', 'बारे'],
    answer: (k, hi) => ({
      text: hi
        ? `${k.name} ${k.city}, ${k.region} में ${k.role} हैं और ${k.firm} के साथ कार्य करते हैं। उनकी शिक्षा ${k.education} से हुई है।`
        : `${k.name} is an ${k.role.toLowerCase()} based in ${k.city}, ${k.region}, practising with ${k.firm}. He studied at ${k.education}.`,
      links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about' }],
      suggestions: [hi ? 'प्रैक्टिस एरिया क्या हैं?' : 'What are the practice areas?'],
    }),
  },
  {
    id: 'education',
    words: ['education', 'qualification', 'qualified', 'degree', 'study', 'studied', 'university', 'college', 'llb', 'padhai', 'शिक्षा', 'पढ़ाई', 'डिग्री'],
    answer: (k, hi) => ({
      text: hi ? `उनकी शिक्षा ${k.education} से हुई है।` : `He studied at ${k.education}.`,
      links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about' }],
    }),
  },
  {
    id: 'news',
    words: ['news', 'newspaper', 'media', 'press', 'coverage', 'khabar', 'akhbar', 'latest', 'recent', 'achievement', 'खबर', 'समाचार', 'अखबार'],
    answer: (k, hi) => ({
      text: hi ? 'हाल की खबरें:' : 'Recent news on the website:',
      links: [...k.news.map((n) => ({ label: n.title, href: n.href })), { label: hi ? 'सभी खबरें' : 'All news', href: '/news' }],
    }),
  },
  {
    id: 'blog',
    words: ['blog', 'article', 'articles', 'insight', 'insights', 'लेख', 'ब्लॉग'],
    answer: (k, hi) => ({
      text: hi ? 'वेबसाइट पर लेख:' : 'Articles on the website:',
      links: [...k.articles.map((a) => ({ label: a.title, href: a.href })), { label: hi ? 'सभी लेख' : 'All articles', href: '/blog' }],
    }),
  },
  {
    id: 'social',
    words: ['instagram', 'linkedin', 'social', 'insta', 'follow', 'reel', 'reels', 'video', 'digital card', 'सोशल'],
    answer: (k, hi) => ({
      text: hi ? 'सोशल मीडिया पर जुड़ें:' : 'Follow the advocate online:',
      links: [...k.profiles.map((p) => ({ label: p.label, href: p.href, external: true })), { label: 'Social Journey', href: '/social' }],
    }),
  },
  {
    id: 'timing',
    words: ['timing', 'timings', 'hours', 'open', 'opening', 'available', 'availability', 'kab', 'when', 'today', 'tomorrow', 'sunday', 'aaj', 'kal', 'कब', 'आज', 'कल', 'खुला'],
    answer: (_k, hi) => ({
      text: hi
        ? 'उपलब्ध समय बुकिंग फॉर्म में दिखते हैं — वहाँ केवल वही समय दिखते हैं जो सच में खाली हैं।'
        : 'Free appointment times are shown in the booking form — it only lists times that are genuinely open.',
      suggestions: [hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment'],
    }),
  },
  {
    id: 'legal-pages',
    words: ['privacy policy', 'disclaimer', 'terms', 'bar council', 'bci', 'गोपनीयता'],
    answer: (_k, hi) => ({
      text: hi ? 'ये पेज देखें:' : 'You can read these pages:',
      links: [
        { label: 'Disclaimer', href: '/disclaimer' },
        { label: 'Privacy policy', href: '/privacy-policy' },
      ],
    }),
  },
  {
    id: 'thanks',
    words: ['thanks', 'thank you', 'thank', 'thx', 'dhanyavad', 'dhanyawad', 'shukriya', 'ok', 'okay', 'bye', 'theek', 'धन्यवाद', 'शुक्रिया'],
    answer: (_k, hi) => ({ text: hi ? 'धन्यवाद! और कुछ जानना हो तो पूछिए।' : 'You’re welcome! Ask me anything else, or book an appointment whenever you’re ready.' }),
  },
  {
    id: 'greeting',
    words: ['hi', 'hello', 'hey', 'namaste', 'namaskar', 'pranam', 'good morning', 'good evening', 'नमस्ते', 'नमस्कार', 'प्रणाम'],
    answer: (_k, hi) => ({
      text: hi ? 'नमस्ते! मैं आपकी कैसे मदद कर सकता हूँ?' : 'Hello! How can I help you today?',
      suggestions: suggest(hi),
    }),
  },
];

function bestArea(k: Knowledge, q: string) {
  let best: Knowledge['practiceAreas'][number] | null = null;
  let top = 0;
  for (const a of k.practiceAreas) {
    const words = [...a.keywords, ...a.matters.map((m) => m.toLowerCase()), a.title.toLowerCase()];
    const s = score(q, words);
    if (s > top) {
      top = s;
      best = a;
    }
  }
  return top > 0 ? best : null;
}

/** `lang` is the language the visitor chose; without it, Hindi script in the question means a Hindi answer */
export function answer(question: string, k: Knowledge, lang?: 'en' | 'hi'): Reply {
  const hi = lang ? lang === 'hi' : /[ऀ-ॿ]/.test(question);
  const q = normalise(question);

  const ranked = TOPICS.map((t) => ({ t, s: score(q, t.words) }))
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s);
  const area = bestArea(k, q);

  // A personal legal problem always gets the "no advice here" answer, even if it also names a topic
  if (ranked.some((r) => r.t.id === 'advice') && !(ranked[0].t.id === 'book' && ranked[0].s >= 2)) {
    return TOPICS.find((t) => t.id === 'advice')!.answer(k, hi, q);
  }

  // "Do you handle cyber fraud cases?" — a specific practice area
  if (area && (!ranked.length || ['practice', 'about'].includes(ranked[0].t.id))) {
    return {
      text: hi
        ? `हाँ, यह ${area.title} के अंतर्गत आता है। ${area.summary}`
        : `Yes — that falls under ${area.title}. ${area.summary}`,
      links: [{ label: area.title, href: area.href }],
      suggestions: [hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment'],
    };
  }

  if (ranked.length) return ranked[0].t.answer(k, hi, q);

  return {
    text: hi
      ? 'माफ़ कीजिए, मुझे इसका उत्तर नहीं पता। मैं अधिवक्ता के बारे में, प्रैक्टिस एरिया, ऑफिस, संपर्क और अपॉइंटमेंट बुकिंग में मदद कर सकता हूँ।'
      : 'Sorry, I don’t have an answer for that. I can help with information about the advocate, practice areas, offices, contact details and booking an appointment.',
    suggestions: suggest(hi),
  };
}
