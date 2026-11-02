import 'server-only';
import { byDateDesc, readCollection, SHOW_DRAFTS, toIso } from './content';

// Social Life: photographs and posts from events and professional activities.
// Managed in the CMS under "Social Life"; files live in content/social.
export const PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook', 'X', 'YouTube', 'Other'] as const;

export type SocialPost = {
  slug: string;
  caption: string;
  date: string;
  image: string;
  imageAlt: string;
  platform: string;
  url?: string;
  draft: boolean;
};

let cache: SocialPost[] | null = null;

export function getSocialPosts(): SocialPost[] {
  if (cache && process.env.NODE_ENV === 'production') return cache;
  cache = readCollection('social')
    .map(({ slug, data }) => ({
      slug,
      caption: String(data.caption ?? ''),
      date: toIso(data.date),
      image: String(data.image ?? ''),
      imageAlt: data.imageAlt ?? '',
      platform: String(data.platform ?? 'Other'),
      url: data.url || undefined,
      draft: Boolean(data.draft),
    }))
    // A post without a photograph cannot be shown in the gallery
    .filter((p) => p.image && (SHOW_DRAFTS || !p.draft))
    .sort(byDateDesc);
  return cache;
}
