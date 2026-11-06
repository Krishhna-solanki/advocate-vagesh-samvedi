'use client';

import { useState } from 'react';
import type { OfficeView } from '@/lib/offices';
import OfficeMap, { type MapSelection } from './OfficeMap';

function PinIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

// Office list and map, kept in sync: choosing a card highlights its pin, choosing a pin highlights its card.
export default function OfficeExplorer({ offices }: { offices: OfficeView[] }) {
  const firstPinned = offices.findIndex((o) => o.position);
  const [selection, setSelection] = useState<MapSelection | null>(firstPinned >= 0 ? { index: firstPinned, fly: false } : null);
  const pinNumber = new Map(offices.map((o, i) => ({ o, i })).filter(({ o }) => o.position).map(({ i }, n) => [i, n + 1]));
  const hasMap = pinNumber.size > 0;

  return (
    <div className={`grid gap-8 ${hasMap ? 'lg:grid-cols-12 lg:gap-10' : ''}`}>
      {hasMap && (
        <div className="lg:order-2 lg:col-span-7">
          <div className="h-80 sm:h-[26rem] lg:sticky lg:top-28 lg:h-[36rem]" data-anim="image">
            <OfficeMap offices={offices} selection={selection} onSelect={(index) => setSelection({ index, fly: false })} />
          </div>
        </div>
      )}

      <ul data-anim="stagger" className={`grid content-start gap-4 ${hasMap ? 'lg:order-1 lg:col-span-5' : 'sm:grid-cols-2 lg:grid-cols-4'}`}>
        {offices.map((o, i) => {
          if (o.placeholder) {
            return (
              <li key={`${o.title}-${i}`}>
                <article className="flex items-start gap-4 border border-dashed border-gold/25 bg-charcoal/40 p-5">
                  <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-dashed border-gold/40 text-gold/60">
                    <PinIcon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-serif text-xl text-ivory/70">{o.title}</h3>
                      <span className="border border-gold/40 px-2 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.18em] text-gold/80">
                        Coming soon
                      </span>
                    </div>
                    <p className="mt-1 text-sm italic text-muted">{o.address}</p>
                  </div>
                </article>
              </li>
            );
          }

          const active = selection?.index === i;
          const pin = pinNumber.get(i);
          return (
            <li key={`${o.title}-${i}`}>
              <article
                onClick={(e) => {
                  // Clicks on the card's own links/buttons keep their behaviour
                  if (pin && !(e.target as HTMLElement).closest('a,button')) setSelection({ index: i, fly: true });
                }}
                className={`group relative p-5 transition-[border-color,background-color,box-shadow,transform] duration-500 sm:p-6 ${pin ? 'cursor-pointer' : ''} border ${
                  active
                    ? 'border-gold/70 bg-gold/[0.06] shadow-[0_20px_45px_-28px_rgba(200,164,93,0.55),inset_0_0_0_1px_rgba(200,164,93,0.15)]'
                    : 'border-line bg-charcoal hover:border-gold/40 motion-safe:hover:-translate-y-0.5'
                }`}
              >
                <span aria-hidden className={`absolute inset-y-0 left-0 w-0.5 bg-gold transition-opacity duration-500 ${active ? 'opacity-100' : 'opacity-0'}`} />
                <div className="flex items-start gap-4">
                  <span
                    aria-hidden
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-semibold transition-colors duration-500 ${
                      active ? 'border-gold bg-gold text-ink' : 'border-gold/50 text-gold'
                    }`}
                  >
                    {pin ?? <PinIcon className="h-4 w-4" />}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="label">{o.title}</p>
                    {o.name && <h3 className="mt-2 font-serif text-xl leading-snug text-ivory sm:text-2xl">{o.name}</h3>}
                    <address className="mt-2 text-sm not-italic leading-6 text-muted">
                      {o.address}
                      {o.city && <span className="block">{o.city}</span>}
                    </address>
                    {o.phone && (
                      <a href={`tel:${o.phone.replace(/[^\d+]/g, '')}`} className="mt-2 inline-block text-sm text-ivory/80 hover:text-gold-light">
                        {o.phone}
                      </a>
                    )}
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {o.directionsHref && (
                        <a href={o.directionsHref} target="_blank" rel="noopener noreferrer" className="btn-gold px-4 py-2.5 text-[11px]">
                          <PinIcon className="h-4 w-4" />
                          Get Directions
                          <span className="sr-only"> to {o.title} in Google Maps (opens in a new tab)</span>
                        </a>
                      )}
                      {pin && (
                        <button
                          type="button"
                          onClick={() => setSelection({ index: i, fly: true })}
                          aria-pressed={active}
                          className="link-gold"
                        >
                          {active ? 'Shown on map' : 'Show on map'} <span className="arrow" aria-hidden>→</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
