import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import NewsGallery from '@/components/NewsGallery';
import JsonLd from '@/components/JsonLd';
import { renderMarkdown } from '@/lib/insights';
import { getResponsibilities, getResponsibility, responsibilityPath } from '@/lib/responsibilities';
import { breadcrumbJsonLd, pageMetadata, searchTitle } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return getResponsibilities().map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const r = getResponsibility((await params).slug);
  if (!r) return {};
  return {
    ...pageMetadata({
      title: searchTitle(`${r.role}, ${r.organisation}`),
      description: r.summary,
      path: responsibilityPath(r.slug),
      image: r.cover,
    }),
    // Temporary content stays out of search results until the final text is published
    ...(r.placeholder ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function ResponsibilityPage({ params }: Params) {
  const r = getResponsibility((await params).slug);
  if (!r) notFound();
  const { html } = await renderMarkdown(r.body);
  const others = getResponsibilities().filter((o) => o.slug !== r.slug);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: r.organisation, path: responsibilityPath(r.slug) },
  ];

  return (
    <>
      <PageHeader label={`${r.role} · ${r.organisation}`} title={r.heading ?? r.organisation} intro={r.heading ? undefined : r.summary} crumbs={crumbs} />

      <section className="py-20 md:py-28">
        <div className="container">
          {r.placeholder && (
            <p
              role="note"
              className="mx-auto mb-12 flex max-w-3xl items-start gap-3 border border-gold/30 bg-gold/[0.04] px-5 py-4 text-sm leading-6 text-ivory/75"
              data-anim="fade-up"
            >
              <span aria-hidden className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
              Detailed information and photographs for this page are being prepared and will be published shortly.
            </p>
          )}

          {r.cover && (
            <figure className="mx-auto max-w-5xl">
              <Reveal variant="image" mobileFast className="relative aspect-[16/9] overflow-hidden border border-gold/25">
                <Image src={r.cover} alt={r.coverAlt} fill priority sizes="(min-width: 1024px) 1024px, 100vw" className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div aria-hidden className="pointer-events-none absolute inset-3 border border-gold/20" />
              </Reveal>
              {r.coverCredit && <figcaption className="mt-3 text-right text-xs text-muted">{r.coverCredit}</figcaption>}
            </figure>
          )}

          <div className="mx-auto max-w-prose pt-14 md:pt-20">
            <div data-anim="children" className="prose prose-legal" dangerouslySetInnerHTML={{ __html: html }} />
          </div>

          {r.themes.length > 0 && (
            <section aria-labelledby="focus-heading" className="mx-auto max-w-5xl pt-16 md:pt-24">
              <div className="flex items-center gap-4">
                <span aria-hidden className="h-px w-10 bg-gold" data-anim="line-x" />
                <h2 id="focus-heading" className="label" data-anim="fade-up">
                  Areas of Focus
                </h2>
              </div>
              <Reveal as="ul" variant="stagger" className="mt-8 grid gap-4 sm:grid-cols-2">
                {r.themes.map((t, i) => (
                  <li key={t.title} className="edu-card group h-full">
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="font-serif text-[1.45rem] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-light md:text-[1.6rem]">
                        {t.title}
                      </h3>
                      <span aria-hidden className="mt-1.5 font-serif text-sm italic text-gold/60">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <p className="mt-3 leading-7 text-ivory/70">{t.text}</p>
                    <span aria-hidden className="edu-card__rule" />
                  </li>
                ))}
              </Reveal>
            </section>
          )}

          {r.gallery.length > 0 && <NewsGallery images={r.gallery} label="Photographs" />}

          <div className="mx-auto max-w-prose pt-16">
            {others.length > 0 && (
              <Reveal variant="stagger" className="border-t border-line pt-10">
                <p className="label">Other responsibilities</p>
                <ul className="mt-5 space-y-3">
                  {others.map((o) => (
                    <li key={o.slug}>
                      <Link href={responsibilityPath(o.slug)} className="group flex items-baseline justify-between gap-6 border-b border-line pb-3">
                        <span className="font-serif text-2xl text-ivory transition-colors group-hover:text-gold-light">{o.organisation}</span>
                        <span className="shrink-0 text-xs uppercase tracking-[0.16em] text-muted">{o.role}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}
            <Link href="/#responsibilities" className="link-gold mt-10">
              <span className="arrow" aria-hidden>
                ←
              </span>{' '}
              Back to Home
            </Link>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
