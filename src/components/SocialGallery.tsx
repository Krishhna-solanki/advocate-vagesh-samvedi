import Image from 'next/image';
import type { SocialPost } from '@/lib/social';
import { formatDate } from '@/lib/format';
import PlatformIcon from './PlatformIcon';

// Editorial photo grid: the first post is a large 2×2 tile; every later 7th post is large again.
export default function SocialGallery({ posts }: { posts: SocialPost[] }) {
  return (
    <ul data-anim="stagger" className="grid grid-flow-dense grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
      {posts.map((post, i) => {
        const large = i % 7 === 0;
        const inner = (
          <>
            <Image
              src={post.image}
              alt={post.imageAlt || post.caption}
              fill
              sizes={large ? '(min-width: 768px) 50vw, 100vw' : '(min-width: 768px) 25vw, 50vw'}
              className="object-cover transition-[scale,filter] duration-[1200ms] [filter:grayscale(0.35)_brightness(0.8)] group-hover:[filter:grayscale(0)_brightness(0.95)] motion-safe:group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-90 transition-opacity duration-700 group-hover:opacity-100" />
            <span aria-hidden className="absolute inset-0 border border-transparent transition-colors duration-700 group-hover:border-gold/50" />
            <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 md:p-5">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-gold">
                <PlatformIcon platform={post.platform} className="h-3.5 w-3.5" />
                {post.platform}
                {/* Small tiles on phones are too narrow for the date */}
                <span aria-hidden className={`text-muted ${large ? '' : 'hidden md:inline'}`}>·</span>
                <time dateTime={post.date} className={`text-muted ${large ? '' : 'hidden md:inline'}`}>
                  {formatDate(post.date)}
                </time>
              </p>
              <p className={`mt-2 font-serif leading-snug text-ivory ${large ? 'line-clamp-3 text-xl md:text-2xl' : 'line-clamp-2 text-sm md:text-base'}`}>{post.caption}</p>
              {post.url && (
                <span className="link-gold mt-3 hidden md:inline-flex" aria-hidden>
                  View post <span className="arrow">↗</span>
                </span>
              )}
            </div>
          </>
        );
        const tile = `group relative block overflow-hidden bg-charcoal ${large ? 'aspect-square md:aspect-auto' : 'aspect-square'}`;
        return (
          <li key={post.slug} className={large ? 'col-span-2 md:row-span-2' : ''}>
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
