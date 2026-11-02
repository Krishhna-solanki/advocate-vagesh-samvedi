import PageHeader from '@/components/PageHeader';
import NewsTimeline from '@/components/NewsTimeline';
import EmptyState from '@/components/EmptyState';
import JsonLd from '@/components/JsonLd';
import { getNewsMetas, NEWS_TYPES } from '@/lib/news';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'News',
  description: 'News from the practice of Advocate Vagesh Samvedi — professional activities, events, achievements and legal updates.',
  path: '/news',
});

export default function NewsPage() {
  const items = getNewsMetas();
  // Only offer filters for types that have entries, in the CMS's order
  const types = NEWS_TYPES.filter((t) => items.some((n) => n.type === t)) as string[];
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'News', path: '/news' },
  ];

  return (
    <>
      <PageHeader
        label="News"
        title={
          <>
            News <span className="italic text-gold-light">&amp;</span> Professional Updates
          </>
        }
        intro="Professional activities, events, achievements and updates from the practice."
        crumbs={crumbs}
      />
      <section className="container py-16 md:py-24">
        {items.length > 0 ? (
          <NewsTimeline items={items} types={types} />
        ) : (
          <EmptyState title="News coming soon" text="Updates on professional activities, events and achievements will be shared here." />
        )}
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
