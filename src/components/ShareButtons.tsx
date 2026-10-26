'use client';

import { useState } from 'react';

export default function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}` },
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
  ];

  const copy = async () => {
    try {
      if (navigator.share && window.matchMedia('(pointer: coarse)').matches) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };

  const cls =
    'border border-line px-3.5 py-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ivory/75 transition-colors hover:border-gold/60 hover:text-gold-light';

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="label mr-2 text-muted">Share</span>
      {links.map((l) => (
        <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" className={cls}>
          {l.label}
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      ))}
      <button type="button" onClick={copy} className={cls}>
        {copied ? 'Link copied' : 'Copy link'}
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? 'Link copied to clipboard' : ''}
      </span>
    </div>
  );
}
