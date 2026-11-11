import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import SectionHeading from '@/components/SectionHeading';
import { getArticleMetas } from '@/lib/insights';
import { publications } from '@/lib/publications';
import { formatDate } from '@/lib/format';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Legal Research & Insights | Advocate Vagesh Samvedi',
  description: 'Explore legal discussions concerning intellectual property, artificial intelligence, cybersecurity and contemporary Indian law.',
  path: '/publications',
});

// Academic and intellectual interests (content document, Page 5). Interests, not specialist practice credentials.
const interests = [
  { title: 'Intellectual Property Rights', text: 'Trademark protection, copyright, infringement and the evolving protection of intellectual property.' },
  { title: 'Artificial Intelligence & Law', text: 'Legal responsibility, digital content, intellectual property and emerging questions involving artificial intelligence.' },
  { title: 'Cybersecurity & Digital Regulation', text: 'Cyber offences, electronic evidence, digital transactions and legal accountability.' },
  { title: 'Technology & Legal Development', text: 'The relationship between technological advancement and established legal principles.' },
  { title: 'Constitutional Law & Human Rights', text: 'Individual rights, equality, procedural fairness and access to justice.' },
  { title: 'Alternative Dispute Resolution', text: 'Mediation, negotiation and alternative approaches to dispute resolution.' },
];

type Entry = { title: string; description: string; date: string; author?: string; href: string; external: boolean; venue: string };

export default function ResearchPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Research & Publications', path: '/publications' },
  ];

  const writing: Entry[] = getArticleMetas().map((a) => ({
    title: a.title,
    description: a.excerpt,
    date: a.date,
    author: a.author,
    href: `/blog/${a.slug}`,
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
        label="Research & Publications"
        title={
          <>
            Legal Research <span className="italic text-gold-light">&amp;</span> Contemporary Developments
          </>
        }
        intro="The development of law is closely connected with changes in society, technology, commerce and individual rights."
        crumbs={crumbs}
      />

      <section className="container py-16 md:py-24">
        <Reveal variant="stagger" className="mx-auto max-w-3xl space-y-6 text-lg leading-9 text-ivory/80">
          <p>
            Advocate Vagesh Samvedi maintains an academic interest in contemporary legal questions, particularly those concerning
            Intellectual Property Rights, cybersecurity, artificial intelligence and the evolving legal implications of digital technologies.
          </p>
          <p>
            His academic background in Intellectual Property Rights provides a foundation for examining questions concerning ownership,
            protection, infringement and legal accountability in an increasingly technology-driven environment.
          </p>
          <p>This section presents legal discussions and informational content concerning established legal principles and emerging areas of legal development.</p>
        </Reveal>
      </section>

      <section aria-labelledby="interests-heading" className="border-t border-line bg-charcoal/40 py-20 md:py-28">
        <div className="container">
          <SectionHeading id="interests-heading" label="Research Interests" title="Areas of Academic & Intellectual Interest" />
          <Reveal as="ul" variant="stagger" className="mt-14 grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {interests.map((it, i) => (
              <li key={it.title} className="border-b border-r border-line bg-charcoal p-8 md:p-10">
                <span className="font-serif text-sm italic text-muted">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-6 font-serif text-[1.55rem] leading-tight">{it.title}</h3>
                <p className="mt-4 text-sm leading-7 text-muted">{it.text}</p>
              </li>
            ))}
          </Reveal>
        </div>
      </section>

      {external.length > 0 && <EntryList id="external" heading="Publications" entries={external} />}
      {writing.length > 0 && <EntryList id="writing" heading="Legal discussions" entries={writing} />}
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
