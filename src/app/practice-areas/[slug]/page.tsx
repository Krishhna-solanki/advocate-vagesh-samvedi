import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import PageHeader from '@/components/PageHeader';
import PracticeIcon from '@/components/PracticeIcon';
import ArticleCard from '@/components/ArticleCard';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { getPracticeArea, practiceAreas } from '@/lib/practice-areas';
import { getArticleMetas } from '@/lib/insights';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

type Params = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return practiceAreas.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const p = getPracticeArea((await params).slug);
  if (!p) return {};
  return pageMetadata({ title: p.title, description: p.summary, path: `/practice-areas/${p.slug}` });
}

export default async function PracticeAreaPage({ params }: Params) {
  const area = getPracticeArea((await params).slug);
  if (!area) notFound();

  const insights = getArticleMetas()
    .filter((a) => a.category === area.insightCategory)
    .slice(0, 3);
  const others = practiceAreas.filter((p) => p.slug !== area.slug);
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Practice Areas', path: '/practice-areas' },
    { name: area.title, path: `/practice-areas/${area.slug}` },
  ];

  return (
    <>
      <PageHeader label="Practice Area" title={area.title} intro={area.summary} crumbs={crumbs} />

      <section className="py-20 md:py-28">
        <div className="container grid gap-16 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <PracticeIcon name={area.icon} className="h-14 w-14 text-gold" />
            <p className="mt-10 font-serif text-2xl leading-relaxed text-ivory/90 md:text-[1.75rem]">{area.intro}</p>
            <p className="mt-10 text-sm leading-7 text-muted">
              Every matter turns on its own facts. Nothing on this page is legal advice or a representation about the outcome of any
              matter.
            </p>
          </Reveal>
          <Reveal delay={120} className="lg:col-span-4 lg:col-start-9">
            <h2 className="label">Matters may include</h2>
            <ul data-anim="stagger" data-delay="200" className="mt-6 border-t border-line">
              {area.matters.map((m) => (
                <li key={m} className="flex gap-4 border-b border-line py-4 text-ivory/85">
                  <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-gold" />
                  {m}
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn-outline mt-10">
              Contact
            </Link>
          </Reveal>
        </div>
      </section>

      {insights.length > 0 && (
        <section aria-labelledby="pa-insights" className="border-t border-line py-20 md:py-28">
          <div className="container">
            <h2 id="pa-insights" data-anim="heading" className="display text-4xl">
              Related insights
            </h2>
            <ul data-anim="stagger" className="mt-12 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {insights.map((a) => (
                <li key={a.slug}>
                  <ArticleCard article={a} />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="pa-others" className="border-t border-line bg-charcoal/40 py-20">
        <div className="container">
          <h2 id="pa-others" className="label">
            Other practice areas
          </h2>
          <ul data-anim="stagger" className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <li key={p.slug} className="border-b border-line">
                <Link href={`/practice-areas/${p.slug}`} className="group flex items-center justify-between py-5">
                  <span className="font-serif text-xl transition-colors group-hover:text-gold-light">{p.title}</span>
                  <span aria-hidden className="text-gold transition-transform motion-safe:group-hover:translate-x-1">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
