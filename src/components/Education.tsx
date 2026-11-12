import { site } from '@/lib/site';

// "Education & Academic Qualifications" on the homepage: a vertical timeline whose gold line draws as the
// reader scrolls (data-anim="draw-y"); each entry reveals from its side (data-anim="edu-item").
// Qualifications come from site.education, unchanged.

const isDegree = (degree: string) => /LL\.B|LL\.M|Master|Bachelor/i.test(degree);

function DegreeIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />
    </svg>
  );
}

function CertificateIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      <rect x="3.5" y="5" width="17" height="11" rx="1" />
      <path d="M7 9h10M7 12h6" />
      <circle cx="16.5" cy="16.5" r="2.5" />
      <path d="m15.3 18.7-.8 2.8 2-1 2 1-.8-2.8" />
    </svg>
  );
}

export default function Education() {
  return (
    <section aria-labelledby="education-heading" className="education-luxe relative overflow-hidden border-t border-line py-28 md:py-36">
      <div className="container relative">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="label flex items-center justify-center gap-4" data-anim="fade-up">
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
            Academic Foundation
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
          </p>
          <h2 id="education-heading" className="display mt-6 text-4xl sm:text-5xl lg:text-6xl" data-anim="heading" data-delay="100">
            Education <span className="italic text-gold-light">&amp;</span> Academic Qualifications
          </h2>
          <div aria-hidden className="mx-auto mt-9 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" data-anim="line-x" />
            <span className="h-2 w-2 rotate-45 border border-gold" data-anim="fade-up" data-delay="300" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" data-anim="line-x" />
          </div>
        </div>

        {/* Timeline: line on the left on phones, centred with alternating entries from md up */}
        <ol className="edu-timeline relative mx-auto mt-16 max-w-5xl md:mt-24">
          <span aria-hidden className="absolute bottom-4 left-[11px] top-4 w-px bg-line md:left-1/2 md:-translate-x-1/2" />
          <span
            aria-hidden
            data-anim="draw-y"
            className="absolute bottom-4 left-[11px] top-4 w-px origin-top bg-gradient-to-b from-gold via-gold/80 to-gold/30 md:left-1/2 md:-translate-x-1/2"
          />

          {site.education.map((e, i) => {
            const left = i % 2 === 0;
            const degree = isDegree(e.degree);
            return (
              <li
                key={e.degree}
                data-anim="edu-item"
                data-side={left ? 'left' : 'right'}
                className={`relative grid pb-10 pl-12 last:pb-0 md:grid-cols-2 md:pb-14 md:pl-0 ${i > 0 ? "md:-mt-40" : ""}`}
              >
                {/* Node on the line */}
                <span aria-hidden className="absolute left-[11px] top-9 z-10 -translate-x-1/2 md:left-1/2">
                  <span data-edu-node className="flex h-4 w-4 rotate-45 items-center justify-center border border-gold bg-ink">
                    <span className="h-1.5 w-1.5 bg-gold" />
                  </span>
                </span>

                <div
                  data-edu-card
                  className={`edu-card group relative ${left ? 'md:col-start-1 md:mr-14' : 'md:col-start-2 md:ml-14'} ${degree ? 'edu-card--degree' : ''}`}
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="contact-card__icon !h-11 !w-11">{degree ? <DegreeIcon /> : <CertificateIcon />}</span>
                    <span className="font-serif text-sm italic text-gold/60 transition-colors duration-500 group-hover:text-gold-light">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.22em] text-gold/80">
                    {degree ? 'Degree' : 'Certification'}
                  </p>
                  <h3
                    className={`mt-2 font-serif leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-light ${
                      degree ? 'text-[1.6rem] md:text-[1.85rem]' : 'text-[1.35rem] md:text-[1.5rem]'
                    }`}
                  >
                    {e.degree}
                  </h3>
                  <p className="mt-2 text-ivory/70">{e.institution}</p>
                  <p className="mt-5 inline-flex items-center gap-3 text-xs uppercase tracking-[0.18em] text-gold">
                    <span aria-hidden className="h-px w-6 bg-gold/60" />
                    {e.detail}
                  </p>
                  <span aria-hidden className="edu-card__rule" />
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
