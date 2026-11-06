import type { MetadataRoute } from 'next';
import { getArticleMetas } from '@/lib/insights';
import { getNewsMetas } from '@/lib/news';
import { practiceAreas } from '@/lib/practice-areas';
import { absoluteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticleMetas().filter((a) => !a.draft);
  const latest = articles[0]?.date;
  const news = getNewsMetas().filter((n) => !n.draft);
  const pages = ['/', '/about', '/practice-areas', '/news', '/blog', '/social', '/publications', '/contact', '/disclaimer', '/privacy-policy'];

  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p),
      changeFrequency: p === '/blog' ? ('weekly' as const) : ('monthly' as const),
      priority: p === '/' ? 1 : p === '/blog' ? 0.9 : 0.6,
      ...(p === '/blog' && latest ? { lastModified: latest } : {}),
    })),
    ...practiceAreas.map((p) => ({ url: absoluteUrl(`/practice-areas/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: a.updated ?? a.date,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...news.map((n) => ({ url: absoluteUrl(`/news/${n.slug}`), ...(n.date ? { lastModified: n.date } : {}), changeFrequency: 'yearly' as const, priority: 0.6 })),
  ];
}
