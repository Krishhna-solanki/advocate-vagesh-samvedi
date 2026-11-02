const CARD_URL = 'https://dvc.vageshsamvedi.com/';

function CardIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <circle cx="8.5" cy="11" r="2" />
      <path d="M5.5 16c.6-1.6 1.7-2.4 3-2.4s2.4.8 3 2.4M14 10h4.5M14 13h3" />
    </svg>
  );
}

// A sample visiting card, drawn in CSS (no personal details — the tool is for anyone).
function SampleCard({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative aspect-[1.72/1] w-full overflow-hidden rounded-xl border border-gold/50 bg-[linear-gradient(135deg,#1c1a15_0%,#0e0e0d_55%,#191710_100%)] p-5 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.95)] sm:p-7 ${className}`}
    >
      <span aria-hidden className="absolute -right-10 -top-16 h-40 w-40 rounded-full bg-[radial-gradient(circle,rgba(228,204,145,0.18),transparent_65%)]" />
      <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-gold-light to-transparent" />
      <div className="flex h-full flex-col justify-between">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/60 font-serif text-sm text-gold">YN</span>
            <div>
              <p className="font-serif text-lg leading-tight text-ivory sm:text-xl">Your Name</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.24em] text-gold sm:text-[10px]">Your Designation</p>
            </div>
          </div>
          {/* QR code motif */}
          <div aria-hidden className="grid h-12 w-12 shrink-0 grid-cols-5 gap-[2px] rounded border border-gold/30 p-1 sm:h-14 sm:w-14">
            {Array.from({ length: 25 }, (_, i) => (
              <span key={i} className={[0, 1, 4, 5, 6, 8, 12, 13, 16, 18, 19, 20, 21, 23, 24].includes(i) ? 'bg-gold/70' : ''} />
            ))}
          </div>
        </div>
        <div className="space-y-1.5 text-[10px] text-ivory/60 sm:text-xs">
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-px w-3 bg-gold" /> +91 00000 00000
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-px w-3 bg-gold" /> you@example.com
          </p>
          <p className="flex items-center gap-2">
            <span aria-hidden className="h-px w-3 bg-gold" /> Share · Save · Connect
          </p>
        </div>
      </div>
    </div>
  );
}

export default function DigitalCardPromo() {
  return (
    <section
      aria-labelledby="digital-card-heading"
      className="relative overflow-hidden border-y border-line bg-[radial-gradient(70%_90%_at_80%_50%,rgba(200,164,93,0.10),transparent_70%)] py-28 md:py-36"
    >
      <div className="container grid items-center gap-16 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="label flex items-center gap-4" data-anim="fade-up">
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
            Digital Visiting Card
          </p>
          <h2 id="digital-card-heading" className="display mt-6 text-4xl sm:text-5xl lg:text-[3.4rem]" data-anim="heading" data-delay="100">
            Want a Professional Digital Visiting Card? <span className="italic text-gold-light">Create Yours for Free</span>
          </h2>
          <p className="mt-8 max-w-xl text-base leading-8 text-muted md:text-lg" data-anim="fade-up" data-delay="300">
            Create a sleek, professional digital visiting card with VAGESH SAMVEDI. Design and share your professional identity effortlessly.
          </p>
          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center" data-anim="fade-up" data-delay="450">
            <a href={CARD_URL} className="btn-gold px-8 py-4 text-[12.5px]" data-magnetic>
              <CardIcon />
              Create Your Digital Card
            </a>
            <span className="text-xs uppercase tracking-[0.2em] text-muted">Free · Takes a few minutes</span>
          </div>
        </div>

        {/* Stacked sample cards */}
        <div className="relative mx-auto w-full max-w-md lg:col-span-5 lg:col-start-8 lg:max-w-none" data-anim="fade-up" data-delay="200">
          <div className="relative px-4 py-10 sm:px-8" data-speed="0.25">
            <SampleCard className="absolute inset-x-10 top-0 -rotate-6 opacity-40 blur-[1px] sm:inset-x-14" />
            <div className="relative rotate-2 transition-transform duration-700 motion-safe:hover:rotate-0 motion-safe:hover:scale-[1.02]">
              <SampleCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
