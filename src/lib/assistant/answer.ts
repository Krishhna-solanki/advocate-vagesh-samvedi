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

// Places named in the Geographical Reach section, with the spellings visitors use
const PLACES: Record<string, string[]> = {
  Jhabua: ['jhabua', 'झाबुआ'],
  Petlawad: ['petlawad', 'petlavad', 'पेटलावद'],
  Thandla: ['thandla', 'थांदला'],
  Indore: ['indore', 'इंदौर'],
  Ujjain: ['ujjain', 'उज्जैन'],
  Dhar: ['dhar', 'धार'],
  Sardarpur: ['sardarpur', 'सरदारपुर'],
  Ratlam: ['ratlam', 'रतलाम'],
  Jabalpur: ['jabalpur', 'जबलपुर'],
  Vadodara: ['vadodara', 'baroda', 'वडोदरा'],
  Dahod: ['dahod', 'दाहोद'],
  Ahmedabad: ['ahmedabad', 'ahmdabad', 'अहमदाबाद'],
  Gujarat: ['gujarat', 'गुजरात'],
};

const ROLE_HI: Record<string, string> = { 'District President': 'ज़िला अध्यक्ष', 'Joint Secretary': 'संयुक्त सचिव' };
const ORG_HI: Record<string, string> = {
  'Judicial Human Rights Council, Jhabua': 'ज्यूडिशियल ह्यूमन राइट्स काउंसिल, झाबुआ',
  'Boxing Association, Jhabua': 'बॉक्सिंग एसोसिएशन, झाबुआ',
};
const roleHi = (r: string) => ROLE_HI[r] ?? r;
const orgHi = (o: string) => ORG_HI[o] ?? o;

const respLine = (k: Knowledge, hi: boolean) =>
  k.responsibilities.length
    ? hi
      ? ` वे ${k.responsibilities.map((r) => `${orgHi(r.organisation)} के ${roleHi(r.role)}`).join(' और ')} भी हैं।`
      : ` Beyond practice, he serves as ${k.responsibilities.map((r) => `${r.role} of the ${r.organisation}`).join(' and ')}.`
    : '';

// "Tell me about the boxing role" — one responsibility, matched by words in its name or focus areas
const RESP_HINTS: [RegExp, string[]][] = [
  [/human|council/i, ['human', 'rights', 'manav', 'adhikar', 'council', 'jhrc', 'judicial', 'president', 'adhyaksh', 'मानव', 'अध्यक्ष']],
  [/boxing/i, ['boxing', 'sport', 'sports', 'khel', 'secretary', 'sachiv', 'youth', 'बॉक्सिंग', 'खेल', 'सचिव']],
];
function pickResponsibility(k: Knowledge, q: string) {
  const found = RESP_HINTS.filter(([, words]) => words.some((w) => hits(q, w))).map(([org]) => k.responsibilities.find((r) => org.test(r.organisation)));
  return found.length === 1 ? (found[0] ?? null) : null;
}

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
    words: ['office', 'offices', 'address', 'location', 'located', 'where', 'directions', 'map', 'kahan', 'kaha', 'kidhar', 'pata', 'chamber', 'ऑफिस', 'कार्यालय', 'पता', 'कहाँ', 'कहां'],
    answer: (k, hi) =>
      k.offices.length
        ? {
            text:
              (hi ? 'ऑफिस के पते:\n' : 'Office locations:\n') +
              k.offices.map((o) => `• ${o.title} — ${o.name ? `${o.name}, ` : ''}${o.address}`).join('\n'),
            links: [...officeLinks(k), { label: hi ? 'सभी ऑफिस मैप पर' : 'All offices on the map', href: '/contact#offices-heading' }],
          }
        : { text: hi ? `ऑफिस पेटलावद (ज़िला झाबुआ) और इंदौर, मध्य प्रदेश में है।` : 'The professional locations are Petlawad (District Jhabua) and Indore, Madhya Pradesh.', links: contactLinks(k) },
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
        ? `अधिवक्ता ${k.name} एक स्वतंत्र विधि व्यवसायी हैं, जो मध्य प्रदेश और गुजरात के चुनिंदा स्थानों में मुकदमेबाज़ी, कानूनी प्रतिनिधित्व और सलाह का कार्य करते हैं। उनकी शिक्षा: ${k.educationHi}। वे स्टेट बार काउंसिल ऑफ मध्य प्रदेश में नामांकित हैं।${respLine(k, hi)}`
        : `Advocate ${k.name} is an independent legal practitioner engaged in litigation, legal representation and advisory work across Madhya Pradesh and selected locations in Gujarat. He holds ${k.education}, and is enrolled with the State Bar Council of Madhya Pradesh.${respLine(k, hi)}`,
      links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about' }],
      suggestions: [hi ? 'प्रैक्टिस एरिया क्या हैं?' : 'What are the practice areas?', hi ? 'सामाजिक ज़िम्मेदारियाँ' : 'Responsibilities beyond practice'],
    }),
  },
  {
    id: 'education',
    words: ['education', 'qualification', 'qualifications', 'qualified', 'degree', 'degrees', 'study', 'studied', 'university', 'college', 'llb', 'llm', 'll.b', 'll.m', 'certificate', 'certification', 'certified', 'course', 'courses', 'ignou', 'psychology', 'padhai', 'padhe', 'शिक्षा', 'पढ़ाई', 'डिग्री', 'योग्यता', 'प्रमाणपत्र', 'कोर्स'],
    answer: (k, hi) => ({
      text:
        (hi ? 'शिक्षा एवं शैक्षणिक योग्यताएँ:\n' : 'Education & academic qualifications:\n') +
        k.qualifications.map((e) => `• ${e.degree} — ${e.institution} (${e.detail.replace(/^(Completed|Status):\s*/, '')})`).join('\n') +
        (hi ? '\n\nउन्होंने 2025 में अखिल भारतीय बार परीक्षा (AIBE) उत्तीर्ण की।' : '\n\nHe also qualified the All India Bar Examination (AIBE) in 2025.'),
      links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about' }],
      suggestions: [hi ? 'बार काउंसिल रजिस्ट्रेशन' : 'Bar Council registration'],
    }),
  },
  {
    id: 'registration',
    words: ['bar council', 'registration', 'registered', 'enrolled', 'enrolment', 'enrollment', 'aibe', 'bar exam', 'licence', 'license', 'since when', 'kab se', 'kab se practice', 'practice kab', 'since 20', 'practising since', 'practicing since', 'बार काउंसिल', 'रजिस्ट्रेशन', 'पंजीकरण', 'नामांकित', 'कब से'],
    answer: (k, hi) => ({
      text: hi
        ? `• ${k.barCouncil} में अधिवक्ता के रूप में नामांकित।\n• 2025 में अखिल भारतीय बार परीक्षा (AIBE) उत्तीर्ण।\n• ${k.practiceSince} से स्वतंत्र विधि व्यवसाय में।`
        : `• Advocate enrolled with the ${k.barCouncil}.\n• Qualified the All India Bar Examination (AIBE) in 2025.\n• Engaged in independent legal practice since ${k.practiceSince}.`,
      links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about#about-registration' }],
    }),
  },
  {
    id: 'responsibilities',
    words: ['responsibility', 'responsibilities', 'human rights', 'manav adhikar', 'manavadhikar', 'council', 'jhrc', 'president', 'adhyaksh', 'boxing', 'sport', 'sports', 'khel', 'secretary', 'sachiv', 'organisation', 'organization', 'sanstha', 'social work', 'samaj seva', 'community', 'beyond practice', 'beyond legal', 'मानवाधिकार', 'मानव अधिकार', 'अध्यक्ष', 'बॉक्सिंग', 'खेल', 'सचिव', 'संस्था', 'समाज', 'ज़िम्मेदारी', 'जिम्मेदारी', 'ज़िम्मेदारियाँ'],
    answer: (k, hi, q) => {
      const one = pickResponsibility(k, q);
      const list = one ? [one] : k.responsibilities;
      if (!list.length) return { text: hi ? 'इसकी जानकारी वेबसाइट पर उपलब्ध नहीं है।' : 'That isn’t covered on the website yet.', links: [{ label: hi ? 'पूरा परिचय' : 'Full profile', href: '/about' }] };
      const text = one
        ? hi
          ? `अधिवक्ता ${k.name} ${orgHi(one.organisation)} के ${roleHi(one.role)} हैं।\nमुख्य विषय: ${one.themes.join(', ')}।`
          : `Advocate ${k.name} serves as ${one.role} of the ${one.organisation} — ${one.heading}. ${one.summary}\nAreas of focus: ${one.themes.join(', ')}.`
        : (hi ? 'विधि व्यवसाय के अलावा उनकी संगठनात्मक ज़िम्मेदारियाँ:\n' : 'Beyond legal practice, he holds these organisational responsibilities:\n') +
          list.map((r) => (hi ? `• ${roleHi(r.role)} — ${orgHi(r.organisation)}` : `• ${r.role} — ${r.organisation} (${r.heading})`)).join('\n');
      return {
        text,
        links: [
          ...list.map((r) => ({ label: `${r.role} · ${r.organisation}`, href: r.href })),
          ...(one ? [] : [{ label: hi ? 'होम पेज पर देखें' : 'See on the home page', href: '/#responsibilities' }]),
        ],
      };
    },
  },
  {
    id: 'reach',
    words: ['jurisdiction', 'which city', 'which cities', 'which district', 'which districts', 'which state', 'which states', 'cases in', 'case in', 'practise in', 'practice in', 'outside', 'other city', 'kaha kaha', 'kahan kahan', 'kis shahar', 'kin shahar', 'kis jile', 'case lete', 'case loge', 'me case', 'mein case', 'में केस', 'madhya pradesh', 'high court', 'highcourt', 'bench', 'जिला', 'ज़िला', 'शहर', 'मध्य प्रदेश', 'हाईकोर्ट', 'उच्च न्यायालय', ...Object.values(PLACES).flat()],
    answer: (k, hi, q) => {
      const named = Object.entries(PLACES).find(([, aliases]) => aliases.some((a) => hits(q, a)))?.[0];
      const covered = !!named && (k.reach.madhyaPradesh.includes(named) || k.reach.gujarat.includes(named) || named === 'Jabalpur');
      const caveat = hi
        ? 'किसी विशेष मामले में प्रतिनिधित्व क्षेत्राधिकार, व्यावसायिक अनुमतियों और मामले की प्रकृति पर निर्भर करता है।'
        : 'Representation in any particular matter depends on the jurisdiction, professional permissions and the nature of the proceedings.';
      const full = hi
        ? `मध्य प्रदेश: पूरे प्रदेश में — ${k.reach.madhyaPradesh.join(', ')} सहित, और मध्य प्रदेश उच्च न्यायालय (प्रधान पीठ जबलपुर, इंदौर खंडपीठ)।\nगुजरात: ${k.reach.gujarat.join(', ')}।`
        : `Madhya Pradesh: statewide, including ${k.reach.madhyaPradesh.join(', ')}, and the High Court of Madhya Pradesh (Principal Seat at Jabalpur, Indore Bench).\nGujarat: ${k.reach.gujarat.join(', ')}.`;
      const lead =
        named === 'Gujarat'
          ? hi
            ? `गुजरात में व्यावसायिक पहुँच ${k.reach.gujarat.join(', ')} तक है।`
            : `In Gujarat, the professional reach covers ${k.reach.gujarat.join(', ')}.`
          : covered
            ? hi
              ? `हाँ, ${named} व्यावसायिक पहुँच में शामिल है।`
              : `Yes — ${named} is within the professional reach.`
            : hi
              ? 'व्यावसायिक पहुँच:'
              : 'Professional reach:';
      return {
        text: `${lead}\n${full}\n\n${caveat}`,
        links: [{ label: hi ? 'भौगोलिक पहुँच' : 'Geographical reach', href: '/contact#reach-heading' }],
        suggestions: [hi ? 'ऑफिस कहाँ है?' : 'Where are the offices?', hi ? 'अपॉइंटमेंट बुक करें' : 'Book an appointment'],
      };
    },
  },
  {
    id: 'interests',
    words: ['research', 'publication', 'publications', 'interests', 'research interest', 'academic interest', 'artificial intelligence', 'ai', 'technology', 'tech law', 'digital rights', 'shodh', 'शोध', 'रुचि', 'तकनीक'],
    answer: (k, hi) => ({
      text: (hi ? 'शैक्षणिक रुचियाँ:\n' : 'Academic and research interests:\n') + k.interests.map((i) => `• ${i}`).join('\n'),
      links: [
        { label: hi ? 'रिसर्च और पब्लिकेशन' : 'Research & Publications', href: '/publications' },
        { label: hi ? 'लेख' : 'Articles', href: '/blog' },
      ],
    }),
  },
  {
    id: 'ebooks',
    words: ['e-book', 'e-books', 'ebook', 'ebooks', 'e book', 'e books', 'books', 'kitab', 'kitabein', 'kitaben', 'pustak', 'किताब', 'किताबें', 'पुस्तक', 'ई-बुक'],
    answer: (k, hi) => ({
      text: hi ? 'ई-बुक्स जल्द आ रही हैं। अपडेट के लिए आप व्हाट्सऐप चैनल से जुड़ सकते हैं।' : 'E-Books are coming soon. You can join the WhatsApp channel to stay updated.',
      links: [
        { label: 'E-Books', href: '/e-books' },
        ...(k.whatsappChannel ? [{ label: hi ? 'व्हाट्सऐप चैनल' : 'WhatsApp channel', href: k.whatsappChannel, external: true }] : []),
      ],
    }),
  },
  {
    id: 'channel',
    words: ['whatsapp channel', 'channel', 'stay updated', 'get updates', 'join', 'subscribe', 'चैनल'],
    answer: (k, hi) =>
      k.whatsappChannel
        ? {
            text: hi ? 'अपडेट के लिए आधिकारिक व्हाट्सऐप चैनल से जुड़ें।' : 'Join the official WhatsApp channel to stay updated.',
            links: [{ label: hi ? 'व्हाट्सऐप चैनल से जुड़ें' : 'Join WhatsApp Channel', href: k.whatsappChannel, external: true }],
          }
        : { text: hi ? 'सोशल मीडिया पर जुड़ें:' : 'Follow the advocate online:', links: k.profiles.map((p) => ({ label: p.label, href: p.href, external: true })) },
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
    words: ['privacy policy', 'disclaimer', 'terms', 'bci', 'गोपनीयता'],
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

  // "Khel me kya karte ho?" — a named responsibility beats the generic "what do you do" words
  if (['practice', 'about'].includes(ranked[0]?.t.id) && ranked.some((r) => r.t.id === 'responsibilities') && pickResponsibility(k, q)) {
    return TOPICS.find((t) => t.id === 'responsibilities')!.answer(k, hi, q);
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
      ? 'माफ़ कीजिए, मुझे इसका उत्तर नहीं पता। मैं अधिवक्ता के बारे में, शिक्षा, प्रैक्टिस एरिया, सामाजिक ज़िम्मेदारियों, कार्यक्षेत्र, ऑफिस, संपर्क और अपॉइंटमेंट बुकिंग में मदद कर सकता हूँ।'
      : 'Sorry, I don’t have an answer for that. I can help with information about the advocate, his education, practice areas, responsibilities, geographical reach, offices, contact details and booking an appointment.',
    suggestions: suggest(hi),
  };
}
