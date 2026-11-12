import { site } from '@/lib/site';

// "Join WhatsApp Channel" call to action (Contact section). Gold outline that fills with a gold sweep on hover.
export default function WhatsAppChannelButton({ className = '' }: { className?: string }) {
  return (
    <a
      href={site.whatsappChannel}
      target="_blank"
      rel="noopener noreferrer"
      data-magnetic
      className={`wa-channel group relative inline-flex w-full items-center gap-4 overflow-hidden border border-gold/60 px-5 py-4 sm:w-auto sm:pr-7 ${className}`}
    >
      <span aria-hidden className="wa-channel__fill" />
      <span
        aria-hidden
        className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gold/50 text-gold transition-[transform,border-color,color] duration-500 group-hover:rotate-[-8deg] group-hover:scale-110 group-hover:border-ink/40 group-hover:text-ink"
      >
        {/* WhatsApp logo */}
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.01Zm-7.01 15.24h-.01a8.23 8.23 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.38c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c0 4.54-3.7 8.22-8.23 8.22Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43.13-.15.17-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18-.06-.1-.22-.16-.47-.28Z" />
        </svg>
      </span>
      <span className="relative min-w-0 flex-1">
        <span className="block text-[10px] uppercase tracking-[0.22em] text-muted transition-colors duration-500 group-hover:text-ink/70">
          Stay updated
        </span>
        <span className="mt-1 block text-[13px] font-semibold uppercase tracking-[0.16em] text-gold-light transition-colors duration-500 group-hover:text-ink">
          Join WhatsApp Channel
        </span>
      </span>
      <span aria-hidden className="relative text-gold transition-[transform,color] duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-1 group-hover:text-ink">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
