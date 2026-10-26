// Single source of truth for professional details.
// Everything here was taken from the previous website (vageshsamvedi.com) or the
// advocate's public LinkedIn profile. Confirm before launch — see README "Verify before launch".
export const site = {
  name: 'Vagesh Samvedi',
  shortName: 'Adv. Vagesh Samvedi',
  role: 'Advocate & Legal Consultant',
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.vageshsamvedi.com').replace(/\/$/, ''),
  description:
    'Advocate Vagesh Samvedi — legal advisory in civil law, cyber law and intellectual property, with legal insights on developments that matter to businesses and individuals.',
  location: { city: 'Indore', region: 'Madhya Pradesh', country: 'India' },
  email: 'adv.vageshsamvedi@gmail.com',
  // Listed publicly on the previous homepage. Set to null to hide everywhere.
  phone: { display: '+91 78040 97520', href: 'tel:+917804097520' } as { display: string; href: string } | null,
  // Bar Council enrolment number — permitted on advocate websites. Add when confirmed.
  enrolment: null as string | null,
  education: { institution: 'Vikram University', city: 'Ujjain' },
  firm: { name: 'Law Astra & Associates', city: 'Indore', logo: '/images/law-astra-logo.png' },
  profiles: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/vagesh-samvedi-07a545232/' },
    { label: 'Digital Card', href: 'https://dvc.vageshsamvedi.com' },
  ],
  portrait: '/images/portrait.jpg',
};

export const nav = [
  { href: '/', label: 'Home' },
  { href: '/about', label: 'About' },
  { href: '/practice-areas', label: 'Practice Areas' },
  { href: '/insights', label: 'Insights & News' },
  { href: '/publications', label: 'Publications' },
  { href: '/contact', label: 'Contact' },
];

export const absoluteUrl = (path = '/') => `${site.url}${path === '/' ? '' : path}`;
