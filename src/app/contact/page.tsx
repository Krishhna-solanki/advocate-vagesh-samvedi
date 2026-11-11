import PageHeader from '@/components/PageHeader';
import ContactSection from '@/components/ContactSection';
import OfficeLocations from '@/components/OfficeLocations';
import GeographicReach from '@/components/GeographicReach';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Contact Advocate Vagesh Samvedi | Legal Enquiries',
  description:
    'Contact Advocate Vagesh Samvedi in Petlawad (District Jhabua) or Indore, Madhya Pradesh, for legal representation, litigation and advisory enquiries.',
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
        title={
          <>
            Contact Advocate <span className="italic text-gold-light">Vagesh Samvedi</span>
          </>
        }
        intro={
          <>
            For enquiries concerning legal representation, litigation or advisory assistance, you may connect through the contact details
            and enquiry facilities provided below.
            <span className="mt-4 block">
              All enquiries are considered according to the nature of the matter, relevant facts and applicable legal jurisdiction.
            </span>
          </>
        }
        crumbs={crumbs}
      />
      <ContactSection variant="page" />
      <OfficeLocations />
      <GeographicReach />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
