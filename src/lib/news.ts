import 'server-only';
import { byDateDesc, readCollection, SHOW_DRAFTS, toIso } from './content';

// News: the advocate's professional activities, achievements, events and updates.
// Managed in the CMS under "News"; files live in content/news.
export const NEWS_TYPES = ['Achievement', 'Event', 'Professional Activity', 'Legal Update', 'Announcement', 'Media'] as const;

export type NewsMeta = {
  slug: string;
  title: string;
  date: string;
  type: string;
  location?: string;
  excerpt: string;
  cover?: string;
  coverAlt: string;
  link?: string;
  linkLabel?: string;
  featured: boolean;
  draft: boolean;
};
export type NewsItem = NewsMeta & { body: string };

let cache: NewsItem[] | null = null;

export function getAllNews(): NewsItem[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCollection('news')
    .map(({ slug, data, body }) => ({
      slug,
      title: String(data.title ?? slug),
      date: toIso(data.date),
      type: String(data.type ?? 'Announcement'),
      location: data.location || undefined,
      excerpt: data.excerpt ?? '',
      cover: data.cover || undefined,
      coverAlt: data.coverAlt ?? '',
      link: data.link || undefined,
      linkLabel: data.linkLabel || undefined,
      featured: Boolean(data.featured),
      draft: Boolean(data.draft),
      body,
    }))
    .filter((n) => SHOW_DRAFTS || !n.draft)
    .sort(byDateDesc);
  return cache;
}

export const getNewsMetas = (): NewsMeta[] => getAllNews().map(({ body: _body, ...meta }) => meta);

export const getNewsItem = (slug: string) => getAllNews().find((n) => n.slug === slug);
