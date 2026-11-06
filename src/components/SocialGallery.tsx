import Image from 'next/image';
import type { SocialPost } from '@/lib/social';
import { formatDate } from '@/lib/format';
import PlatformIcon from './PlatformIcon';
import SocialVideo from './SocialVideo';

// Editorial photo grid: the first photo is a large 2×2 tile (and every later 7th); reels are tall 1×2 tiles.
// When the gallery includes reels, photos take the same tall slot on larger screens (and full width on phones)
// so rows line up without gaps.
export default function SocialGallery({ posts }: { posts: SocialPost[] }) {
  const hasReels = posts.some((p) => p.video);
  return (
    <ul data-anim="stagger" className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {posts.map((post, i) => {
        if (post.video) {
          return (
            // Portrait tile: full width on phones, one column × two rows on larger screens; 9:16 when on its own
            <li key={post.slug} className="col-span-2 row-span-3 md:col-span-1 md:row-span-2">
              <div className="aspect-[9/16] h-full w-full">
                <SocialVideo
                  src={post.video}
                  poster={post.image}
                  label={post.imageAlt || post.caption}
                  platform={post.platform}
                  url={post.url}
                  caption={post.caption}
                  meta={post.date ? formatDate(post.date) : undefined}
                />
              </div>
            </li>
          );
        }
        const tall = hasReels;
        const large = !tall && i % 7 === 0;
        const roomy = large || tall;
        const inner = (
          <>
            <Image
              src={post.image}
              alt={post.imageAlt || post.caption}
              fill
              sizes={large ? '(min-width: 768px) 50vw, 100vw' : tall ? '(min-width: 768px) 25vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
              className={`object-cover transition-[scale,filter] duration-[1200ms] [filter:grayscale(0.35)_brightness(0.8)] group-hover:[filter:grayscale(0)_brightness(0.95)] motion-safe:group-hover:scale-105 ${tall ? 'object-[50%_25%]' : ''}`}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
            <span aria-hidden className="absolute inset-0 border border-transparent transition-colors duration-700 group-hover:border-gold/50" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                <PlatformIcon platform={post.platform} className="h-3.5 w-3.5" />
                {post.platform}
                {/* Small tiles on phones are too narrow for the date */}
                {post.date && (
                  <>
                    <span aria-hidden className={`text-muted ${roomy ? '' : 'hidden md:inline'}`}>·</span>
                    <time dateTime={post.date} className={`text-muted ${roomy ? '' : 'hidden md:inline'}`}>
                      {formatDate(post.date)}
                    </time>
                  </>
                )}
              </p>
              <p
                className={`mt-2 font-serif leading-snug text-ivory ${large ? 'line-clamp-3 text-xl md:text-2xl' : tall ? 'line-clamp-3 text-sm md:text-base' : 'line-clamp-2 text-sm md:text-base'}`}
              >
                {post.caption}
              </p>
              {post.url && (
                <span className={`link-gold mt-3 ${tall ? 'inline-flex' : 'hidden md:inline-flex'}`} aria-hidden>
                  View post <span className="arrow">↗</span>
                </span>
              )}
            </div>
          </>
        );
        const tile = `group relative block overflow-hidden bg-charcoal ${large || tall ? 'aspect-square md:aspect-auto' : 'aspect-square'}`;
        return (
          <li key={post.slug} className={tall ? 'col-span-2 md:col-span-1 md:row-span-2' : large ? 'col-span-2 md:row-span-2' : ''}>
            {post.url ? (
              <a href={post.url} target="_blank" rel="noopener noreferrer" className={`${tile} h-full`}>
                {inner}
                <span className="sr-only">View this post on {post.platform} (opens in a new tab)</span>
              </a>
            ) : (
              <div className={`${tile} h-full`}>{inner}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
