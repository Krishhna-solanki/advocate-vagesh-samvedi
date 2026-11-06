import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Breadcrumbs from '@/components/Breadcrumbs';
import ShareButtons from '@/components/ShareButtons';
import JsonLd from '@/components/JsonLd';
import { NewsRow } from '@/components/NewsItems';
import NewsGallery from '@/components/NewsGallery';
import { getAllNews, getNewsItem, getNewsMetas } from '@/lib/news';
import { renderMarkdown } from '@/lib/insights';
import { formatDate } from '@/lib/format';
import { breadcrumbJsonLd, newsJsonLd } from '@/lib/seo';
import { absoluteUrl } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllNews().map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const n = getNewsItem((await params).slug);
  if (!n) return {};
  return {
    title: n.title,
    description: n.excerpt,
    alternates: { canonical: `/news/${n.slug}` },
    robots: n.draft ? { index: false, follow: false } : undefined,
    openGraph: {
      type: 'article',
      title: n.title,
      description: n.excerpt,
      url: `/news/${n.slug}`,
      publishedTime: n.date,
      section: n.type,
      ...(n.cover ? { images: [{ url: n.cover, alt: n.coverAlt }] } : {}),
    },
  };
}

export default async function NewsItemPage({ params }: Params) {
  const item = getNewsItem((await params).slug);
  if (!item) notFound();
  const { html } = await renderMarkdown(item.body);
  const more = getNewsMetas()
    .filter((n) => n.slug !== item.slug)
    .slice(0, 3);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
    { name: item.title, path: `/news/${item.slug}` },
  ];

  return (
    <article>
      <header className="texture-columns border-b border-line pb-14 pt-36 md:pt-44">
        <div className="container">
          <div data-anim="fade-up">
            <Breadcrumbs items={crumbs} />
          </div>
          <div className="mt-12 max-w-4xl">
            {item.draft && <p className="mb-4 inline-block border border-gold px-3 py-1 text-xs uppercase tracking-widest text-gold">Draft preview</p>}
            <p data-anim="fade-up" data-delay="100" className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em]">
              <span className="font-semibold text-gold">{item.type}</span>
              <span aria-hidden className="h-px w-4 bg-gold/50" />
              {item.date ? (
                <time dateTime={item.date} className="text-muted">
                  {formatDate(item.date)}
                </time>
              ) : (
                <span className="text-muted">Date not stated in the source</span>
              )}
              {item.location && (
                <>
                  <span aria-hidden className="h-px w-4 bg-gold/50" />
                  <span className="text-muted">{item.location}</span>
                </>
              )}
              {item.publication && (
                <>
                  <span aria-hidden className="h-px w-4 bg-gold/50" />
                  <span className="text-gold-light/80">{item.publication}</span>
                </>
              )}
            </p>
            <h1 data-anim="heading" data-delay="150" className="display mt-6 text-4xl leading-[1.08] sm:text-5xl lg:text-[3.6rem]">
              {item.title}
            </h1>
            {item.excerpt && (
              <p data-anim="fade-up" data-delay="450" className="mt-8 max-w-3xl font-serif text-xl italic leading-relaxed text-ivory/75 md:text-2xl">
                {item.excerpt}
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="container">
        {item.cover && item.coverStyle === 'clipping' && (
          // Newspaper clipping: shown whole at its own proportions, untouched, with a link to the original file
          <figure className="mx-auto max-w-md pt-12" data-anim="image" data-delay="300">
            <div className="relative border border-gold/30 bg-ink p-2 shadow-[0_40px_80px_-40px_rgba(0,0,0,0.95),0_0_0_1px_rgba(0,0,0,0.6)]">
              <Image
                src={item.cover}
                alt={item.coverAlt}
                width={item.coverSize?.width ?? 0}
                height={item.coverSize?.height ?? 0}
                priority
                sizes="(min-width: 640px) 432px, 92vw"
                className="h-auto w-full"
              />
            </div>
            <figcaption className="mt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-muted">
              <span>
                {[item.publication ?? 'Newspaper clipping', item.date && formatDate(item.date)].filter(Boolean).join(', ')}
              </span>
              <a href={item.cover} target="_blank" rel="noopener" className="link-gold">
                View full size <span className="arrow" aria-hidden>↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </figcaption>
          </figure>
        )}
        {item.cover && item.coverStyle !== 'clipping' && (
          // Photograph: whole, at its own proportions, never wider than its own pixels
          <figure
            className="mx-auto max-w-5xl pt-12"
            // At most 1024px wide or about 720px tall, and never wider than the photo's own pixels
            style={
              item.coverSize
                ? { maxWidth: Math.min(item.coverSize.width, 1024, Math.round((720 * item.coverSize.width) / item.coverSize.height)) }
                : undefined
            }
            data-anim="image"
            data-delay="300"
          >
            <Image
              src={item.cover}
              alt={item.coverAlt}
              width={item.coverSize?.width ?? 0}
              height={item.coverSize?.height ?? 0}
              priority
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="h-auto w-full border border-gold/25"
            />
          </figure>
        )}
        {item.gallery.length > 0 && (
          <NewsGallery images={item.gallery} label={item.galleryTitle ?? (item.coverStyle === 'clipping' ? 'Also in the press' : 'Photo gallery')} />
        )}
        <div className="mx-auto max-w-prose py-16 md:py-20">
          <div data-anim="children" className="prose prose-legal" dangerouslySetInnerHTML={{ __html: html }} />
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="btn-outline mt-10" data-anim="fade-up">
              {item.linkLabel ?? 'View source'} <span aria-hidden>↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          )}
          <div data-anim="fade-up" className="mt-12 border-y border-line py-8">
            <ShareButtons url={absoluteUrl(`/news/${item.slug}`)} title={item.title} />
          </div>
          <Link href="/news" className="link-gold mt-8">
            <span className="arrow" aria-hidden>
              ←
            </span>{' '}
            Back to News
          </Link>
        </div>
      </div>

      {more.length > 0 && (
        <section aria-labelledby="more-news" className="border-t border-line bg-charcoal/40 py-20 md:py-24">
          <div className="container">
            <h2 id="more-news" data-anim="heading" className="display text-4xl">
              More news
            </h2>
            <ul data-anim="stagger" className="mt-10 border-t border-line">
              {more.map((n) => (
                <li key={n.slug}>
                  <NewsRow item={n} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <JsonLd data={[newsJsonLd(item), breadcrumbJsonLd(crumbs)]} />
    </article>
  );
}
