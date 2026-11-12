'use client';

// Lets a soft gold light follow the pointer across any [data-spotlight] card inside it
// (sets --mx / --my on the card; the glow itself is CSS). Mouse/pen only — touch shows the static design.
export default function SpotlightGroup({ className, children }: { className?: string; children: React.ReactNode }) {
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === 'touch') return;
    const card = (e.target as HTMLElement).closest<HTMLElement>('[data-spotlight]');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <div className={className} onPointerMove={onMove}>
      {children}
    </div>
  );
}
