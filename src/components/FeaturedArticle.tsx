import Link from 'next/link';
import type { ArticleMeta } from '@/lib/insights';
import { ArticleMetaLine, CoverImage } from './ArticleCard';

export default function FeaturedArticle({ article, headingLevel = 'h3' }: { article: ArticleMeta; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <article className="group relative grid gap-8 lg:grid-cols-12 lg:gap-12">
      <div className="lg:col-span-7" data-anim="image">
        <CoverImage
          article={article}
          sizes="(min-width: 1024px) 58vw, 92vw"
          className="aspect-[16/10]"
        />
      </div>
      <div className="flex flex-col lg:col-span-5 lg:py-4" data-anim="stagger" data-delay="300">
        <p className="label mb-6">Featured</p>
        <ArticleMetaLine article={article} />
        <H className="display mt-5 text-3xl leading-[1.12] transition-colors group-hover:text-gold-light sm:text-4xl xl:text-[2.75rem]">
          <Link href={`/insights/${article.slug}`} className="after:absolute after:inset-0">
            {article.title}
          </Link>
        </H>
        <p className="mt-6 text-base leading-8 text-muted">{article.excerpt}</p>
        <div className="mt-8 flex items-center gap-6 border-t border-line pt-6 text-xs text-muted">
          {article.author && <span>By {article.author}</span>}
          <span>{article.readingMinutes} min read</span>
        </div>
        <span className="link-gold mt-8" aria-hidden>
          Read article <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
