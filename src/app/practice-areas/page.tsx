import PageHeader from '@/components/PageHeader';
import PracticeGrid from '@/components/PracticeGrid';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Practice Areas',
  description:
    'Areas of practice of Advocate Vagesh Samvedi: civil law and dispute resolution, arbitration and ADR, business and corporate advisory, intellectual property, cyber law and startup consulting.',
  path: '/practice-areas',
});

export default function PracticeAreasPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Practice Areas', path: '/practice-areas' },
  ];
  return (
    <>
      <PageHeader
        label="Practice Areas"
        title="Areas of Legal Practice"
        intro="Advisory and dispute-resolution work across civil, commercial, intellectual property and technology law. The information below describes the nature of the work and is not an offer of services or a promise of any result."
        crumbs={crumbs}
      />
      <section className="container py-20 md:py-28">
        <PracticeGrid headingLevel="h2" />
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
