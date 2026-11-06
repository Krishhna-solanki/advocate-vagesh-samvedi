'use client';

import { useMemo, useState } from 'react';
import type { NewsMeta } from '@/lib/news';
import { NewsRow } from './NewsItems';
import { dateParts } from '@/lib/format';

const PAGE_SIZE = 12;

// Full News listing: filter by type, grouped by year, with "show more".
export default function NewsTimeline({ items, types }: { items: NewsMeta[]; types: string[] }) {
  const [type, setType] = useState('');
  const [limit, setLimit] = useState(PAGE_SIZE);

  const filtered = useMemo(() => items.filter((n) => !type || n.type === type), [items, type]);
  const visible = filtered.slice(0, limit);
  const years = useMemo(() => {
    const groups = new Map<string, NewsMeta[]>();
    visible.forEach((n) => {
      const y = n.date ? dateParts(n.date).year : 'Undated';
      groups.set(y, [...(groups.get(y) ?? []), n]);
    });
    return [...groups];
  }, [visible]);

  return (
    <div>
      {types.length > 1 && (
        // One row that scrolls sideways on phones; wraps on larger screens
        <div className="mb-12 flex items-center gap-4 border-b border-line pb-6">
          <span className="label hidden shrink-0 text-muted sm:inline">Filter</span>
          <div
            role="group"
            aria-label="Filter news by category"
            className="-mx-5 flex flex-1 gap-2 overflow-x-auto px-5 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0"
          >
            {['', ...types].map((t) => {
              const active = t === type;
              const count = t ? items.filter((n) => n.type === t).length : items.length;
              return (
                <button
                  key={t || 'all'}
                  type="button"
                  aria-pressed={active}
                  aria-label={`${t || 'All news'} (${count} ${count === 1 ? 'article' : 'articles'})`}
                  onClick={() => {
                    setType(t);
                    setLimit(PAGE_SIZE);
                  }}
                  className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap border px-3.5 py-1.5 text-[10.5px] font-semibold uppercase tracking-[0.14em] transition-colors ${
                    active ? 'border-gold bg-gold text-ink' : 'border-line text-ivory/75 hover:border-gold/60 hover:text-gold-light'
                  }`}
                >
                  {t || 'All'}
                  <span
                    aria-hidden
                    className={`min-w-[1.25rem] rounded-full px-1.5 py-px text-center text-[10px] tracking-normal ${
                      active ? 'bg-ink/15 text-ink' : 'bg-gold/10 text-gold'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <p aria-live="polite" className="sr-only">
        {filtered.length} news {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {years.map(([year, list]) => (
        <section key={year} aria-labelledby={`year-${year}`} className="grid gap-6 lg:grid-cols-12">
          <h2 id={`year-${year}`} className="font-serif text-5xl text-gold/30 lg:col-span-2 lg:pt-6">
            {year}
          </h2>
          <ul className="border-t border-line lg:col-span-10">
            {list.map((n) => (
              <li key={n.slug} className="animate-fade-up">
                <NewsRow item={n} />
              </li>
            ))}
          </ul>
        </section>
      ))}

      {visible.length < filtered.length && (
        <div className="mt-14 flex justify-center">
          <button type="button" className="btn-outline" onClick={() => setLimit((l) => l + PAGE_SIZE)}>
            Show more news
          </button>
        </div>
      )}
    </div>
  );
}
