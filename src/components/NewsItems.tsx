import Image from 'next/image';
import Link from 'next/link';
import type { NewsMeta } from '@/lib/news';
import { dateParts, formatDate } from '@/lib/format';

/**
 * News cover image, never cropped or tinted: clippings and photographs are shown whole at their own
 * proportions over a blurred, darkened copy of themselves that fills the frame.
 */
export function NewsCover({ item, sizes, className = '' }: { item: NewsMeta; sizes: string; className?: string }) {
  if (!item.cover) return null;
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      <Image src={item.cover} alt="" aria-hidden fill sizes="10vw" className="scale-110 object-cover opacity-30 blur-xl" />
      <Image
        src={item.cover}
        alt={item.coverAlt}
        fill
        sizes={sizes}
        className={`object-contain drop-shadow-[0_12px_30px_rgba(0,0,0,0.7)] ${item.coverStyle === 'clipping' ? 'p-3' : ''}`}
      />
    </div>
  );
}

/** One entry in the News timeline: a date block, then type, title and source, and a thumbnail when there is an image. */
export function NewsRow({ item, headingLevel = 'h3' }: { item: NewsMeta; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const d = item.date ? dateParts(item.date) : null;
  const source = [item.publication, item.location].filter(Boolean).join(' · ');
  return (
    <article className="group relative grid grid-cols-[4.5rem_1fr] gap-5 border-b border-line py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-8">
      <span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
      {d ? (
        <time dateTime={item.date} className="flex flex-col border-r border-line pr-5 leading-none">
          <span className="font-serif text-4xl text-gold-light">{d.day}</span>
          <span className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted">
            {d.month} {d.year}
          </span>
        </time>
      ) : (
        <span className="flex flex-col border-r border-line pr-5 leading-none">
          <span aria-hidden className="font-serif text-4xl text-gold-light/40">—</span>
          <span className="mt-2 text-[10px] uppercase leading-snug tracking-[0.18em] text-muted">Date not stated</span>
        </span>
      )}
      <div className="min-w-0">
        <p className="label">{item.type}</p>
        <H className="mt-2 font-serif text-2xl leading-snug transition-colors group-hover:text-gold-light">
          <Link href={`/news/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </H>
        {source && <p className="mt-2 text-sm text-muted">{source}</p>}
      </div>
      {item.cover ? (
        <NewsCover
          item={item}
          sizes="96px"
          className="col-start-2 h-24 w-20 self-center border border-line transition-colors duration-700 group-hover:border-gold/50 sm:col-start-auto sm:h-28 sm:w-24"
        />
      ) : (
        <span aria-hidden className="hidden self-center text-gold transition-transform duration-500 motion-safe:group-hover:translate-x-1 sm:block">
          →
        </span>
      )}
    </article>
  );
}

/** Lead story: larger card with its image (when there is one) and summary. */
export function NewsLead({ item }: { item: NewsMeta }) {
  return (
    <article className="group relative flex h-full flex-col border border-line bg-charcoal/50 transition-colors duration-700 hover:border-gold/40">
      {item.cover && (
        <div data-anim="image">
          <NewsCover
            item={item}
            sizes="(min-width: 1024px) 40vw, 92vw"
            className={item.coverStyle === 'clipping' ? 'aspect-[4/3]' : 'aspect-[16/10]'}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7 md:p-9">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em]">
          <span className="font-semibold text-gold">{item.type}</span>
          <span aria-hidden className="h-px w-4 bg-gold/50" />
          {item.date ? (
            <time dateTime={item.date} className="text-muted">
              {formatDate(item.date)}
            </time>
          ) : (
            <span className="text-muted">Date not stated</span>
          )}
        </p>
        <h3 className="mt-4 font-serif text-3xl leading-tight transition-colors group-hover:text-gold-light">
          <Link href={`/news/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        {item.publication && <p className="mt-3 text-sm italic text-gold-light/80">As reported in {item.publication}</p>}
        {item.excerpt && <p className="mt-4 text-sm leading-7 text-muted">{item.excerpt}</p>}
        <span className="link-gold mt-auto pt-8" aria-hidden>
          Read more <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
