'use client';

import { useLayoutEffect, useRef } from 'react';
import { gsap, EASE, prefersReducedMotion } from '@/lib/gsap';
import { markPreloaderDone } from '@/lib/preloader-signal';

const SEEN_KEY = 'vs-preloaded';
const MIN_MS = 1600; // measured from navigation start
const MAX_MS = 3200;
const MIN_VISIBLE_MS = 1200; // counter always climbs visibly, even when hydration is slow
const NAME = 'VAGESH SAMVEDI';

// Waits for the page's real assets (images, web fonts, window load) and reports progress 0–1.
function trackLoading(onProgress: (p: number) => void) {
  const images = Array.from(document.images).filter((img) => img.loading !== 'lazy');
  const tasks: Promise<unknown>[] = [
    document.fonts?.ready ?? Promise.resolve(),
    document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => window.addEventListener('load', r, { once: true })),
    ...images.map((img) =>
      img.complete ? Promise.resolve() : new Promise((r) => (img.addEventListener('load', r, { once: true }), img.addEventListener('error', r, { once: true }))),
    ),
  ];
  let settled = 0;
  tasks.forEach((t) => t.then(() => onProgress(++settled / tasks.length)));
  return Promise.all(tasks);
}

export default function Preloader() {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = root.current!;
    const reduce = prefersReducedMotion();
    let seen = false;
    try {
      seen = sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {}

    if (seen) {
      el.style.display = 'none';
      markPreloaderDone();
      return;
    }

    document.documentElement.style.overflow = 'hidden';
    const q = gsap.utils.selector(el);

    const ctx = gsap.context(() => {
      // Reduced motion: everything simply fades in
      if (reduce) {
        gsap.set(q('.pl-draw'), { strokeDasharray: 'none', strokeDashoffset: 0 });
        gsap.set(q('.pl-char'), { yPercent: 0, y: 0, autoAlpha: 1 });
        gsap.set(q('.pl-role'), { autoAlpha: 1 });
        gsap.fromTo(q('.pl-content'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.8, ease: 'power1.out', onComplete: () => (introDone = true) });
        return;
      }
      // Intro: the emblem draws itself in gold, then the name is revealed letter by letter
      el.querySelectorAll<SVGGeometryElement>('.pl-draw').forEach((path) => {
        const len = Math.ceil(path.getTotalLength());
        gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap
        .timeline({ onComplete: () => (introDone = true) })
        .to(q('.pl-ring'), { strokeDashoffset: 0, duration: 1, ease: 'power2.inOut', stagger: 0.12 })
        .to(q('.pl-scale'), { strokeDashoffset: 0, duration: 0.55, ease: 'power2.out', stagger: 0.05 }, 0.25)
        .fromTo(q('.pl-glow'), { autoAlpha: 0, scale: 0.6 }, { autoAlpha: 1, scale: 1, duration: 1.2, ease: 'power2.out' }, 0.6)
        .fromTo(q('.pl-char'), { y: 0, yPercent: 110, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: EASE, stagger: 0.035 }, 0.5)
        .fromTo(q('.pl-role'), { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.5 }, 1.1);
    }, el);

    // Displayed progress never runs ahead of real loading, nor finishes before MIN_MS
    const countEl = el.querySelector('.pl-count')!;
    const bar = el.querySelector('.pl-bar')!;
    let real = 0;
    let shown = 0;
    let introDone = false;
    const mountedAt = performance.now();
    const tick = () => {
      const now = performance.now();
      const target = Math.min(real, now / MIN_MS, (now - mountedAt) / MIN_VISIBLE_MS, 1);
      shown += (target - shown) * 0.18;
      if (target - shown < 0.01) shown = target;
      countEl.textContent = String(Math.round(shown * 100)).padStart(3, '0');
      gsap.set(bar, { scaleX: shown });
      // Leave only once loading is complete and the name has finished revealing
      if (shown >= 1 && introDone) finish();
    };

    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      gsap.ticker.remove(tick);
      const done = () => {
        try {
          sessionStorage.setItem(SEEN_KEY, '1');
        } catch {}
        el.style.display = 'none';
      };
      ctx.add(() => {
        if (reduce) {
          gsap.to(el, {
            autoAlpha: 0,
            duration: 0.7,
            delay: 0.2,
            ease: 'power1.inOut',
            onStart: () => {
              document.documentElement.style.overflow = '';
              markPreloaderDone();
            },
            onComplete: done,
          });
          return;
        }
        gsap
          .timeline({ delay: 0.1 })
          .to(q('.pl-content'), { autoAlpha: 0, y: -24, duration: 0.4, ease: 'power2.in' })
          .to(q('.pl-footer'), { autoAlpha: 0, duration: 0.4 }, '<')
          .fromTo(q('.pl-seam'), { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power3.inOut' }, '-=0.2')
          .add(() => {
            document.documentElement.style.overflow = '';
            markPreloaderDone();
          })
          .to(q('.pl-top'), { yPercent: -100, duration: 1, ease: 'expo.inOut' })
          .to(q('.pl-bottom'), { yPercent: 100, duration: 1, ease: 'expo.inOut' }, '<')
          .to(q('.pl-seam'), { autoAlpha: 0, duration: 0.4 }, '<0.3')
          .add(done);
      });
    };

    gsap.ticker.add(tick);
    trackLoading((p) => (real = p));
    // Never hold visitors for long on a slow connection
    const cap = window.setTimeout(() => (real = 1), Math.max(0, MAX_MS - 1000 - mountedAt));

    return () => {
      window.clearTimeout(cap);
      gsap.ticker.remove(tick);
      document.documentElement.style.overflow = '';
      ctx.revert();
    };
  }, []);

  return (
    <div ref={root} className="preloader fixed inset-0 z-[200] flex-col" aria-hidden="true">
      <div className="pl-top absolute inset-x-0 top-0 h-1/2 bg-ink" />
      <div className="pl-bottom absolute inset-x-0 bottom-0 h-1/2 bg-ink" />
      <div className="pl-seam absolute inset-x-0 top-1/2 h-px origin-center scale-x-0 bg-gold" />

      <div className="pl-content relative flex flex-1 flex-col items-center justify-center px-6">
        <div className="relative">
          <div className="pl-glow pointer-events-none absolute left-1/2 top-1/2 h-56 w-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,164,93,0.22),transparent_65%)]" />
          {/* Scales of justice within a double ring */}
          <svg viewBox="0 0 120 120" className="relative h-28 w-28 text-gold sm:h-32 sm:w-32" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            <circle className="pl-draw pl-ring" cx="60" cy="60" r="57" strokeWidth="1" />
            <circle className="pl-draw pl-ring" cx="60" cy="60" r="51" strokeWidth="0.5" strokeOpacity="0.45" />
            <path className="pl-draw pl-scale" d="M60 30v58" strokeWidth="1.3" />
            <path className="pl-draw pl-scale" d="M33 41h54" strokeWidth="1.3" />
            <path className="pl-draw pl-scale" d="M60 24.5a2.6 2.6 0 1 1 0 5.2a2.6 2.6 0 1 1 0-5.2" strokeWidth="1" />
            <path className="pl-draw pl-scale" d="M37 41l-9 22M37 41l9 22" strokeWidth="0.9" />
            <path className="pl-draw pl-scale" d="M83 41l-9 22M83 41l9 22" strokeWidth="0.9" />
            <path className="pl-draw pl-scale" d="M26 63h22a11 6 0 0 1-22 0" strokeWidth="1.1" />
            <path className="pl-draw pl-scale" d="M72 63h22a11 6 0 0 1-22 0" strokeWidth="1.1" />
            <path className="pl-draw pl-scale" d="M47 92h26M52 88h16" strokeWidth="1.3" />
          </svg>
        </div>
        <p className="mt-10 flex overflow-hidden pl-[0.34em] font-serif text-[1.35rem] uppercase tracking-[0.34em] text-ivory sm:text-3xl">
          {NAME.split('').map((c, i) => (
            <span key={i} className="pl-char inline-block">
              {c === ' ' ? ' ' : c}
            </span>
          ))}
        </p>
        <p className="pl-role invisible mt-4 text-[10px] font-semibold uppercase tracking-[0.32em] text-gold">Advocate &amp; Legal Consultant</p>
      </div>

      <div className="pl-footer relative px-6 pb-10 sm:px-12">
        <div className="mb-4 flex items-end justify-between text-[10px] uppercase tracking-[0.3em] text-muted">
          <span>Indore · Madhya Pradesh</span>
          <span className="pl-count font-serif text-2xl tracking-normal text-gold-light">000</span>
        </div>
        <div className="h-px w-full bg-line">
          <div className="pl-bar h-px w-full origin-left scale-x-0 bg-gold" />
        </div>
      </div>
    </div>
  );
}
