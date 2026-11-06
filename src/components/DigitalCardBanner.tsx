const CARD_URL = 'https://dvc.vageshsamvedi.com/';

// Compact promotional strip for the free digital visiting card, shown directly below the Social Journey gallery.
export default function DigitalCardBanner() {
  return (
    <aside
      aria-label="Free digital visiting card"
      data-anim="fade-up"
      className="relative mt-16 flex flex-col items-start gap-6 overflow-hidden border border-gold/30 bg-[linear-gradient(110deg,rgba(200,164,93,0.09),transparent_45%,rgba(200,164,93,0.06))] px-6 py-6 sm:px-8 md:flex-row md:items-center md:justify-between md:gap-10 md:px-10 md:py-7"
    >
      <span aria-hidden className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
      <div className="flex items-start gap-4 md:items-center">
        <span aria-hidden className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2.5" y="5" width="19" height="14" rx="2" />
            <circle cx="8.5" cy="11" r="2" />
            <path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4.5M14 13h3" />
          </svg>
        </span>
        <p className="max-w-2xl font-serif text-lg leading-snug text-ivory md:text-xl">
          Because great connections deserve great tools —{' '}
          <span className="italic text-gold-light">Vagesh Samvedi gifts you a free digital visiting card.</span> Just click the button to
          get started!
        </p>
      </div>
      <a href={CARD_URL} className="btn-gold w-full shrink-0 text-center md:w-auto" data-magnetic>
        Create Your Free Digital Card
      </a>
    </aside>
  );
}
