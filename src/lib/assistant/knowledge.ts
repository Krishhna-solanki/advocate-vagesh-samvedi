import 'server-only';
import { site } from '../site';
import { practiceAreas } from '../practice-areas';
import { offices } from '../offices';
import { getNewsMetas } from '../news';
import { getArticleMetas } from '../insights';
import { getResponsibilities, responsibilityPath } from '../responsibilities';
import type { Knowledge } from './types';

// Extra words visitors use for each practice area (English, Hinglish and Hindi), on top of the words in its title
// and listed matters. Add a word here if the assistant misses a common way of asking.
const AREA_KEYWORDS: Record<string, string[]> = {
  'civil-law': ['civil', 'suit', 'injunction', 'stay', 'recovery', 'contract', 'agreement', 'specific performance', 'declaration', 'dispute', 'vivad', 'दीवानी', 'विवाद', 'निषेधाज्ञा'],
  'property-revenue-law': ['property', 'land', 'zameen', 'jameen', 'makaan', 'house', 'plot', 'mutation', 'namantaran', 'khasra', 'khatauni', 'revenue', 'patwari', 'tehsil', 'registry', 'title', 'possession', 'kabza', 'partition', 'bantwara', 'agricultural', 'संपत्ति', 'ज़मीन', 'जमीन', 'मकान', 'नामांतरण', 'राजस्व', 'कब्जा', 'बंटवारा', 'रजिस्ट्री'],
  'criminal-law': ['criminal', 'crime', 'bail', 'jamanat', 'fir', 'police', 'arrest', 'complaint', 'defence', 'defense', 'case', 'अपराध', 'आपराधिक', 'जमानत', 'गिरफ्तारी', 'पुलिस'],
  'family-matrimonial-law': ['family', 'divorce', 'talaq', 'maintenance', 'alimony', 'kharcha', 'matrimonial', 'marriage', 'shaadi', 'husband', 'wife', 'pati', 'patni', 'custody', 'conjugal', 'परिवार', 'तलाक', 'भरण-पोषण', 'विवाह', 'शादी', 'पति', 'पत्नी'],
  'arbitration-adr': ['arbitration', 'arbitrator', 'mediation', 'conciliation', 'negotiation', 'adr', 'settlement', 'samjhauta', 'मध्यस्थता', 'समझौता', 'सुलह'],
  'business-corporate': ['business', 'company', 'corporate', 'commercial', 'firm', 'partnership', 'payment', 'outstanding', 'consumer', 'documentation', 'drafting', 'vyapar', 'dhandha', 'व्यापार', 'कंपनी', 'व्यवसाय', 'उपभोक्ता'],
  'intellectual-property': ['trademark', 'trade mark', 'copyright', 'patent', 'brand', 'logo', 'ip', 'infringement', 'licensing', 'ट्रेडमार्क', 'कॉपीराइट', 'पेटेंट'],
  'cyber-law': ['cyber', 'online', 'fraud', 'scam', 'hacking', 'hacked', 'upi', 'bank', 'otp', 'lien', 'frozen', 'freeze', 'blocked account', 'data', 'privacy', 'it act', 'e-commerce', 'thagi', 'dhokha', 'साइबर', 'ऑनलाइन', 'धोखाधड़ी', 'ठगी', 'लियन'],
};

let cached: Knowledge | null = null;

// Everything the assistant can say comes from the website's own content, so it never invents facts.
export function getAssistantKnowledge(): Knowledge {
  if (cached) return cached;
  cached = {
    name: site.name,
    role: site.role,
    city: site.location.city,
    region: site.location.region,
    education: 'a B.A. LL.B. (Hons.) from Navsamvat Law College, Ujjain (2025) and an LL.M. in Intellectual Property Rights from Renaissance University, Indore',
    educationHi: 'नवसंवत लॉ कॉलेज, उज्जैन से B.A. LL.B. (Hons.) (2025) और रेनेसां यूनिवर्सिटी, इंदौर से बौद्धिक संपदा अधिकार (IPR) में LL.M.',
    email: site.email,
    phone: site.phone?.display ?? null,
    phoneHref: site.phone?.href ?? null,
    profiles: site.profiles.map((p) => ({ label: p.label, href: p.href })),
    practiceAreas: practiceAreas.map((p) => ({
      title: p.title,
      href: `/practice-areas/${p.slug}`,
      summary: p.summary,
      matters: p.matters,
      keywords: AREA_KEYWORDS[p.slug] ?? [],
    })),
    offices: offices
      .filter((o) => !o.placeholder)
      .map((o) => ({ title: o.title, name: o.name ?? '', address: o.address, directions: o.directionsHref ?? null })),
    qualifications: site.education.map((e) => ({ degree: e.degree, institution: e.institution, detail: e.detail })),
    barCouncil: site.barCouncil,
    practiceSince: site.practiceSince,
    responsibilities: getResponsibilities().map((r) => ({
      organisation: r.organisation,
      role: r.role,
      heading: r.heading ?? r.organisation,
      summary: r.summary,
      themes: r.themes.map((t) => t.title),
      href: responsibilityPath(r.slug),
    })),
    reach: { madhyaPradesh: [...site.reachPlaces.madhyaPradesh], gujarat: [...site.reachPlaces.gujarat] },
    // Same list as the Research & Publications page
    interests: [
      'Intellectual Property Rights',
      'Artificial Intelligence & Law',
      'Cybersecurity & Digital Regulation',
      'Technology & Legal Development',
      'Constitutional Law & Human Rights',
      'Alternative Dispute Resolution',
    ],
    whatsappChannel: site.whatsappChannel ?? null,
    news: getNewsMetas()
      .filter((n) => !n.draft)
      .slice(0, 3)
      .map((n) => ({ title: n.title, href: `/news/${n.slug}` })),
    articles: getArticleMetas()
      .slice(0, 3)
      .map((a) => ({ title: a.title, href: `/blog/${a.slug}` })),
  };
  return cached;
}
