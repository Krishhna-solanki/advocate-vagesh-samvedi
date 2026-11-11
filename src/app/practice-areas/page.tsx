import PageHeader from '@/components/PageHeader';
import PracticeGrid from '@/components/PracticeGrid';
import GeographicReach from '@/components/GeographicReach';
import JsonLd from '@/components/JsonLd';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Legal Practice Areas | Advocate Vagesh Samvedi',
  description:
    'Explore legal assistance relating to civil litigation, property, criminal law, family matters, cyber law, intellectual property and dispute resolution.',
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
        intro="Legal representation requires an understanding of the facts, applicable legislation, procedural requirements and remedies available under law. Advocate Vagesh Samvedi undertakes legal matters across multiple areas of practice, providing representation and legal assistance according to the nature and jurisdiction of each matter."
        crumbs={crumbs}
      />
      <section className="container py-20 md:py-28">
        <PracticeGrid headingLevel="h2" />
      </section>
      <GeographicReach />
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
