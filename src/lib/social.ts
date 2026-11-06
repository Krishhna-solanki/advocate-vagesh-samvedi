import 'server-only';
import { readCollection, SHOW_DRAFTS, toIso } from './content';

// Social Journey: photographs, reels and posts from events and professional activities.
// Managed in the CMS under "Social Journey"; files live in content/social.
export const PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube', 'Other'] as const;

export type SocialPost = {
  slug: string;
  caption: string;
  /** Undefined when the date is not known — never guessed */
  date?: string;
  /** Photograph, or for a video its still frame (poster) */
  image: string;
  imageAlt: string;
  /** Optional video file (e.g. an Instagram reel saved to /public/video), played muted when visible */
  video?: string;
  platform: string;
  url?: string;
  /** When the post was added to the website — orders posts whose own date is unknown */
  addedOn?: string;
  /** false keeps a post on the Social Journey page only */
  showOnHomepage: boolean;
  draft: boolean;
};

// Newest first, by the post's own date or, when that is unknown, by when it was added to the site
const sortKey = (p: SocialPost) => p.date ?? p.addedOn;
const newestFirst = (a: SocialPost, b: SocialPost) => {
  const ka = sortKey(a);
  const kb = sortKey(b);
  return ka && kb ? +new Date(kb) - +new Date(ka) : ka ? -1 : kb ? 1 : 0;
};

let cache: SocialPost[] | null = null;

export function getSocialPosts(): SocialPost[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCollection('social')
    .map(({ slug, data }) => ({
      slug,
      caption: String(data.caption ?? ''),
      date: toIso(data.date) || undefined,
      image: String(data.image || data.poster || ''),
      imageAlt: data.imageAlt ?? '',
      video: data.video || undefined,
      platform: String(data.platform ?? 'Other'),
      url: data.url || undefined,
      addedOn: toIso(data.addedOn) || undefined,
      showOnHomepage: data.showOnHomepage !== false,
      draft: Boolean(data.draft),
    }))
    // A post needs a photograph or a video still to be shown in the gallery
    .filter((p) => p.image && (SHOW_DRAFTS || !p.draft))
    .sort(newestFirst);
  return cache;
}

/**
 * Homepage selection: the latest posts (default 4), always including the most recent reels (default 2)
 * first, then the newest remaining posts. Posts marked `showOnHomepage: false` and drafts are left out;
 * everything stays on the Social Journey page.
 */
export function getHomepageSocial(limit = 4, reels = 2): SocialPost[] {
  const eligible = getSocialPosts().filter((p) => p.showOnHomepage && !p.draft);
  const latestReels = eligible.filter((p) => p.video).slice(0, reels);
  const others = eligible.filter((p) => !latestReels.includes(p)).slice(0, limit - latestReels.length);
  return [...latestReels, ...others];
}
