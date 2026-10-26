'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsap';
import { scrollToTop } from '@/lib/smooth-scroll';

const RING = 2 * Math.PI * 20;

// Site-wide reading-progress bar plus a back-to-top button that traces the same progress.
export default function ScrollUI() {
  const pathname = usePathname();
  const bar = useRef<HTMLDivElement>(null);
  const top = useRef<HTMLButtonElement>(null);
  const ring = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const setBar = gsap.quickSetter(bar.current, 'scaleX');
    const btn = top.current!;
    let shown = false;
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        setBar(self.progress);
        ring.current?.setAttribute('stroke-dashoffset', String(RING * (1 - self.progress)));
        const show = self.scroll() > 700;
        if (show !== shown) {
          shown = show;
          btn.dataset.visible = String(show);
          btn.tabIndex = show ? 0 : -1;
        }
      },
    });
    return () => st.kill();
  }, []);

  // New page: recompute against its height
  useEffect(() => {
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, [pathname]);

  return (
    <>
      <div
        ref={bar}
        aria-hidden
        className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left scale-x-0 bg-gradient-to-r from-gold-dim via-gold to-gold-light"
      />
      <button
        ref={top}
        type="button"
        tabIndex={-1}
        aria-label="Back to top"
        data-visible="false"
        onClick={() => {
          scrollToTop();
          document.querySelector<HTMLElement>('header a')?.focus({ preventScroll: true });
        }}
        className="group fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-ink/80 text-gold backdrop-blur transition-[opacity,transform] duration-500 data-[visible=false]:pointer-events-none data-[visible=false]:translate-y-3 data-[visible=false]:opacity-0 md:bottom-8 md:right-8"
        style={{ marginBottom: 'env(safe-area-inset-bottom, 0px)' }}
      >
        <svg viewBox="0 0 48 48" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
          <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="1" />
          <circle
            ref={ring}
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray={RING}
            strokeDashoffset={RING}
          />
        </svg>
        <svg viewBox="0 0 24 24" className="relative h-4 w-4 transition-transform duration-500 group-hover:-translate-y-0.5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
          <path d="M12 19V5M6 11l6-6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </>
  );
}
