export default function Monogram({ size = 'md' }: { size?: 'md' | 'lg' }) {
  const box = size === 'lg' ? 'h-14 w-14 text-2xl' : 'h-10 w-10 text-[17px]';
  return (
    <span
      aria-hidden="true"
      className={`relative inline-flex ${box} shrink-0 items-center justify-center border border-gold/70 font-serif font-semibold tracking-[0.06em] text-gold`}
    >
      <span className="absolute inset-[3px] border border-gold/20" />
      VS
    </span>
  );
}
