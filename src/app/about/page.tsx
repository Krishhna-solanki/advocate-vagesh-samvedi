import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { practiceAreas } from '@/lib/practice-areas';
import { site } from '@/lib/site';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About',
  description:
    'About Advocate Vagesh Samvedi — an advocate and legal advisor in Indore, Madhya Pradesh, working in civil law, cyber law and intellectual property law.',
  path: '/about',
});

export default function AboutPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];
  return (
    <>
      <PageHeader
        label="About the Advocate"
        title={
          <>
            An Approach Grounded in Law, <span className="italic text-gold-light">Research</span> &amp; Perspective
          </>
        }
        crumbs={crumbs}
      />

      <section className="py-24 md:py-32">
        <div className="container grid gap-16 lg:grid-cols-12 lg:gap-24">
          <Reveal className="lg:col-span-5" delay={200}>
            <div className="relative lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] overflow-hidden" data-anim="image">
                <Image
                  src={site.portrait}
                  alt="Portrait of Advocate Vagesh Samvedi"
                  fill
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover object-[65%_30%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
              <div aria-hidden className="absolute -left-5 -top-5 hidden h-32 w-32 border-l border-t border-gold/50 md:block" />
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">
                Vagesh Samvedi · {site.location.city}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <Reveal variant="stagger" className="space-y-7 text-lg leading-9 text-ivory/85">
              <p className="font-serif text-3xl leading-snug text-ivory md:text-[2.1rem]">
                Vagesh Samvedi is an advocate and legal advisor based in {site.location.city}, {site.location.region}, whose practice centres on
                civil law, cyber law and intellectual property law.
              </p>
              <p>
                His mission is to simplify complex legal matters — work driven by a passion for both justice and creativity, and by the
                belief that people and businesses decide better when the law is explained clearly.
              </p>
              <p>
                He practises with <strong className="font-medium text-ivory">{site.firm.name}</strong>, an {site.firm.city}-based firm whose
                work includes arbitration and alternative dispute resolution, corporate law, intellectual property rights, regulatory
                compliance and legal advisory for startups, entrepreneurs, businesses and individuals.
              </p>
              <p>
                Alongside his practice, he writes on legal topics for businesses and individuals — from arbitration and business compliance to
                guidance for students considering a career in law.
              </p>
            </Reveal>

            <Reveal className="mt-16 border-y border-line py-12">
              <blockquote>
                <p className="font-serif text-3xl italic leading-snug text-gold-light md:text-4xl">“Strong businesses are built on smart decisions.”</p>
                <footer className="mt-5 text-sm uppercase tracking-[0.2em] text-muted">— Vagesh Samvedi</footer>
              </blockquote>
            </Reveal>

            <Reveal className="mt-16">
              <dl className="grid gap-x-12 gap-y-10 sm:grid-cols-2">
                <div>
                  <dt className="label">Legal Education</dt>
                  <dd className="mt-3 font-serif text-2xl">{site.education.institution}</dd>
                  <dd className="mt-1 text-sm text-muted">{site.education.city}, Madhya Pradesh</dd>
                </div>
                <div>
                  <dt className="label">Practice</dt>
                  <dd className="mt-3 font-serif text-2xl">{site.firm.name}</dd>
                  <dd className="mt-1 text-sm text-muted">
                    {site.firm.city}, {site.location.region}
                  </dd>
                </div>
                {site.enrolment && (
                  <div>
                    <dt className="label">Enrolment</dt>
                    <dd className="mt-3 font-serif text-2xl">{site.enrolment}</dd>
                  </div>
                )}
                <div className="sm:col-span-2">
                  <dt className="label">Areas of Focus</dt>
                  <dd className="mt-4">
                    <ul data-anim="stagger" className="grid gap-x-8 sm:grid-cols-2">
                      {practiceAreas.map((p) => (
                        <li key={p.slug} className="border-b border-line">
                          <Link href={`/practice-areas/${p.slug}`} className="flex items-center justify-between py-3.5 transition-colors hover:text-gold-light">
                            {p.title}
                            <span aria-hidden className="text-gold">→</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="label">Writing</dt>
                  <dd className="mt-3 leading-8 text-ivory/80">
                    Arbitration and alternative dispute resolution, legal support for businesses, and legal education and careers in India.
                  </dd>
                </div>
              </dl>
            </Reveal>

            <Reveal variant="stagger" className="mt-16 flex flex-col gap-4 sm:flex-row">
              <Link href="/insights" className="btn-gold">
                Read Legal Insights
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
