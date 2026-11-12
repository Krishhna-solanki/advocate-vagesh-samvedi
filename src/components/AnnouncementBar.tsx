import Link from 'next/link';

// Slim "E-Books Coming Soon" marquee at the very top of the header. Pure CSS (globals.css: .announce-*):
// the track holds two identical halves and slides by exactly one half, so the loop is seamless.
// Pauses on hover/focus; static and centred for visitors who prefer reduced motion.
const ITEMS = ['E-Books Coming Soon', 'Legal e-books by Advocate Vagesh Samvedi are in preparation', 'Explore E-Books'];

function Run({ hidden }: { hidden?: boolean }) {
  return (
    <span className="announce-run" aria-hidden={hidden || undefined}>
      {Array.from({ length: 3 }).flatMap((_, r) =>
        ITEMS.map((text, i) => (
          <span key={`${r}-${i}`} className="announce-item">
            <span aria-hidden className="announce-diamond" />
            {i === 0 ? <strong className="font-semibold text-gold-light">{text}</strong> : text}
            {i === 2 && <span aria-hidden> →</span>}
          </span>
        )),
      )}
    </span>
  );
}

export default function AnnouncementBar() {
  return (
    <Link href="/e-books" className="announce group" aria-label="E-Books coming soon — explore e-books">
      <span className="announce-track">
        <Run />
        <Run hidden />
      </span>
      {/* Reduced motion: one static line instead of the moving track */}
      <span className="announce-static">
        <strong className="font-semibold text-gold-light">E-Books Coming Soon</strong>
        <span aria-hidden className="announce-diamond" />
        Explore E-Books <span aria-hidden>→</span>
      </span>
    </Link>
  );
}
