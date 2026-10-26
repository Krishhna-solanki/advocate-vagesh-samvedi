import PageHeader from '@/components/PageHeader';
import ContactForm from '@/components/ContactForm';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact',
  description: `Professional contact details for Advocate Vagesh Samvedi, ${site.location.city}, ${site.location.region}.`,
  path: '/contact',
});

export default function ContactPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Contact', path: '/contact' },
  ];
  return (
    <>
      <PageHeader
        label="Contact"
        title="Professional Enquiries"
        intro="For professional enquiries, please write using the form below or by email. Contacting the advocate through this website does not by itself create an advocate–client relationship."
        crumbs={crumbs}
      />
      <section className="container grid gap-16 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <dl data-anim="stagger" data-delay="300" className="space-y-10">
            <div>
              <dt className="label">Email</dt>
              <dd className="mt-3 font-serif text-2xl">
                <a href={`mailto:${site.email}`} className="break-all hover:text-gold-light">
                  {site.email}
                </a>
              </dd>
            </div>
            {site.phone && (
              <div>
                <dt className="label">Phone</dt>
                <dd className="mt-3 font-serif text-2xl">
                  <a href={site.phone.href} className="hover:text-gold-light">
                    {site.phone.display}
                  </a>
                </dd>
              </div>
            )}
            <div>
              <dt className="label">Location</dt>
              <dd className="mt-3 font-serif text-2xl">
                {site.location.city}, {site.location.region}
              </dd>
              <dd className="mt-1 text-sm text-muted">{site.firm.name}</dd>
            </div>
            <div>
              <dt className="label">Profiles</dt>
              <dd className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {site.profiles.map((p) => (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className="text-gold hover:text-gold-light">
                    {p.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                ))}
              </dd>
            </div>
          </dl>
        </div>
        <div className="border-t border-line pt-12 lg:col-span-7 lg:col-start-6 lg:border-l lg:border-t-0 lg:pl-16 lg:pt-0" data-anim="fade-up" data-delay="450">
          <h2 className="font-serif text-3xl">Send a message</h2>
          <p className="mb-10 mt-3 text-sm text-muted">All fields are required.</p>
          <ContactForm />
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
