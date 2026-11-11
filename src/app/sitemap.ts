import type { MetadataRoute } from 'next';
import { getArticleMetas } from '@/lib/insights';
import { getNewsMetas } from '@/lib/news';
import { practiceAreas } from '@/lib/practice-areas';
import { absoluteUrl, site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const articles = getArticleMetas().filter((a) => !a.draft);
  const news = getNewsMetas().filter((n) => !n.draft);
  const latestArticle = articles[0]?.date;
  const latestNews = news.find((n) => n.date)?.date;

  // Higher priority for the pages that matter most to someone looking for a lawyer
  const pages: { path: string; priority: number; freq: 'weekly' | 'monthly' | 'yearly'; lastModified?: string; images?: string[] }[] = [
    { path: '/', priority: 1, freq: 'weekly', lastModified: latestNews, images: [absoluteUrl(site.portrait)] },
    { path: '/about', priority: 0.9, freq: 'monthly', images: [absoluteUrl(site.portrait)] },
    { path: '/practice-areas', priority: 0.9, freq: 'monthly' },
    { path: '/contact', priority: 0.9, freq: 'monthly' },
    { path: '/blog', priority: 0.8, freq: 'weekly', lastModified: latestArticle },
    { path: '/news', priority: 0.8, freq: 'weekly', lastModified: latestNews },
    { path: '/social', priority: 0.6, freq: 'monthly' },
    { path: '/publications', priority: 0.6, freq: 'monthly' },
    { path: '/disclaimer', priority: 0.2, freq: 'yearly' },
    { path: '/privacy-policy', priority: 0.2, freq: 'yearly' },
  ];

  return [
    ...pages.map((p) => ({
      url: absoluteUrl(p.path),
      changeFrequency: p.freq,
      priority: p.priority,
      ...(p.lastModified ? { lastModified: p.lastModified } : {}),
      ...(p.images ? { images: p.images } : {}),
    })),
    ...practiceAreas.map((p) => ({ url: absoluteUrl(`/practice-areas/${p.slug}`), changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...articles.map((a) => ({
      url: absoluteUrl(`/blog/${a.slug}`),
      lastModified: a.updated ?? a.date,
      changeFrequency: 'yearly' as const,
      priority: 0.7,
      ...(a.cover ? { images: [absoluteUrl(a.cover)] } : {}),
    })),
    ...news.map((n) => {
      const imgs = [n.cover, ...n.gallery.map((g) => g.image)].filter(Boolean).map((src) => absoluteUrl(src!));
      return {
        url: absoluteUrl(`/news/${n.slug}`),
        ...(n.date ? { lastModified: n.date } : {}),
        changeFrequency: 'yearly' as const,
        priority: 0.6,
        ...(imgs.length ? { images: imgs } : {}),
      };
    }),
  ];
}
