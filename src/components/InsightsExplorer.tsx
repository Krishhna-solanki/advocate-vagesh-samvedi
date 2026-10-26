'use client';

import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { ArticleMeta } from '@/lib/insights';
import ArticleCard from './ArticleCard';
import FeaturedArticle from './FeaturedArticle';
import { animateNew } from './ScrollAnimations';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';

const PAGE_SIZE = 6;

type Props = {
  articles: ArticleMeta[];
  featuredSlug?: string;
  categories: { slug: string; name: string; count: number }[];
};

const normalise = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '');

export default function InsightsExplorer({ articles, featuredSlug, categories }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const q = params.get('q') ?? '';
  const category = params.get('category') ?? '';
  const pageParam = Math.max(1, Number(params.get('page')) || 1);
  const [query, setQuery] = useState(q);

  const updateParams = (next: Record<string, string | null>) => {
    const sp = new URLSearchParams(params.toString());
    for (const [k, v] of Object.entries(next)) (v ? sp.set(k, v) : sp.delete(k));
    const s = sp.toString();
    router.replace(s ? `${pathname}?${s}` : pathname, { scroll: false });
  };

  const filtering = Boolean(q || category);
  const featured = !filtering ? articles.find((a) => a.slug === featuredSlug) : undefined;

  const results = useMemo(() => {
    const terms = normalise(q).split(/\s+/).filter(Boolean);
    return articles.filter((a) => {
      if (a.slug === featured?.slug) return false;
      if (category && a.category !== category) return false;
      if (!terms.length) return true;
      const hay = normalise([a.title, a.excerpt, a.categoryName, a.tags.join(' '), a.author ?? ''].join(' '));
      return terms.every((t) => hay.includes(t));
    });
  }, [articles, q, category, featured?.slug]);

  const visible = results.slice(0, pageParam * PAGE_SIZE);
  const visibleKey = visible.map((a) => a.slug).join();
  const hasMore = visible.length < results.length;
  const activeName = categories.find((c) => c.slug === category)?.name;
  const rootRef = useRef<HTMLDivElement>(null);
  const shown = useRef(new Set<string>());
  const filterKey = `${q}|${category}`;
  const lastFilter = useRef(filterKey);

  // Featured story uses the shared data-anim reveals; newly visible cards rise in as a group.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    animateNew(root);
    // A new filter replaces the list, so every card animates in again
    if (lastFilter.current !== filterKey) {
      shown.current.clear();
      lastFilter.current = filterKey;
    }
    const fresh = Array.from(root.querySelectorAll<HTMLElement>('li[data-card]')).filter((li) => !shown.current.has(li.dataset.card!));
    fresh.forEach((li) => shown.current.add(li.dataset.card!));
    if (fresh.length) {
      gsap.fromTo(fresh, { autoAlpha: 0, y: prefersReducedMotion() ? 0 : 40 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08, clearProps: 'transform' });
    }
    ScrollTrigger.refresh();
  }, [visibleKey, featured?.slug, filterKey]);

  return (
    <div ref={rootRef}>
      {/* Controls */}
      <div className="flex flex-col gap-8 border-b border-line pb-10 lg:flex-row lg:items-end lg:justify-between">
        <form
          role="search"
          className="relative w-full max-w-md"
          onSubmit={(e) => {
            e.preventDefault();
            updateParams({ q: query.trim() || null, page: null });
          }}
        >
          <label htmlFor="insight-search" className="label text-muted">
            Search insights
          </label>
          <div className="relative">
            <input
              id="insight-search"
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                updateParams({ q: e.target.value.trim() || null, page: null });
              }}
              placeholder="Title, topic or keyword"
              className="field pr-10 text-lg"
            />
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute right-0 top-1/2 h-5 w-5 -translate-y-1/2 text-gold" fill="none" stroke="currentColor" strokeWidth="1.4">
              <circle cx="11" cy="11" r="6.5" />
              <path d="m16 16 4.5 4.5" strokeLinecap="round" />
            </svg>
          </div>
        </form>

        <div role="group" aria-label="Filter by category" className="-mx-1 flex flex-wrap gap-2">
          {[{ slug: '', name: 'All', count: articles.length }, ...categories].map((c) => {
            const active = c.slug === category;
            return (
              <button
                key={c.slug || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => updateParams({ category: c.slug || null, page: null })}
                className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active ? 'border-gold bg-gold text-ink' : 'border-line text-ivory/75 hover:border-gold/60 hover:text-gold-light'
                }`}
              >
                {c.name}
                <span className={`ml-2 ${active ? 'text-ink/60' : 'text-muted'}`}>{c.count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {featured && (
        <div className="border-b border-line py-16">
          <FeaturedArticle article={featured} headingLevel="h2" />
        </div>
      )}

      <div className="pt-14">
        <div className="mb-10 flex flex-wrap items-baseline justify-between gap-4">
          <h2 className="font-serif text-3xl">{filtering ? 'Results' : 'Latest articles'}</h2>
          <p aria-live="polite" className="text-sm text-muted">
            {filtering
              ? `${results.length} ${results.length === 1 ? 'article' : 'articles'}${activeName ? ` in ${activeName}` : ''}${q ? ` matching “${q}”` : ''}`
              : `Showing ${visible.length} of ${results.length}`}
          </p>
        </div>

        {results.length === 0 ? (
          <div className="border border-line px-6 py-20 text-center">
            <p className="font-serif text-3xl">No articles found</p>
            <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">
              Nothing matches your search{activeName ? ` in ${activeName}` : ''}. Try a broader term or another category.
            </p>
            <button
              type="button"
              className="btn-outline mt-8"
              onClick={() => {
                setQuery('');
                updateParams({ q: null, category: null, page: null });
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <ul className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((a) => (
              <li key={a.slug} data-card={a.slug}>
                <ArticleCard article={a} />
              </li>
            ))}
          </ul>
        )}

        {hasMore && (
          <div className="mt-16 flex justify-center">
            <button type="button" className="btn-outline" onClick={() => updateParams({ page: String(pageParam + 1) })}>
              Load more articles
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
