// Shapes shared by the server (which builds the knowledge) and the chat widget (which answers from it).
export type Knowledge = {
  name: string;
  role: string;
  city: string;
  region: string;
  firm: string;
  education: string;
  email: string;
  phone: string | null;
  phoneHref: string | null;
  profiles: { label: string; href: string }[];
  practiceAreas: { title: string; href: string; summary: string; matters: string[]; keywords: string[] }[];
  offices: { title: string; name: string; address: string; directions: string | null }[];
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
