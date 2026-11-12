import Image from 'next/image';
import Link from 'next/link';
import SpotlightGroup from './SpotlightGroup';
import { responsibilityPath, type Responsibility } from '@/lib/responsibilities';

// Homepage: "Professional Responsibilities Beyond Legal Practice". One card per organisation
// (content/responsibilities/*.md), each linking to its detail page. Scroll reveal: data-anim="resp-card".
export default function Responsibilities({ items }: { items: Responsibility[] }) {
  if (!items.length) return null;
  return (
    <section id="responsibilities" aria-labelledby="responsibilities-heading" className="relative overflow-hidden border-t border-line bg-charcoal/40 py-28 md:py-36">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
      <div className="container relative">
        <div className="mx-auto max-w-3xl text-center">
          <p className="label flex items-center justify-center gap-4" data-anim="fade-up">
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
            Leadership &amp; Service
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
          </p>
          <h2 id="responsibilities-heading" className="display mt-6 text-4xl sm:text-5xl lg:text-6xl" data-anim="heading" data-delay="100">
            Professional Responsibilities <span className="italic text-gold-light">Beyond</span> Legal Practice
          </h2>
        </div>

        <SpotlightGroup className="mx-auto mt-16 grid max-w-6xl gap-6 md:mt-20 md:grid-cols-2 lg:gap-8">
          {items.map((r, i) => (
            <Link
              key={r.slug}
              href={responsibilityPath(r.slug)}
              data-anim="resp-card"
              data-spotlight
              className="resp-card group relative flex flex-col overflow-hidden border border-line bg-ink"
            >
              {/* Photograph */}
              <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/11]">
                <div data-resp-media className="absolute inset-0">
                  {r.cover && (
                    <Image
                      src={r.cover}
                      alt=""
                      fill
                      sizes="(min-width: 1280px) 560px, (min-width: 768px) 46vw, 92vw"
                      className="object-cover grayscale-[40%] transition-[transform,filter] duration-[1.2s] ease-out group-hover:scale-[1.06] group-hover:grayscale-0"
                    />
                  )}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/35 to-ink/10" />
                <div aria-hidden className="pointer-events-none absolute inset-3 border border-gold/15 transition-colors duration-700 group-hover:border-gold/40" />
                <span
                  data-resp-item
                  className="absolute left-6 top-6 border border-gold/40 bg-ink/70 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold backdrop-blur-sm"
                >
                  {r.role}
                </span>
                <span aria-hidden data-resp-item className="resp-card__index absolute bottom-3 right-6 font-serif text-7xl italic leading-none md:text-8xl">
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>

              {/* Text */}
              <div className="relative flex flex-1 flex-col px-6 pb-7 pt-2 md:px-9 md:pb-9">
                <h3 data-resp-item className="font-serif text-[1.75rem] leading-tight text-ivory transition-colors duration-500 group-hover:text-gold-light md:text-[2.1rem]">
                  {r.organisation}
                </h3>
                <p data-resp-item className="mt-4 max-w-md text-[0.95rem] leading-7 text-ivory/65">
                  {r.summary}
                </p>
                <div data-resp-item className="mt-auto flex items-center justify-between gap-4 pt-8">
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">View details</span>
                  <span
                    aria-hidden
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/50 text-gold transition-[background-color,color,transform] duration-500 group-hover:translate-x-1 group-hover:bg-gold group-hover:text-ink"
                  >
                    →
                  </span>
                </div>
              </div>
              <span aria-hidden className="resp-card__rule" />
            </Link>
          ))}
        </SpotlightGroup>
      </div>
    </section>
  );
}
