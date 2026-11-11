import type { Metadata } from 'next';
import { absoluteUrl, site } from './site';
import { practiceAreas } from './practice-areas';
import type { ArticleMeta } from './insights';
import type { NewsMeta } from './news';
import officesData from '../../content/offices.json';

/** The site-wide share card (src/app/opengraph-image.tsx), used when a page has no image of its own. */
export const defaultShareImage = { url: '/opengraph-image', width: 1200, height: 630, alt: `${site.fullName} — ${site.role}` };

const SUFFIX = ` | ${site.fullName}`;
/** Adds the name suffix only while the whole title stays short enough not to be cut off in search results (~65 chars). */
export const searchTitle = (title: string) => (title.includes(site.fullName) || title.length + SUFFIX.length > 65 ? title : title + SUFFIX);

/**  is used exactly as given (titles in the content document already include the name). */
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
    title: { absolute: title },
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: 'website',
      siteName: site.shortName,
      locale: 'en_IN',
      images: [image ? { url: image } : defaultShareImage],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image ?? defaultShareImage.url] },
  };
}

// Structured data is limited to verifiable facts — no ratings, reviews or case counts.
export const personJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'Person',
  '@id': `${site.url}/#person`,
  name: site.fullName,
  alternateName: site.name,
  jobTitle: site.role,
  description: site.description,
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
  alumniOf: site.education.slice(0, 2).map((e) => ({ '@type': 'CollegeOrUniversity', name: e.institution })),
  memberOf: { '@type': 'Organization', name: site.barCouncil },
  worksFor: { '@id': `${site.url}/#legalservice` },
  workLocation: offices.map((o) => ({ '@type': 'Place', name: o.name, address: postalAddress(o) })),
  knowsAbout: practiceAreas.map((p) => p.title),
  sameAs: site.profiles.map((p) => p.href),
});

type Office = { title: string; name: string; address: string; lat?: number; lng?: number; mapUrl?: string; placeholder?: boolean };
const offices = (officesData.offices as Office[]).filter((o) => !o.placeholder);

/** Splits "…, Petlawad, Madhya Pradesh – 457773, India" into schema.org address parts. */
function postalAddress(o: Office) {
  const parts = o.address.split(',').map((p) => p.trim());
  const regionPart = parts.find((p) => /Madhya Pradesh|Gujarat/.test(p)) ?? '';
  const pin = regionPart.match(/\d{6}/)?.[0];
  const regionIdx = parts.indexOf(regionPart);
  return {
    '@type': 'PostalAddress',
    streetAddress: parts.slice(0, Math.max(regionIdx - 1, 1)).join(', '),
    addressLocality: parts[regionIdx - 1] ?? o.name,
    addressRegion: regionPart.replace(/\s*[–-]?\s*\d{6}/, '').trim(),
    ...(pin ? { postalCode: pin } : {}),
    addressCountry: 'IN',
  };
}

// The practice as a local legal service: real office addresses only, no ratings, hours or prices.
export const legalServiceJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  '@id': `${site.url}/#legalservice`,
  name: site.fullName,
  description: site.description,
  url: site.url,
  image: absoluteUrl(site.portrait),
  email: site.email,
  ...(site.phone ? { telephone: site.phone.href.replace('tel:', '') } : {}),
  founder: { '@id': `${site.url}/#person` },
  employee: { '@id': `${site.url}/#person` },
  ...(offices[0] ? { address: postalAddress(offices[0]) } : {}),
  ...(offices[0]?.lat ? { geo: { '@type': 'GeoCoordinates', latitude: offices[0].lat, longitude: offices[0].lng } } : {}),
  ...(offices[0]?.mapUrl ? { hasMap: offices[0].mapUrl } : {}),
  location: offices.map((o) => ({
    '@type': 'Place',
    name: `${site.fullName} — ${o.name}`,
    address: postalAddress(o),
    ...(o.lat ? { geo: { '@type': 'GeoCoordinates', latitude: o.lat, longitude: o.lng } } : {}),
  })),
  areaServed: [
    { '@type': 'State', name: 'Madhya Pradesh' },
    { '@type': 'State', name: 'Gujarat' },
  ],
  knowsAbout: practiceAreas.map((p) => p.title),
  sameAs: site.profiles.map((p) => p.href),
});

export const serviceJsonLd = (p: { title: string; slug: string; seoDescription: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: p.title,
  serviceType: p.title,
  description: p.seoDescription,
  url: absoluteUrl(`/practice-areas/${p.slug}`),
  provider: { '@id': `${site.url}/#legalservice` },
  areaServed: [
    { '@type': 'State', name: 'Madhya Pradesh' },
    { '@type': 'State', name: 'Gujarat' },
  ],
});

export const websiteJsonLd = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${site.url}/#website`,
  url: site.url,
  name: site.fullName,
  alternateName: [site.shortName, site.name],
  inLanguage: 'en-IN',
  publisher: { '@id': `${site.url}/#person` },
});

export const articleJsonLd = (a: ArticleMeta) => ({
  '@context': 'https://schema.org',
  '@type': 'BlogPosting',
  headline: a.title,
  description: a.seoDescription ?? a.excerpt,
  datePublished: a.date,
  dateModified: a.updated ?? a.date,
  mainEntityOfPage: absoluteUrl(`/blog/${a.slug}`),
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

export const newsJsonLd = (n: NewsMeta) => ({
  '@context': 'https://schema.org',
  '@type': 'NewsArticle',
  headline: n.title,
  description: n.excerpt,
  ...(n.date ? { datePublished: n.date } : {}),
  mainEntityOfPage: absoluteUrl(`/news/${n.slug}`),
  ...(n.cover || n.gallery.length ? { image: [n.cover, ...n.gallery.map((g) => g.image)].filter(Boolean).map((src) => absoluteUrl(src!)) } : {}),
  author: { '@id': `${site.url}/#person` },
  publisher: { '@id': `${site.url}/#person` },
  articleSection: n.type,
});

/** Trims long text to a search-result-sized description (~160 characters) at a word boundary. */
export function metaDescription(text: string, max = 160) {
  const t = text.replace(/\s+/g, ' ').trim();
  if (t.length <= max) return t;
  return t.slice(0, t.lastIndexOf(' ', max - 1)).replace(/[\s,;:—–-]+$/, '') + '…';
}
