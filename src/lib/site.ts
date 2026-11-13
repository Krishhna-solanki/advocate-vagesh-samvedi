// Single source of truth for professional details.
// Updated from the client's "Final Website Content & Developer Implementation Document" (November 2026).
export const site = {
  name: 'Vagesh Samvedi',
  /** The professional name, used wherever the full name is shown */
  fullName: 'Advocate Vagesh Samvedi',
  shortName: 'Adv. Vagesh Samvedi',
  role: 'Advocate & Legal Consultant',
  // Set at build time in next.config.mjs (NEXT_PUBLIC_SITE_URL, else the Vercel production domain)
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  description:
    'Advocate Vagesh Samvedi is an independent legal practitioner engaged in litigation, legal representation and advisory work across Madhya Pradesh and Gujarat.',
  /** Principal professional location (structured data, compact displays) */
  location: { city: 'Petlawad', district: 'Jhabua', region: 'Madhya Pradesh', country: 'India' },
  /** Professional locations shown in contact details */
  locations: ['Petlawad, District Jhabua', 'Indore'],
  /** Geographical reach — areas of professional reach, not offices */
  reach: 'Madhya Pradesh & selected locations in Gujarat',
  /** Places listed in the Geographical Reach section (Contact page) and used by the chat assistant */
  reachPlaces: {
    madhyaPradesh: ['Jhabua', 'Petlawad', 'Thandla', 'Indore', 'Ujjain', 'Dhar', 'Sardarpur', 'Ratlam'],
    gujarat: ['Vadodara', 'Dahod', 'Ahmedabad'],
  },
  email: 'adv.vageshsamvedi@gmail.com',
  // Updated by the client on 12 Nov 2026. Set to null to hide everywhere.
  phone: { display: '+91 92023 15511', href: 'tel:+919202315511' } as { display: string; href: string } | null,
  // Bar Council enrolment number — display only once supplied and approved.
  enrolment: null as string | null,
  barCouncil: 'State Bar Council of Madhya Pradesh',
  practiceSince: 2025,
  education: [
    { degree: 'B.A. LL.B. (Honours)', institution: 'Navsamvat Law College, Ujjain', detail: 'Completed: 2025' },
    { degree: 'Master of Laws (LL.M.) — Intellectual Property Rights', institution: 'Renaissance University, Indore', detail: 'Status: Completed' },
    { degree: 'Psychology Certificate Course', institution: 'Indira Gandhi National Open University (IGNOU)', detail: '2022' },
    { degree: 'Cybersecurity Certification', institution: 'NSDC / Skill India', detail: '2024' },
    { degree: 'Alternative Dispute Resolution Certificate', institution: 'Alison', detail: '2025' },
  ],
  /** Organisational responsibilities */
  roles: [
    { title: 'District President', organisation: 'Judicial Human Rights Council, Jhabua' },
    { title: 'Joint Secretary', organisation: 'Boxing Association, Jhabua' },
  ],
  profiles: [
    // Verified by the client (2 November 2026). `social: true` entries appear as icons in the header, footer and social sections.
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/adv-vagesh-samvedi-07a545232/', social: true },
    { label: 'Instagram', href: 'https://www.instagram.com/adv.vageshsamvedi/?hl=en', social: true },
    { label: 'Digital Card', href: 'https://dvc.vageshsamvedi.com', social: false },
  ],
  /** Official WhatsApp channel (Contact section button) */
  whatsappChannel: 'https://whatsapp.com/channel/0029Vb9cw7u1Hsq1s8UVhU06',
  portrait: '/images/portrait.jpg',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/practice-areas', label: 'Practice Areas' },
  { href: '/news', label: 'News' },
  { href: '/blog', label: 'Blog' },
  { href: '/social', label: 'Social Journey' },
  { href: '/contact', label: 'Contact' },
];

/** Footer navigation (content document, Page 10) */
export const footerNav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/practice-areas', label: 'Practice Areas' },
  { href: '/publications', label: 'Research & Publications' },
  { href: '/blog', label: 'Legal Insights' },
  { href: '/news', label: 'News & Updates' },
  { href: '/social', label: 'Beyond the Courtroom' },
  { href: '/contact', label: 'Contact' },
];

export const socialProfiles = site.profiles.filter((p) => p.social);

export const absoluteUrl = (path = '/') => `${site.url}${path === '/' ? '' : path}`;
