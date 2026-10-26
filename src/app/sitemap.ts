import type { MetadataRoute } from 'next';
import { getArticleMetas } from '@/lib/insights';
import { practiceAreas } from '@/lib/practice-areas';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticleMetas().filter((a) => !a.draft);
  const latest = articles[0]?.date;
  const pages = ['/', '/about', '/practice-areas', '/insights', '/publications', '/contact', '/disclaimer', '/privacy-policy'];

  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p),
      changeFrequency: p === '/insights' ? ('weekly' as const) : ('monthly' as const),
      priority: p === '/' ? 1 : p === '/insights' ? 0.9 : 0.6,
      ...(p === '/insights' && latest ? { lastModified: latest } : {}),
    })),
    ...practiceAreas.map((p) => ({ url: absoluteUrl(`/practice-areas/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/insights/${a.slug}`),
      lastModified: a.updated ?? a.date,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
  ];
}
