import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

// Placeholder until the e-books are published. No purchasing or payment yet.
export const metadata = {
  ...pageMetadata({
    title: 'E-Books — Coming Soon | Advocate Vagesh Samvedi',
    description: 'Legal e-books by Advocate Vagesh Samvedi are in preparation and will be published on this website.',
    path: '/e-books',
  }),
  // Kept out of search results until the e-books are available
  robots: { index: false, follow: true },
};

export default function EBooksPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'E-Books', path: '/e-books' },
  ];
  return (
    <>
      <PageHeader
        label="E-Books"
        title={
          <>
            E-Books <span className="italic text-gold-light">Coming Soon</span>
          </>
        }
        intro="A collection of legal e-books by Advocate Vagesh Samvedi is in preparation and will be published here."
        crumbs={crumbs}
      />

      <section className="py-20 md:py-28">
        <div className="container">
          <Reveal className="contact-card relative mx-auto max-w-3xl flex-col !items-center !gap-0 overflow-hidden !p-10 text-center md:!p-14">
            <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
            <span className="contact-card__icon !h-14 !w-14">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6" aria-hidden>
                <path d="M12 6.5C10 5 7 4.5 3.5 5v13c3.5-.5 6.5 0 8.5 1.5M12 6.5c2-1.5 5-2 8.5-1.5v13c-3.5-.5-6.5 0-8.5 1.5M12 6.5v13" />
              </svg>
            </span>
            <p className="label mt-8">In preparation</p>
            <h2 className="display mt-4 text-3xl md:text-4xl">The first titles are on their way</h2>
            <p className="mt-6 max-w-xl leading-8 text-ivory/75">
              Details of the e-books, including their subjects and availability, will be announced on this page. In the meantime, you can
              read legal insights and articles on the website.
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/blog" className="btn-gold">
                Read Legal Insights
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
