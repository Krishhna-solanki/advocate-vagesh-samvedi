import PageHeader from '@/components/PageHeader';
import NewsTimeline from '@/components/NewsTimeline';
import EmptyState from '@/components/EmptyState';
import JsonLd from '@/components/JsonLd';
import { getNewsMetas, NEWS_CATEGORIES } from '@/lib/news';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'News & Professional Updates | Advocate Vagesh Samvedi',
  description: 'Professional developments, documented legal matters, appointments and community initiatives.',
  path: '/news',
});

export default function NewsPage() {
  const items = getNewsMetas();
  // One filter per category that has articles: the standard categories in order, then any others once each
  const present = new Set(items.map((n) => n.type));
  const types = [...NEWS_CATEGORIES.filter((c) => present.has(c)), ...[...present].filter((t) => !(NEWS_CATEGORIES as readonly string[]).includes(t))];
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
