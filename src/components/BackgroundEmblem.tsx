'use client';

import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { whenPreloaderDone } from '@/lib/preloader-signal';

// 72 engraved ticks (every 5°), longer every 30°
const TICKS = Array.from({ length: 72 }, (_, i) => {
  const a = (i * 5 * Math.PI) / 180;
  const inner = i % 6 === 0 ? 178 : 183;
  const r = (n: number) => Math.round(n * 100) / 100;
  return { x1: r(200 + inner * Math.sin(a)), y1: r(200 - inner * Math.cos(a)), x2: r(200 + 189 * Math.sin(a)), y2: r(200 - 189 * Math.cos(a)) };
});

/**
 * Fixed, centered scales-of-justice watermark behind every page.
 * Sits below all content (z-index -1, the root background is on <html>), never takes pointer events,
 * fades in after the preloader, and on desktop the tick ring turns a few degrees as the page scrolls.
 */
export default function BackgroundEmblem() {
  const root = useRef<HTMLDivElement>(null);
  const ring = useRef<SVGGElement>(null);

  useEffect(() => {
    const reduce = prefersReducedMotion();
    let spin: gsap.core.Tween | undefined;
    const cancel = whenPreloaderDone(() => {
      gsap.to(root.current, { autoAlpha: 1, duration: reduce ? 1 : 2.4, delay: 0.5, ease: 'power2.out' });
      if (!reduce && window.matchMedia('(min-width: 768px) and (hover: hover)').matches) {
        spin = gsap.to(ring.current, { rotation: 30, svgOrigin: '200 200', ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 1.5 } });
      }
    });
    return () => {
      cancel();
      spin?.scrollTrigger?.kill();
      spin?.kill();
    };
  }, []);

  return (
    <div ref={root} aria-hidden="true" className="bg-emblem pointer-events-none fixed inset-0 -z-10 flex select-none items-center justify-center overflow-hidden">
      <svg
        viewBox="0 0 400 400"
        className="aspect-square w-[min(118vw,92vh)] opacity-[0.05] md:w-[min(88vmin,860px)] md:opacity-[0.07]"
        fill="none"
        stroke="url(#emblem-gold)"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <defs>
          {/* userSpaceOnUse: straight horizontal/vertical strokes have a zero-size box and would not paint otherwise */}
          <linearGradient id="emblem-gold" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="400">
            <stop offset="0" stopColor="#8C7442" />
            <stop offset="0.45" stopColor="#E4CC91" />
            <stop offset="1" stopColor="#C8A45D" />
          </linearGradient>
        </defs>

        {/* Seal rings */}
        <circle cx="200" cy="200" r="196" strokeWidth="1.2" />
        <g ref={ring}>
          {TICKS.map((t, i) => (
            <line key={i} {...t} strokeWidth={i % 6 === 0 ? 1.1 : 0.6} />
          ))}
        </g>
        <circle cx="200" cy="200" r="172" strokeWidth="0.8" />
        <circle cx="200" cy="200" r="166" strokeWidth="0.4" strokeDasharray="1 5" />

        {/* Pillar and finial */}
        <path d="M200 104V300" strokeWidth="3" />
        <path d="M200 79l6 9-6 9-6-9z" strokeWidth="1.4" />
        <circle cx="200" cy="112" r="5" strokeWidth="1.4" />

        {/* Beam */}
        <path d="M110 132Q200 114 290 132" strokeWidth="2.4" />
        <circle cx="108" cy="132" r="3.5" strokeWidth="1.4" />
        <circle cx="292" cy="132" r="3.5" strokeWidth="1.4" />

        {/* Chains */}
        <path d="M108 136L78 214M108 136L138 214" strokeWidth="1" />
        <path d="M292 136L262 214M292 136L322 214" strokeWidth="1" />

        {/* Pans */}
        <path d="M72 214h72a36 19 0 0 1-72 0z" strokeWidth="1.6" />
        <path d="M256 214h72a36 19 0 0 1-72 0z" strokeWidth="1.6" />

        {/* Stepped base */}
        <path d="M182 300h36M166 312h68M150 324h100" strokeWidth="2" />
        <path d="M188 300c0-10 4-18 12-24 8 6 12 14 12 24" strokeWidth="1.2" />
      </svg>
    </div>
  );
}
