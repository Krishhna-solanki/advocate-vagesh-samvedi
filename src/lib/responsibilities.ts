import 'server-only';
import { imageSize, readCollection } from './content';
import type { GalleryImage } from './news';

// Organisational responsibilities beyond legal practice (About page cards + /about/responsibilities/[slug]).
// Managed in the CMS under "Responsibilities"; files live in content/responsibilities.
export type Responsibility = {
  slug: string;
  organisation: string;
  role: string;
  order: number;
  /** Page heading, e.g. "Leadership in Human Rights & Social Justice" (falls back to the organisation) */
  heading?: string;
  summary: string;
  /** Areas of focus shown as small cards on the detail page */
  themes: { title: string; text: string }[];
  cover?: string;
  coverAlt: string;
  coverCredit?: string;
  /** True while the page still shows temporary content: adds a notice and keeps it out of search engines */
  placeholder: boolean;
  gallery: GalleryImage[];
  body: string;
};

export const responsibilityPath = (slug: string) => `/about/responsibilities/${slug}`;

let cache: Responsibility[] | null = null;

export function getResponsibilities(): Responsibility[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCollection('responsibilities')
    .map(({ slug, data, body }) => ({
      slug,
      organisation: String(data.organisation ?? slug),
      role: String(data.role ?? ''),
      order: Number(data.order ?? 99),
      heading: data.heading || undefined,
      summary: String(data.summary ?? ''),
      themes: (Array.isArray(data.themes) ? data.themes : [])
        .filter((t: { title?: string }) => t?.title)
        .map((t: { title: string; text?: string }) => ({ title: String(t.title), text: String(t.text ?? '') })),
      cover: data.cover || undefined,
      coverAlt: String(data.coverAlt ?? data.organisation ?? ''),
      coverCredit: data.coverCredit || undefined,
      placeholder: Boolean(data.placeholder),
      gallery: (Array.isArray(data.gallery) ? data.gallery : [])
        .filter((g: { image?: string }) => g?.image)
        .map((g: { image: string; alt?: string; caption?: string }) => ({
          image: String(g.image),
          alt: String(g.alt ?? ''),
          caption: g.caption || undefined,
          ...imageSize(String(g.image)),
        })),
      body,
    }))
    .sort((a, b) => a.order - b.order);
  return cache;
}

export const getResponsibility = (slug: string) => getResponsibilities().find((r) => r.slug === slug);
