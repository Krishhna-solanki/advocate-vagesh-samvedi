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
      const y = dateParts(n.date).year;
      groups.set(y, [...(groups.get(y) ?? []), n]);
    });
    return [...groups];
  }, [visible]);

  return (
    <div>
      {types.length > 1 && (
        <div role="group" aria-label="Filter news by type" className="-mx-1 mb-12 flex flex-wrap gap-2">
          {['', ...types].map((t) => {
            const active = t === type;
            return (
              <button
                key={t || 'all'}
                type="button"
                aria-pressed={active}
                onClick={() => {
                  setType(t);
                  setLimit(PAGE_SIZE);
                }}
                className={`border px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] transition-colors ${
                  active ? 'border-gold bg-gold text-ink' : 'border-line text-ivory/75 hover:border-gold/60 hover:text-gold-light'
                }`}
              >
                {t || 'All'}
                <span className={`ml-2 ${active ? 'text-ink/60' : 'text-muted'}`}>{t ? items.filter((n) => n.type === t).length : items.length}</span>
              </button>
            );
          })}
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
