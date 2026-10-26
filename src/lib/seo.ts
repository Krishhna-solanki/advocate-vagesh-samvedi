import type { Metadata } from 'next';
import { absoluteUrl, site } from './site';
import { practiceAreas } from './practice-areas';
import type { ArticleMeta } from './insights';

export function pageMetadata({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image?: string;
}): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      ...(image ? { images: [{ url: image }] } : {}),
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

// Structured data is limited to verifiable facts — no ratings, reviews or case counts.
export const personJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.name,
  jobTitle: 'Advocate',
  url: site.url,
  image: absoluteUrl(site.portrait),
  email: `mailto:${site.email}`,
  ...(site.phone ? { telephone: site.phone.href.replace('tel:', '') } : {}),
  address: {
    '@type': 'PostalAddress',
    addressLocality: site.location.city,
    addressRegion: site.location.region,
    addressCountry: 'IN',
  },
  worksFor: { '@type': 'Organization', name: site.firm.name, address: { '@type': 'PostalAddress', addressLocality: site.firm.city, addressCountry: 'IN' } },
  alumniOf: { '@type': 'CollegeOrUniversity', name: site.education.institution },
  knowsAbout: practiceAreas.map((p) => p.title),
  sameAs: site.profiles.map((p) => p.href),
});

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.shortName,
  publisher: { '@id': `${site.url}/#person` },
});

export const articleJsonLd = (a: ArticleMeta) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.seoDescription ?? a.excerpt,
  datePublished: a.date,
  dateModified: a.updated ?? a.date,
  mainEntityOfPage: absoluteUrl(`/insights/${a.slug}`),
  ...(a.cover ? { image: absoluteUrl(a.cover) } : {}),
  ...(a.author ? { author: { '@type': 'Person', name: a.author, url: absoluteUrl('/about') } } : {}),
  publisher: { '@id': `${site.url}/#person` },
  articleSection: a.categoryName,
  keywords: a.tags.join(', '),
});

export const breadcrumbJsonLd = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((it, i) => ({ '@type': 'ListItem', position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
});
