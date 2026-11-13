// Shapes shared by the server (which builds the knowledge) and the chat widget (which answers from it).
export type Knowledge = {
  name: string;
  role: string;
  city: string;
  region: string;
  education: string;
  educationHi: string;
  email: string;
  phone: string | null;
  phoneHref: string | null;
  profiles: { label: string; href: string }[];
  practiceAreas: { title: string; href: string; summary: string; matters: string[]; keywords: string[] }[];
  offices: { title: string; name: string; address: string; directions: string | null }[];
  /** Every qualification in the Education section, in order */
  qualifications: { degree: string; institution: string; detail: string }[];
  barCouncil: string;
  practiceSince: number;
  /** Organisational responsibilities beyond legal practice (Home page section + detail pages) */
  responsibilities: { organisation: string; role: string; heading: string; summary: string; themes: string[]; href: string }[];
  /** Geographical reach (areas of practice, not offices) */
  reach: { madhyaPradesh: string[]; gujarat: string[] };
  /** Academic interests from the Research & Publications page */
  interests: string[];
  whatsappChannel: string | null;
  news: { title: string; href: string }[];
  articles: { title: string; href: string }[];
};

export type Link = { label: string; href: string; external?: boolean };

export type Reply = {
  text: string;
  links?: Link[];
  /** Follow-up questions offered as buttons */
  suggestions?: string[];
  /** 'book' starts the booking form */
  action?: 'book';
};
