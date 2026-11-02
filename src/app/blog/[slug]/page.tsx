import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ArticleCard, { ArticleMetaLine, CoverImage } from '@/components/ArticleCard';
import TableOfContents from '@/components/TableOfContents';
import ShareButtons from '@/components/ShareButtons';
import JsonLd from '@/components/JsonLd';
import { getAdjacent, getAllArticles, getArticle, getRelated, renderMarkdown } from '@/lib/insights';
import { articleJsonLd, breadcrumbJsonLd, metaDescription } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllArticles().map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  const title = a.seoTitle ?? a.title;
  const description = a.seoDescription ?? metaDescription(a.excerpt);
  return {
    title,
    description,
    alternates: { canonical: `/blog/${a.slug}` },
    robots: a.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      title,
      description,
      url: `/blog/${a.slug}`,
      publishedTime: a.date,
      modifiedTime: a.updated ?? a.date,
      section: a.categoryName,
      tags: a.tags,
      ...(a.author ? { authors: [a.author] } : {}),
      ...(a.cover ? { images: [{ url: a.cover, alt: a.coverAlt }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function ArticlePage({ params }: Params) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const { html, headings } = await renderMarkdown(article.body);
  const { previous, next } = getAdjacent(slug);
  const related = getRelated(article);
  const showToc = headings.length >= 3;
  // An excerpt that is just the article's opening words would repeat the first paragraph
  const flat = (s: string) => s.replace(/[\\*_]/g, '').replace(/[…\s]+$/u, '').replace(/\s+/g, ' ').trim().toLowerCase();
  const showStandfirst = Boolean(article.excerpt) && !flat(article.body).startsWith(flat(article.excerpt).slice(0, 80));
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Blog & Articles', path: '/blog' },
    { name: article.title, path: `/blog/${article.slug}` },
  ];

  return (
    <article>
      <header className="texture-columns border-b border-line pb-14 pt-36 md:pt-44">
        <div className="container">
          <div data-anim="fade-up">
            <Breadcrumbs items={crumbs} />
          </div>
          <div className="mt-12 max-w-4xl">
            {article.draft && <p className="mb-4 inline-block border border-gold px-3 py-1 text-xs uppercase tracking-widest text-gold">Draft preview</p>}
            <div data-anim="fade-up" data-delay="100">
              <ArticleMetaLine article={article} />
            </div>
            <h1 data-anim="heading" data-delay="150" className="display mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-[4rem]">
              {article.title}
            </h1>
            {showStandfirst && (
              <p className="mt-8 max-w-3xl font-serif text-xl italic leading-relaxed text-ivory/75 md:text-2xl" data-anim="fade-up" data-delay="450">
                {article.excerpt}
              </p>
            )}
            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted" data-anim="fade-up" data-delay="600">
              {article.author && (
                <span>
                  By{' '}
                  <Link href="/about" className="text-ivory hover:text-gold-light">
                    {article.author}
                  </Link>
                </span>
              )}
              <span>{article.readingMinutes} min read</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container">
        <figure className="mx-auto -mt-px max-w-6xl pt-12">
          <div data-anim="image" data-delay="300">
            <CoverImage article={article} priority sizes="(min-width: 1280px) 1152px, 100vw" className="aspect-[16/9]" />
          </div>
        </figure>

        <div id="article-body" className={`mx-auto grid max-w-6xl gap-12 py-16 md:py-20 ${showToc ? 'lg:grid-cols-[1fr_240px] lg:gap-20' : ''}`}>
          <div className={`min-w-0 ${showToc ? '' : 'mx-auto w-full max-w-prose'}`}>
            {showToc && (
              <div className="mb-10 lg:hidden">
                <TableOfContents headings={headings} variant="inline" />
              </div>
            )}

            {article.migrationStatus === 'summary' && (
              <aside data-anim="fade-up" className="mb-12 border-l-2 border-gold bg-charcoal px-6 py-5 text-sm leading-7 text-ivory/80">
                <p className="label mb-2">Migration note</p>
                This is a summary of the article originally published on the previous website on the date shown above. The full
                original text is being migrated.
              </aside>
            )}

            <div data-anim="children" className="prose prose-legal max-w-prose" dangerouslySetInnerHTML={{ __html: html }} />

            {article.tags.length > 0 && (
              <ul data-anim="stagger" className="mt-14 flex max-w-prose flex-wrap gap-2" aria-label="Tags">
                {article.tags.map((t) => (
                  <li key={t} className="border border-line px-3 py-1 text-xs text-muted">
                    {t}
                  </li>
                ))}
              </ul>
            )}

            <div data-anim="fade-up" className="mt-12 max-w-prose border-y border-line py-8">
              <ShareButtons url={absoluteUrl(`/blog/${article.slug}`)} title={article.title} />
            </div>

            <p className="mt-8 max-w-prose text-xs leading-6 text-muted/80">
              This article is for general information only and is not legal advice. It does not create an advocate–client relationship.
              Please seek advice specific to your circumstances.
            </p>
          </div>

          {showToc && (
            <aside className="hidden lg:block">
              <div className="sticky top-28">
                <TableOfContents headings={headings} variant="sidebar" />
              </div>
            </aside>
          )}
        </div>

        {(previous || next) && (
          <nav aria-label="More articles" data-anim="stagger" className="mx-auto grid max-w-6xl border-t border-line sm:grid-cols-2">
            <div className="border-line py-10 sm:border-r sm:pr-10">
              {previous && (
                <Link href={`/blog/${previous.slug}`} className="group block">
                  <span className="label text-muted">← Previous article</span>
                  <span className="mt-3 block font-serif text-2xl leading-snug transition-colors group-hover:text-gold-light">
                    {previous.title}
                  </span>
                </Link>
              )}
            </div>
            <div className="border-t border-line py-10 text-right sm:border-t-0 sm:pl-10">
              {next && (
                <Link href={`/blog/${next.slug}`} className="group block">
                  <span className="label text-muted">Next article →</span>
                  <span className="mt-3 block font-serif text-2xl leading-snug transition-colors group-hover:text-gold-light">
                    {next.title}
                  </span>
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="border-t border-line bg-charcoal/40 py-20 md:py-28">
          <div className="container">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h2 id="related-heading" data-anim="heading" className="display text-4xl">
                Related insights
              </h2>
              <Link href="/blog" className="link-gold">
                <span className="arrow" aria-hidden>
                  ←
                </span>{' '}
                Back to Insights
              </Link>
            </div>
            <ul data-anim="stagger" className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd data={[articleJsonLd(article), breadcrumbJsonLd(crumbs)]} />
    </article>
  );
}
