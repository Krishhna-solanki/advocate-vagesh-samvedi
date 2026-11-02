import Image from 'next/image';
import Link from 'next/link';
import type { NewsMeta } from '@/lib/news';
import { dateParts, formatDate } from '@/lib/format';

/** One entry in the News timeline: a date block, then type, title and location. */
export function NewsRow({ item, headingLevel = 'h3' }: { item: NewsMeta; headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  const d = dateParts(item.date);
  return (
    <article className="group relative grid grid-cols-[4.5rem_1fr] gap-5 border-b border-line py-7 sm:grid-cols-[5.5rem_1fr_auto] sm:gap-8">
      <span aria-hidden className="absolute bottom-[-1px] left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
      <time dateTime={item.date} className="flex flex-col border-r border-line pr-5 leading-none">
        <span className="font-serif text-4xl text-gold-light">{d.day}</span>
        <span className="mt-2 text-[10px] uppercase tracking-[0.22em] text-muted">
          {d.month} {d.year}
        </span>
      </time>
      <div className="min-w-0">
        <p className="label">{item.type}</p>
        <H className="mt-2 font-serif text-2xl leading-snug transition-colors group-hover:text-gold-light">
          <Link href={`/news/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </H>
        {item.location && <p className="mt-2 text-sm text-muted">{item.location}</p>}
      </div>
      <span aria-hidden className="hidden self-center text-gold transition-transform duration-500 motion-safe:group-hover:translate-x-1 sm:block">
        →
      </span>
    </article>
  );
}

/** Lead story: larger card with photograph (when there is one) and summary. */
export function NewsLead({ item }: { item: NewsMeta }) {
  return (
    <article className="group relative flex h-full flex-col border border-line bg-charcoal/50 transition-colors duration-700 hover:border-gold/40">
      {item.cover && (
        <div className="relative aspect-[16/10] overflow-hidden" data-anim="image">
          <Image src={item.cover} alt={item.coverAlt} fill sizes="(min-width: 1024px) 40vw, 92vw" className="cover-tone object-cover" />
        </div>
      )}
      <div className="flex flex-1 flex-col p-7 md:p-9">
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] uppercase tracking-[0.18em]">
          <span className="font-semibold text-gold">{item.type}</span>
          <span aria-hidden className="h-px w-4 bg-gold/50" />
          <time dateTime={item.date} className="text-muted">
            {formatDate(item.date)}
          </time>
        </p>
        <h3 className="mt-4 font-serif text-3xl leading-tight transition-colors group-hover:text-gold-light">
          <Link href={`/news/${item.slug}`} className="after:absolute after:inset-0">
            {item.title}
          </Link>
        </h3>
        {item.excerpt && <p className="mt-4 text-sm leading-7 text-muted">{item.excerpt}</p>}
        <span className="link-gold mt-auto pt-8" aria-hidden>
          Read more <span className="arrow">→</span>
        </span>
      </div>
    </article>
  );
}
