import { Suspense } from 'react';
import PageHeader from '@/components/PageHeader';
import InsightsExplorer from '@/components/InsightsExplorer';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleCard from '@/components/ArticleCard';
import JsonLd from '@/components/JsonLd';
import { getArticleMetas, getFeatured } from '@/lib/insights';
import { categories } from '@/lib/categories';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Insights & News',
  description:
    'Legal insights and developments from Advocate Vagesh Samvedi — perspectives on legislation, judgments, arbitration, business law, intellectual property and technology law.',
  path: '/insights',
});

export default function InsightsPage() {
  const articles = getArticleMetas();
  const featured = getFeatured();
  const counts = categories
    .map((c) => ({ slug: c.slug, name: c.name, count: articles.filter((a) => a.category === c.slug).length }))
    .filter((c) => c.count > 0);

  // Rendered without filters for crawlers and before hydration
  const fallback = (
    <div>
      {featured && <FeaturedArticle article={featured} headingLevel="h2" />}
      <ul className="mt-16 grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {articles
          .filter((a) => a.slug !== featured?.slug)
          .map((a) => (
            <li key={a.slug}>
              <ArticleCard article={a} />
            </li>
          ))}
      </ul>
    </div>
  );

  return (
    <>
      <PageHeader
        label="Insights & News"
        title={
          <>
            Legal Insights <span className="italic text-gold-light">&amp;</span> Developments
          </>
        }
        intro="Perspectives on legal developments, legislation, landmark judgments and emerging legal questions — written to inform, not to advise on any particular matter."
        crumbs={[
          { name: 'Home', path: '/' },
          { name: 'Insights & News', path: '/insights' },
        ]}
      />
      <section className="container py-16 md:py-20">
        <Suspense fallback={fallback}>
          <InsightsExplorer articles={articles} featuredSlug={featured?.slug} categories={counts} />
        </Suspense>
      </section>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: 'Home', path: '/' },
          { name: 'Insights & News', path: '/insights' },
        ])}
      />
    </>
  );
}
