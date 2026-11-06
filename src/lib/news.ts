import 'server-only';
import { imageSize, readCollection, SHOW_DRAFTS, toIso } from './content';

// News: the advocate's professional activities, achievements, events and updates.
// Managed in the CMS under "News"; files live in content/news.
// The four News categories, in filter order. Keep in sync with the CMS select in public/admin/config.yml.
export const NEWS_CATEGORIES = ['Cyber Law & Courts', 'Human Rights & Legal Affairs', 'Appointments & Achievements', 'Community & Events'] as const;

// Earlier and generic category names map onto the four above, so older entries are never left uncategorised
const CATEGORY_ALIASES: Record<string, (typeof NEWS_CATEGORIES)[number]> = {
  'Cyber Crime & Legal Updates': 'Cyber Law & Courts',
  'Cyber Law & Court Updates': 'Cyber Law & Courts',
  'Human Rights & Legal Developments': 'Human Rights & Legal Affairs',
  'Legal Update': 'Human Rights & Legal Affairs',
  'Professional Achievements & Appointments': 'Appointments & Achievements',
  Achievement: 'Appointments & Achievements',
  Announcement: 'Appointments & Achievements',
  'Social Activities & Community Engagement': 'Community & Events',
  Event: 'Community & Events',
  'Professional Activity': 'Community & Events',
  Media: 'Community & Events',
};

/** Canonical category for a stored value (unknown values are kept as written, so nothing disappears). */
export function newsCategory(value: unknown): string {
  const v = String(value ?? '').trim();
  if (!v) return 'Human Rights & Legal Affairs';
  return CATEGORY_ALIASES[v] ?? v;
}

export type NewsMeta = {
  slug: string;
  title: string;
  /** Publication date. Undefined when the source shows none — never guessed. */
  date?: string;
  type: string;
  location?: string;
  /** Newspaper or outlet that published the report, e.g. "Dainik Crime Darpan" */
  publication?: string;
  excerpt: string;
  cover?: string;
  coverAlt: string;
  /** Intrinsic size of the cover image, read from the file, so it can be shown uncropped without layout shift */
  coverSize?: { width: number; height: number };
  /** "clipping": a newspaper page — shown whole at its own proportions, never cropped or tinted */
  coverStyle: 'photo' | 'clipping';
  link?: string;
  linkLabel?: string;
  /** Additional images (e.g. further newspaper clippings of the same story), shown below the main image */
  gallery: GalleryImage[];
  /** Optional heading for the gallery (default depends on the cover style) */
  galleryTitle?: string;
  featured: boolean;
  draft: boolean;
};
export type NewsItem = NewsMeta & { body: string };
export type GalleryImage = { image: string; alt: string; caption?: string; width?: number; height?: number };

let cache: NewsItem[] | null = null;

// Newest first; undated items (date not stated in the source) come after all dated ones
const newestFirst = (a: NewsMeta, b: NewsMeta) =>
  a.date && b.date ? +new Date(b.date) - +new Date(a.date) : a.date ? -1 : b.date ? 1 : 0;

export function getAllNews(): NewsItem[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCollection('news')
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? slug),
      date: toIso(data.date) || undefined,
      type: newsCategory(data.type),
      location: data.location || undefined,
      publication: data.publication || undefined,
      excerpt: data.excerpt ?? '',
      cover: data.cover || undefined,
      coverAlt: data.coverAlt ?? '',
      coverSize: data.cover ? imageSize(data.cover) : undefined,
      coverStyle: data.coverStyle === 'clipping' ? ('clipping' as const) : ('photo' as const),
      link: data.link || undefined,
      linkLabel: data.linkLabel || undefined,
      gallery: (Array.isArray(data.gallery) ? data.gallery : [])
        .filter((g: { image?: string }) => g?.image)
        .map((g: { image: string; alt?: string; caption?: string }) => ({
          image: String(g.image),
          alt: String(g.alt ?? ''),
          caption: g.caption || undefined,
          ...imageSize(String(g.image)),
        })),
      galleryTitle: data.galleryTitle || undefined,
      featured: Boolean(data.featured),
      draft: Boolean(data.draft),
      body,
    }))
    .filter((n) => SHOW_DRAFTS || !n.draft)
    .sort(newestFirst);
  return cache;
}

export const getNewsMetas = (): NewsMeta[] => getAllNews().map(({ body: _body, ...meta }) => meta);

export const getNewsItem = (slug: string) => getAllNews().find((n) => n.slug === slug);
