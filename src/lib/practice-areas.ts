// Practice areas, worded as in the client's content document (November 2026, Page 3).
// Existing URLs are kept where an area continues (civil-law, cyber-law, intellectual-property, business-corporate,
// arbitration-adr); the former "startup-advisory" page redirects to business-corporate (next.config.mjs).
export type PracticeArea = {
  slug: string;
  /** Card title */
  title: string;
  /** Heading on the area's own page */
  pageTitle: string;
  icon: 'scales' | 'gavel' | 'briefcase' | 'seal' | 'shield' | 'compass' | 'landmark' | 'family' | 'handshake';
  /** Card description */
  summary: string;
  intro: string;
  listIntro: string;
  matters: string[];
  closing: string;
  seoDescription: string;
  insightCategory?: string;
};

export const practiceAreas: PracticeArea[] = [
  {
    slug: 'civil-law',
    title: 'Civil Litigation',
    pageTitle: 'Civil Litigation',
    icon: 'scales',
    summary: 'Civil suits, contractual disputes, recovery proceedings, injunctions, declaratory relief and other civil remedies.',
    intro: 'Civil litigation involves disputes concerning legal rights, contractual obligations, property interests and other civil claims.',
    listIntro: 'Advocate Vagesh Samvedi undertakes civil legal matters involving:',
    matters: [
      'Civil suits and recovery proceedings.',
      'Contractual disputes and enforcement.',
      'Temporary and permanent injunctions.',
      'Declaratory relief.',
      'Specific performance.',
      'Civil procedural applications.',
      'Documentary evidence and legal claims.',
    ],
    closing:
      'The approach to civil litigation involves examining the underlying facts, identifying the applicable legal provisions and pursuing appropriate remedies through the competent court.',
    seoDescription: 'Information about civil litigation, recovery proceedings, contractual disputes, injunctions and civil remedies.',
  },
  {
    slug: 'property-revenue-law',
    title: 'Property & Revenue Law',
    pageTitle: 'Property & Revenue Law',
    icon: 'landmark',
    summary: 'Property disputes, land ownership, possession matters, mutation, revenue records and land-related proceedings.',
    intro: 'Property and revenue disputes frequently involve questions of ownership, possession, title, land records and statutory rights.',
    listIntro: 'Legal assistance in this area may involve:',
    matters: [
      'Property ownership and title disputes.',
      'Possession-related disputes.',
      'Agricultural land matters.',
      'Mutation and revenue-record proceedings.',
      'Correction of land records.',
      'Revenue appeals and applications.',
      'Property documentation disputes.',
      'Matters involving registration and transfer of property.',
    ],
    closing:
      'Each matter requires careful examination of title documents, revenue records, applicable legislation and the legal remedies available before the competent authority or court.',
    seoDescription: 'Legal information concerning property disputes, land records, mutation, ownership and revenue proceedings.',
  },
  {
    slug: 'criminal-law',
    title: 'Criminal Law',
    pageTitle: 'Criminal Litigation',
    icon: 'gavel',
    summary: 'Criminal proceedings, bail applications, criminal defence, complaints and procedural remedies.',
    intro: 'Criminal law concerns offences, investigation, prosecution, defence and procedural safeguards recognised under Indian law.',
    listIntro: 'Legal assistance in this area may include:',
    matters: [
      'Bail applications.',
      'Criminal defence proceedings.',
      'Criminal complaints.',
      'Procedural applications.',
      'Matters involving investigation and prosecution.',
      'Representation concerning applicable criminal-law provisions.',
      'Legal remedies available under criminal procedure.',
    ],
    closing:
      'The approach to criminal matters requires careful consideration of allegations, evidence, procedural compliance and the legal rights of the persons involved.',
    seoDescription: 'Legal information concerning criminal proceedings, bail applications, defence and procedural remedies.',
  },
  {
    slug: 'family-matrimonial-law',
    title: 'Family & Matrimonial Law',
    pageTitle: 'Family & Matrimonial Law',
    icon: 'family',
    summary: 'Divorce, maintenance, matrimonial disputes, restitution of conjugal rights and related family proceedings.',
    intro:
      'Family-law matters involve personal relationships, matrimonial rights, maintenance obligations and disputes arising within family relationships.',
    listIntro: 'Legal assistance may include:',
    matters: [
      'Divorce proceedings.',
      'Maintenance applications.',
      'Matrimonial disputes.',
      'Restitution of conjugal rights.',
      'Related family-law proceedings.',
      'Matrimonial settlements and negotiated resolution.',
      'Proceedings under applicable personal and statutory laws.',
    ],
    closing:
      'Each matter is considered with due regard to its individual circumstances, applicable personal laws and procedural requirements.',
    seoDescription: 'Information about matrimonial disputes, divorce, maintenance and family-law proceedings.',
  },
  {
    slug: 'cyber-law',
    title: 'Cyber Law & Digital Offences',
    pageTitle: 'Cyber Law & Digital Legal Remedies',
    icon: 'shield',
    summary: 'Online financial fraud, cyber complaints, electronic evidence, digital offences and applicable legal remedies.',
    intro:
      'Digital transactions and technology-enabled activities have created legal challenges involving online fraud, electronic evidence, privacy and cyber offences.',
    listIntro: 'Legal assistance in this area may include:',
    matters: [
      'Online financial fraud matters.',
      'Cybercrime complaints.',
      'Digital payment fraud.',
      'Bank-account lien and freezing-related disputes.',
      'Electronic records and digital evidence.',
      'Legal issues under the Information Technology Act, 2000.',
      'Appropriate legal remedies before competent authorities and courts.',
    ],
    closing:
      'Cyber-related matters often require timely action, preservation of digital records and an understanding of the legal and procedural framework governing electronic transactions.',
    seoDescription: 'Legal information concerning cyber fraud, digital offences, electronic evidence and available legal remedies.',
    insightCategory: 'technology-it-law',
  },
  {
    slug: 'intellectual-property',
    title: 'Intellectual Property Rights',
    pageTitle: 'Intellectual Property Rights',
    icon: 'seal',
    summary: 'Trademark, copyright, intellectual property protection and emerging technology-related legal questions.',
    intro:
      'Intellectual Property Rights concern the protection and lawful use of creative works, distinctive marks, inventions and other forms of intellectual property.',
    listIntro: 'This area of legal interest includes:',
    matters: [
      'Trademark protection and disputes.',
      'Copyright protection.',
      'Intellectual property infringement.',
      'Legal issues involving digital content.',
      'Intellectual property rights in technology-related developments.',
      'Emerging questions concerning artificial intelligence and intellectual property.',
    ],
    closing:
      'With an academic qualification in Intellectual Property Rights, this area forms an important part of Advocate Vagesh Samvedi’s academic and professional interests.',
    seoDescription: 'Explore intellectual property interests involving trademarks, copyright and emerging technology-related legal questions.',
    insightCategory: 'intellectual-property',
  },
  {
    slug: 'business-corporate',
    title: 'Business & Commercial Law',
    pageTitle: 'Business & Commercial Legal Matters',
    icon: 'briefcase',
    summary: 'Contractual disputes, commercial recovery, business documentation and legal advisory.',
    intro:
      'Commercial legal matters involve contractual relationships, business obligations, monetary claims and disputes arising from commercial transactions.',
    listIntro: 'Legal assistance may include:',
    matters: [
      'Contractual disputes.',
      'Recovery of outstanding amounts.',
      'Commercial claims.',
      'Business documentation.',
      'Contract interpretation.',
      'Consumer-related disputes.',
      'Legal advisory concerning applicable commercial obligations.',
    ],
    closing:
      'The focus is on understanding contractual rights, identifying legal risks and examining appropriate remedies under the applicable law.',
    seoDescription: 'Information about contractual disputes, commercial recovery, business documentation and commercial legal advisory.',
    insightCategory: 'business-taxation',
  },
  {
    slug: 'arbitration-adr',
    title: 'Alternative Dispute Resolution',
    pageTitle: 'Alternative Dispute Resolution',
    icon: 'handshake',
    summary: 'Mediation, negotiation, conciliation and arbitration-related legal assistance.',
    intro:
      'Alternative Dispute Resolution provides mechanisms for resolving disputes outside conventional contested litigation, wherever legally appropriate.',
    listIntro: 'Relevant methods include:',
    matters: ['Mediation.', 'Negotiation.', 'Conciliation.', 'Arbitration-related legal assistance.', 'Settlement discussions.'],
    closing:
      'The suitability of an alternative dispute-resolution mechanism depends on the nature of the dispute, the parties involved and the applicable statutory framework.',
    seoDescription: 'Information about mediation, negotiation, conciliation and arbitration-related legal assistance in India.',
    insightCategory: 'arbitration-adr',
  },
];

export const getPracticeArea = (slug: string) => practiceAreas.find((p) => p.slug === slug);
