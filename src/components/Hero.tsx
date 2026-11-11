import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/lib/site';

// Animated by the hero timeline in ScrollAnimations.tsx (data-hero-* attributes).
export default function Hero() {
  return (
    <section data-hero className="relative isolate flex min-h-[100svh] items-end overflow-hidden lg:items-center">
      {/* Background: drifting column texture and soft gold light */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-20 overflow-hidden">
        <div data-hero-columns className="texture-columns absolute -inset-x-[10%] inset-y-0" />
        <div
          data-hero-glow
          className="absolute -left-[10%] top-[18%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(200,164,93,0.16),transparent_62%)]"
        />
        <div
          data-hero-glow
          className="absolute bottom-[-20%] left-[38%] h-[45vmax] w-[45vmax] rounded-full bg-[radial-gradient(circle,rgba(228,204,145,0.09),transparent_60%)]"
        />
      </div>

      {/* Portrait — full-bleed on mobile, right half on desktop, blended into the dark ground */}
      <div data-hero-media className="absolute inset-0 -z-10 lg:left-[44%]">
        <div data-hero-parallax className="absolute -inset-y-[8%] inset-x-0 will-change-transform">
          <Image
            src="/images/hero-portrait.webp"
            alt="Advocate Vagesh Samvedi writing at his desk in his chamber, with law books on the shelves behind him"
            fill
            priority
            sizes="(min-width: 1024px) 56vw, 100vw"
            className="object-cover object-[60%_40%] brightness-[0.72] contrast-[1.05] saturate-[0.9]"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/75 to-ink/45 lg:bg-gradient-to-r lg:from-ink lg:via-ink/40 lg:to-transparent" />
        {/* Keeps the header readable over the bright wall in this photo */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-ink/85 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-ink to-transparent" />
        {/* One light sweep across the portrait after it is revealed */}
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden mix-blend-soft-light">
          <div data-hero-sheen className="absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-gold-light/40 to-transparent opacity-0" />
        </div>
      </div>

      <div className="container relative pb-20 pt-40 lg:py-40">
        <div data-hero-content className="relative max-w-2xl lg:pl-12">
          <span
            data-hero-line
            aria-hidden
            className="absolute -top-6 bottom-0 left-0 hidden w-px bg-gradient-to-b from-gold via-gold/60 to-transparent lg:block"
          />

          <p data-hero-label className="label">
            {site.fullName} <span className="text-gold/50">·</span> {site.role}
          </p>
          <h1 data-hero-title className="display mt-8 text-[2.9rem] sm:text-6xl xl:text-[5.5rem]">
            Clarity in Law.
            <br />
            <span className="italic text-gold-light">Confidence</span> in Every Decision.
          </h1>
          <p data-hero-text className="mt-8 max-w-xl text-base leading-8 text-ivory/75 md:text-lg">
            An independent legal practitioner engaged in litigation, legal representation and advisory services across Madhya Pradesh and
            Gujarat. With academic qualifications in law and Intellectual Property Rights, his professional interests extend to civil and
            property disputes, criminal law, family matters, cyber law and emerging legal challenges involving technology and digital rights.
          </p>
          <div data-hero-cta className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/practice-areas" className="btn-gold" data-magnetic>
              Explore Practice Areas
            </Link>
            <Link href="/about" className="btn-outline" data-magnetic>
              About Advocate Vagesh Samvedi
            </Link>
          </div>
        </div>
      </div>

      <div
        data-hero-meta
        className="pointer-events-none absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted lg:flex"
      >
        <span>Scroll</span>
        <span className="relative h-12 w-px overflow-hidden bg-line">
          <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-gold" />
        </span>
      </div>
      <div
        data-hero-meta
        className="pointer-events-none absolute bottom-8 right-8 hidden items-center gap-4 text-[10px] uppercase tracking-[0.3em] text-muted lg:flex"
      >
        <span>Madhya Pradesh · Gujarat</span>
        <span className="h-px w-12 bg-gold/60" />
      </div>
    </section>
  );
}
