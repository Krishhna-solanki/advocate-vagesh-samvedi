import Image from 'next/image';
import Link from 'next/link';
import type { ArticleMeta } from '@/lib/insights';
import { formatDate } from '@/lib/format';

export function ArticleMetaLine({ article, className = '' }: { article: Pick<ArticleMeta, 'categoryName' | 'date'>; className?: string }) {
  return (
    <p className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em] ${className}`}>
      <span className="font-semibold text-gold">{article.categoryName}</span>
      <span aria-hidden className="h-px w-4 bg-gold/50" />
      <time dateTime={article.date} className="text-muted">
        {formatDate(article.date)}
      </time>
    </p>
  );
}

export function CoverImage({
  article,
  sizes,
  priority = false,
  className = 'aspect-[3/2]',
}: {
  article: Pick<ArticleMeta, 'cover' | 'coverAlt' | 'categoryName' | 'title'>;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  return (
    <div className={`relative overflow-hidden bg-charcoal ${className}`}>
      {article.cover ? (
        <Image src={article.cover} alt={article.coverAlt} fill sizes={sizes} priority={priority} className="cover-tone object-cover" />
      ) : (
        // Typographic fallback for articles without a cover image
        <div className="texture-columns absolute inset-0 flex items-end p-6" aria-hidden>
          <span className="font-serif text-2xl italic text-gold/60">{article.categoryName}</span>
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/50 via-transparent to-transparent" />
    </div>
  );
}

export default function ArticleCard({ article, headingLevel = 'h3' }: { article: ArticleMeta; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <article className="group relative flex h-full flex-col">
      <CoverImage article={article} sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw" />
      <span aria-hidden className="absolute bottom-0 left-0 z-[1] h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100" />
      <div className="flex flex-1 flex-col border-b border-line pb-8 pt-6">
        <ArticleMetaLine article={article} />
        <H className="mt-4 font-serif text-2xl leading-snug text-ivory transition-colors group-hover:text-gold-light">
          <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </H>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-muted">{article.excerpt}</p>
        <span className="link-gold mt-auto pt-6" aria-hidden>
          Read article <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
