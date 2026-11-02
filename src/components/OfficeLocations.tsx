import { offices, type OfficeView } from '@/lib/offices';
import SectionHeading from './SectionHeading';

function PinIcon({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  );
}

function OfficeCard({ office, index }: { office: OfficeView; index: number }) {
  const external = { target: '_blank', rel: 'noopener noreferrer' } as const;
  const address = (
    <>
      <span className="block whitespace-pre-line">{office.address}</span>
      {office.city && <span className="mt-1 block">{office.city}</span>}
    </>
  );

  return (
    <article className="group relative flex h-full flex-col border border-line bg-charcoal p-7 shadow-[inset_0_-60px_80px_-60px_rgba(200,164,93,0.1)] transition-[border-color,box-shadow,transform] duration-700 hover:border-gold/45 hover:shadow-[inset_0_-80px_90px_-60px_rgba(200,164,93,0.18),0_26px_50px_-28px_rgba(200,164,93,0.35)] motion-safe:hover:-translate-y-1 md:p-8">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
      <div className="flex items-start justify-between gap-4">
        <PinIcon className="h-7 w-7 text-gold transition-colors group-hover:text-gold-light" />
        {office.placeholder ? (
          <span className="border border-gold/50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">Placeholder</span>
        ) : (
          <span className="font-serif text-sm italic text-muted">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>

      <h3 className="mt-8 font-serif text-2xl leading-tight">{office.name}</h3>

      <address className={`mt-4 text-sm not-italic leading-7 ${office.placeholder ? 'italic text-muted' : 'text-ivory/75'}`}>
        {office.mapHref ? (
          <a href={office.mapHref} {...external} className="transition-colors hover:text-gold-light">
            {address}
            <span className="sr-only"> — open in Google Maps (new tab)</span>
          </a>
        ) : (
          address
        )}
      </address>

      {office.phone && (
        <p className="mt-3 text-sm">
          <a href={`tel:${office.phone.replace(/[^\d+]/g, '')}`} className="text-ivory/75 transition-colors hover:text-gold-light">
            {office.phone}
          </a>
        </p>
      )}

      <div className="mt-auto pt-8">
        {office.mapHref ? (
          <a href={office.mapHref} {...external} className="link-gold">
            View on Map <span className="arrow" aria-hidden>↗</span>
            <span className="sr-only"> — {office.name} in Google Maps (opens in a new tab)</span>
          </a>
        ) : (
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted/70">Map link available once the address is confirmed</p>
        )}
      </div>
    </article>
  );
}

// Office cards; the column count follows the number of offices (1–4 per row).
export default function OfficeLocations() {
  if (offices.length === 0) return null;
  const cols = ['', '', 'sm:grid-cols-2', 'sm:grid-cols-2 lg:grid-cols-3', 'sm:grid-cols-2 lg:grid-cols-4'][Math.min(offices.length, 4)];

  return (
    <section aria-labelledby="offices-heading" className="border-t border-line py-24 md:py-32">
      <div className="container">
        <SectionHeading
          id="offices-heading"
          align="split"
          label="Offices"
          title="Office Locations"
          intro="Select an address or “View on Map” to open the office in Google Maps."
        />
        <ul data-anim="stagger" className={`mt-14 grid gap-5 ${cols}`}>
          {offices.map((o, i) => (
            <li key={`${o.name}-${i}`}>
              <OfficeCard office={o} index={i} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
