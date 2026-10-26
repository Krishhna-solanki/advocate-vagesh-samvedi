'use client';

import { useEffect, useState } from 'react';
import type { Heading } from '@/lib/insights';

export default function TableOfContents({ headings, variant }: { headings: Heading[]; variant: 'inline' | 'sidebar' }) {
  const [active, setActive] = useState(headings[0]?.id);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter(Boolean) as HTMLElement[];
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-100px 0px -65% 0px' },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  const list = (
    <ol className="space-y-1 border-l border-line">
      {headings.map((h) => (
        <li key={h.id}>
          <a
            href={`#${h.id}`}
            aria-current={active === h.id ? 'location' : undefined}
            className={`-ml-px block border-l py-1.5 text-sm leading-6 transition-colors ${h.depth === 3 ? 'pl-8' : 'pl-5'} ${
              active === h.id ? 'border-gold text-gold-light' : 'border-transparent text-muted hover:text-ivory'
            }`}
          >
            {h.text}
          </a>
        </li>
      ))}
    </ol>
  );

  return variant === 'inline' ? (
    <details className="border border-line p-5">
      <summary className="label cursor-pointer text-muted">Contents</summary>
      <nav aria-label="Table of contents" className="mt-5">
        {list}
      </nav>
    </details>
  ) : (
    <nav aria-label="Table of contents">
      <p className="label mb-5 text-muted">Contents</p>
      {list}
    </nav>
  );
}
