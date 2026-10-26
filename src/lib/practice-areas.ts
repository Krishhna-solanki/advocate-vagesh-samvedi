// Practice areas as described on the previous website (homepage, Legal Advisory and
// Law Astra & Associates pages). Descriptions deliberately avoid any promise of outcome.
export type PracticeArea = {
  slug: string;
  title: string;
  icon: 'scales' | 'gavel' | 'briefcase' | 'seal' | 'shield' | 'compass';
  summary: string;
  intro: string;
  matters: string[];
  insightCategory?: string;
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'civil-law',
    title: 'Civil Law & Dispute Resolution',
    icon: 'scales',
    summary:
      'Advice and representation in property, contractual and consumer disputes, with an emphasis on early, preventive resolution.',
    intro:
      'Civil disputes are often best addressed before they harden into litigation. Advice in this area focuses on understanding the facts and documents early, exploring negotiated solutions, and — where litigation is necessary — representation and careful case management.',
    matters: [
      'Property disputes',
      'Contractual disagreements',
      'Consumer protection matters',
      'General civil litigation',
      'Preventive advice and negotiation',
    ],
    insightCategory: 'legal-commentary',
  },
  {
    slug: 'arbitration-adr',
    title: 'Arbitration & ADR',
    icon: 'gavel',
    summary: 'Commercial arbitration, mediation and conciliation as alternatives to conventional court proceedings.',
    intro:
      'Arbitration, mediation and conciliation offer parties a private and often more flexible route to resolving disputes. Work in this area — including through Law Astra & Associates, Indore — covers commercial and contractual matters.',
    matters: [
      'Commercial arbitration',
      'Contractual disputes',
      'Partnership disagreements',
      'Cross-border matters',
      'Mediation and conciliation',
    ],
    insightCategory: 'arbitration-adr',
  },
  {
    slug: 'business-corporate',
    title: 'Business & Corporate Advisory',
    icon: 'briefcase',
    summary: 'Contracts, business structuring, compliance and commercial disputes for businesses and entrepreneurs.',
    intro:
      'Businesses face legal questions at every stage — at formation, in their contracts, with employees and in their dealings with regulators. Advisory work here aims to identify risk early and document relationships clearly.',
    matters: [
      'Corporate and commercial law',
      'Contract drafting and review',
      'Business structuring and registration',
      'Regulatory compliance',
      'Commercial disputes',
    ],
    insightCategory: 'business-taxation',
  },
  {
    slug: 'intellectual-property',
    title: 'Intellectual Property Rights',
    icon: 'seal',
    summary: 'Trademark, copyright and patent registration, licensing, enforcement and infringement disputes.',
    intro:
      'A brand, a body of creative work or an invention is frequently a business’s most valuable asset. Advice in this area covers securing those rights and responding when they are infringed.',
    matters: [
      'Trademark registration and protection',
      'Copyright registration',
      'Patent registration',
      'Licensing arrangements',
      'Enforcement and infringement disputes',
    ],
    insightCategory: 'intellectual-property',
  },
  {
    slug: 'cyber-law',
    title: 'Cyber Law & Data Protection',
    icon: 'shield',
    summary: 'IT Act compliance, data protection, online fraud, data breaches and e-commerce disputes.',
    intro:
      'Technology raises legal questions that move quickly. Work in this area covers compliance under the Information Technology Act, data-protection obligations and disputes that arise online.',
    matters: [
      'IT Act compliance',
      'Data protection and privacy compliance',
      'Online fraud and identity theft',
      'Data breaches',
      'E-commerce disputes',
      'Cybersecurity regulations',
    ],
    insightCategory: 'technology-it-law',
  },
  {
    slug: 'startup-advisory',
    title: 'Startup & Legal Consulting',
    icon: 'compass',
    summary:
      'Legal groundwork for founders — formation, founding agreements, compliance and protecting early brand assets.',
    intro:
      'Early legal decisions shape a startup’s future. Consulting in this area helps founders choose a structure, document their arrangements and put compliance and intellectual property on a sound footing.',
    matters: [
      'Choosing a business structure',
      'Formation and registration',
      'Founder and vendor agreements',
      'Compliance foundations',
      'Brand and IP protection',
    ],
    insightCategory: 'business-taxation',
  },
];

export const getPracticeArea = (slug: string) => practiceAreas.find((p) => p.slug === slug);
