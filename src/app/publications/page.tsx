import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import { getArticleMetas } from '@/lib/insights';
import { publications } from '@/lib/publications';
import { formatDate } from '@/lib/format';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Publications & Featured Writing',
  description: 'Selected publications, articles and legal commentary by Advocate Vagesh Samvedi.',
  path: '/publications',
});

type Entry = { title: string; description: string; date: string; author?: string; href: string; external: boolean; venue: string };

export default function PublicationsPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Publications', path: '/publications' },
  ];

  const writing: Entry[] = getArticleMetas().map((a) => ({
    title: a.title,
    description: a.excerpt,
    date: a.date,
    author: a.author,
    href: `/insights/${a.slug}`,
    external: false,
    venue: a.categoryName,
  }));
  const external: Entry[] = publications.map((p) => ({
    title: p.title,
    description: p.description ?? '',
    date: p.date,
    author: p.author,
    href: p.url,
    external: true,
    venue: p.publisher ?? 'Publication',
  }));

  return (
    <>
      <PageHeader
        label="Publications"
        title={
          <>
            Publications <span className="italic text-gold-light">&amp;</span> Featured Writing
          </>
        }
        intro="Selected articles, research and professional commentary."
        crumbs={crumbs}
      />

      {external.length > 0 && <EntryList id="external" heading="Publications" entries={external} />}
      <EntryList id="writing" heading="Featured writing" entries={writing} />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}

function EntryList({ id, heading, entries }: { id: string; heading: string; entries: Entry[] }) {
  return (
    <section aria-labelledby={id} className="container py-20 md:py-24">
      <h2 id={id} className="label" data-anim="fade-up">
        {heading}
      </h2>
      <ol data-anim="children" className="mt-10 border-t border-line">
        {entries.map((e) => (
          <li key={e.href} className="group relative border-b border-line">
            <div className="grid gap-6 py-10 md:grid-cols-12 md:gap-10">
              <div className="md:col-span-3">
                <time dateTime={e.date} className="font-serif text-lg italic text-gold">
                  {formatDate(e.date)}
                </time>
                <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-muted">{e.venue}</p>
              </div>
              <div className="md:col-span-7">
                <h3 className="font-serif text-3xl leading-tight transition-colors group-hover:text-gold-light">
                  <Link
                    href={e.href}
                    className="after:absolute after:inset-0"
                    {...(e.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    {e.title}
                    {e.external && <span className="sr-only"> (opens in a new tab)</span>}
                  </Link>
                </h3>
                <p className="mt-4 leading-7 text-muted">{e.description}</p>
                {e.author && <p className="mt-4 text-sm text-ivory/60">By {e.author}</p>}
              </div>
              <div className="flex items-start md:col-span-2 md:justify-end">
                <span className="link-gold" aria-hidden>
                  Read more <span className="arrow">{e.external ? '↗' : '→'}</span>
                </span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
