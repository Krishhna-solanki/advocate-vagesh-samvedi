import 'server-only';
import { site } from '../site';
import { practiceAreas } from '../practice-areas';
import { offices } from '../offices';
import { getNewsMetas } from '../news';
import { getArticleMetas } from '../insights';
import type { Knowledge } from './types';

// Extra words visitors use for each practice area (English, Hinglish and Hindi), on top of the words in its title
// and listed matters. Add a word here if the assistant misses a common way of asking.
const AREA_KEYWORDS: Record<string, string[]> = {
  'civil-law': ['civil', 'property', 'land', 'zameen', 'jameen', 'makaan', 'house', 'rent', 'tenant', 'kirayedar', 'contract', 'agreement', 'consumer', 'recovery', 'partition', 'bantwara', 'suit', 'dispute', 'vivad', 'संपत्ति', 'ज़मीन', 'जमीन', 'मकान', 'दीवानी', 'विवाद', 'उपभोक्ता'],
  'arbitration-adr': ['arbitration', 'arbitrator', 'mediation', 'conciliation', 'adr', 'settlement', 'samjhauta', 'मध्यस्थता', 'समझौता'],
  'business-corporate': ['business', 'company', 'corporate', 'firm', 'partnership', 'gst', 'compliance', 'registration', 'drafting', 'vyapar', 'dhandha', 'व्यापार', 'कंपनी', 'व्यवसाय'],
  'intellectual-property': ['trademark', 'trade mark', 'copyright', 'patent', 'brand', 'logo', 'ip', 'infringement', 'licensing', 'ट्रेडमार्क', 'कॉपीराइट', 'पेटेंट'],
  'cyber-law': ['cyber', 'online', 'fraud', 'scam', 'hacking', 'hacked', 'upi', 'bank', 'otp', 'lien', 'frozen', 'freeze', 'blocked account', 'data', 'privacy', 'it act', 'e-commerce', 'thagi', 'dhokha', 'साइबर', 'ऑनलाइन', 'धोखाधड़ी', 'ठगी', 'लियन'],
  'startup-advisory': ['startup', 'start-up', 'founder', 'new business', 'incorporation', 'llp', 'pvt ltd', 'स्टार्टअप'],
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
    firm: site.firm.name,
    education: `${site.education.institution}, ${site.education.city}`,
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
