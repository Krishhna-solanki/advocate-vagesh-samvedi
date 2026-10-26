'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useLayoutEffect } from 'react';
import { gsap, ScrollTrigger, SplitText, EASE, prefersReducedMotion } from '@/lib/gsap';
import { whenPreloaderDone } from '@/lib/preloader-signal';

/*
 * Declarative GSAP animations, driven by data attributes so server components stay server components:
 *
 *   data-anim="fade-up"      fade and rise into view            (data-delay="ms" optional)
 *   data-anim="heading"      line-by-line masked reveal (SplitText)
 *   data-anim="stagger"      children rise in one after another
 *   data-anim="children"     each child rises as it scrolls into view (long text)
 *   data-anim="image"        clip-path wipe with the image settling from a zoom
 *   data-anim="line-x|line-y" gold rule draws across / down
 *   data-anim="scrub-words"  words brighten as the reader scrolls
 *   data-anim="progress"     reading-progress bar scrubbed to the page
 *   data-speed="0.2"         gentle parallax
 *   data-hero …              homepage hero intro timeline
 *
 * Initial hidden states live in globals.css (only under html.js, and never with reduced motion).
 */

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

const delayOf = (el: Element) => Number((el as HTMLElement).dataset.delay ?? 0) / 1000;
// Per-route state: everything is reverted and rebuilt on navigation.
let ctx: gsap.Context | null = null;
let ready = false;
let splits: SplitText[] = [];
let processed: HTMLElement[] = [];

// Elements under root that have not been animated yet (marks them as taken).
function fresh(root: ParentNode, sel: string) {
  return Array.from(root.querySelectorAll<HTMLElement>(sel)).filter((el) => {
    if (el.dataset.animInit) return false;
    el.dataset.animInit = '1';
    processed.push(el);
    return true;
  });
}

// Scroll-scrubbed parallax and ambient loops are skipped on small/touch screens to save battery
const isDesktop = () => window.matchMedia('(min-width: 768px) and (hover: hover)').matches;

const onEnter = (el: Element, start = 'top 88%') => ({ trigger: el, start, once: true });

function heroIntro(hero: HTMLElement) {
  const q = gsap.utils.selector(hero);
  const title = q('[data-hero-title]')[0];

  const tl = gsap.timeline({ defaults: { ease: EASE } });
  tl.fromTo(q('[data-hero-media]'), { clipPath: 'inset(0% 0% 0% 100%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.inOut' }, 0)
    .fromTo(q('[data-hero-media] img'), { scale: 1.25 }, { scale: 1, duration: 2.6 }, 0)
    .fromTo(q('[data-hero-line]'), { autoAlpha: 1, scaleY: 0, transformOrigin: 'top center' }, { scaleY: 1, duration: 1.8, ease: 'expo.inOut' }, 0.2)
    .fromTo(q('[data-hero-label]'), { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 1.1 }, 0.5);

  // Headline: word by word, each rising from behind its own mask
  if (title) {
    gsap.set(title, { autoAlpha: 1 });
    const split = SplitText.create(title, { type: 'words', mask: 'words', wordsClass: 'split-word' });
    splits.push(split);
    tl.from(split.words, { yPercent: 115, rotate: 2, duration: 1.3, stagger: 0.075 }, 0.6);
  }

  tl.fromTo(q('[data-hero-text]'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.2 }, 1.0)
    .fromTo(q('[data-hero-cta] > *'), { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.1 }, 1.15)
    .fromTo(q('[data-hero-meta]'), { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.2 }, 1.6)
    .fromTo(q('[data-hero-glow]'), { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 2.4, ease: 'power2.out', stagger: 0.3 }, 0.4)
    .fromTo(q('[data-hero-sheen]'), { xPercent: 0, opacity: 0 }, { xPercent: 520, opacity: 1, duration: 1.8, ease: 'power2.inOut' }, 1.5)
    .set(q('[data-hero-sheen]'), { opacity: 0 });

  // Desktop only: slow drift of the gold light, paused whenever the hero is off-screen
  if (isDesktop()) {
    const drift = gsap.timeline({ repeat: -1, yoyo: true, defaults: { ease: 'sine.inOut', duration: 9 } });
    drift.to(q('[data-hero-glow]')[0], { xPercent: 12, yPercent: -8 }, 0).to(q('[data-hero-glow]')[1], { xPercent: -10, yPercent: 6 }, 0);
    ScrollTrigger.create({ trigger: hero, start: 'top top', end: 'bottom top', onToggle: (self) => (self.isActive ? drift.play() : drift.pause()) });
    gsap.to(q('[data-hero-columns]'), { xPercent: -4, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
  }

  // Scrolling away: portrait drifts down, copy lifts and fades
  const scrub = { trigger: hero, start: 'top top', end: 'bottom top', scrub: true };
  gsap.to(q('[data-hero-parallax]'), { yPercent: 14, ease: 'none', scrollTrigger: scrub });
  gsap.to(q('[data-hero-content]'), { yPercent: -16, opacity: 0.15, ease: 'none', scrollTrigger: { ...scrub } });
}

// Reduced-motion version: the same reveals as opacity fades only — nothing moves, scales or scrubs.
function setupGentle(root: ParentNode) {
  const all = (sel: string) => fresh(root, sel);
  const fade = { autoAlpha: 1, duration: 0.9, ease: 'power1.out' };

  const [hero] = all('[data-hero]');
  if (hero) {
    const q = gsap.utils.selector(hero);
    gsap
      .timeline()
      .fromTo(q('[data-hero-media]'), { autoAlpha: 0 }, { ...fade, duration: 1.4 }, 0)
      .fromTo(q('[data-hero-line], [data-hero-label]'), { autoAlpha: 0 }, fade, 0.2)
      .fromTo(q('[data-hero-title]'), { autoAlpha: 0 }, { ...fade, duration: 1.2 }, 0.4)
      .fromTo(q('[data-hero-text]'), { autoAlpha: 0 }, fade, 0.7)
      .fromTo(q('[data-hero-cta] > *'), { autoAlpha: 0 }, { ...fade, stagger: 0.1 }, 0.9)
      .fromTo(q('[data-hero-meta]'), { autoAlpha: 0 }, fade, 1.1)
      .fromTo(q('[data-hero-glow]'), { autoAlpha: 0 }, { ...fade, duration: 2 }, 0.3);
  }

  all('[data-anim="fade-up"], [data-anim="heading"], [data-anim="image"], [data-anim="line-x"], [data-anim="line-y"], [data-anim="scrub-words"]').forEach(
    (el) => gsap.fromTo(el, { autoAlpha: 0 }, { ...fade, delay: delayOf(el), scrollTrigger: onEnter(el, 'top 92%') }),
  );
  all('[data-anim="stagger"]').forEach((el) =>
    gsap.fromTo(el.children, { autoAlpha: 0 }, { ...fade, stagger: 0.1, delay: delayOf(el), scrollTrigger: onEnter(el, 'top 90%') }),
  );
  all('[data-anim="children"]').forEach((el) =>
    ScrollTrigger.batch(Array.from(el.children), {
      start: 'top 95%',
      once: true,
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0 }, { ...fade, stagger: 0.06, overwrite: true }),
    }),
  );
  all('[data-anim="progress"]').forEach((el) => {
    const target = el.dataset.target ? document.querySelector(el.dataset.target) : document.body;
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: target, start: 'top top', end: 'bottom bottom', scrub: true } });
  });
}

function setup(root: ParentNode) {
  if (prefersReducedMotion()) return setupGentle(root);
  const all = (sel: string) => fresh(root, sel);

  const [hero] = all('[data-hero]');
  if (hero) heroIntro(hero);

  all('[data-anim="fade-up"]').forEach((el) =>
    gsap.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 1.2, ease: EASE, delay: delayOf(el), scrollTrigger: onEnter(el) }),
  );

  all('[data-anim="stagger"]').forEach((el) =>
    gsap.fromTo(
      el.children,
      { autoAlpha: 0, y: 50 },
      { autoAlpha: 1, y: 0, duration: 1.1, ease: EASE, stagger: 0.12, delay: delayOf(el), scrollTrigger: onEnter(el, 'top 85%') },
    ),
  );

  // Long content: each child animates as it reaches the viewport
  all('[data-anim="children"]').forEach((el) =>
    ScrollTrigger.batch(Array.from(el.children), {
      start: 'top 92%',
      once: true,
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.08, overwrite: true }),
    }),
  );

  all('[data-anim="heading"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    splits.push(
      SplitText.create(el, {
        type: 'lines',
        linesClass: 'split-line',
        mask: 'lines',
        autoSplit: true,
        onSplit: (self) =>
          gsap.from(self.lines, { yPercent: 110, duration: 1.3, ease: EASE, stagger: 0.1, delay: delayOf(el), scrollTrigger: onEnter(el) }),
      }),
    );
  });

  all('[data-anim="image"]').forEach((el) => {
    const tl = gsap.timeline({ delay: delayOf(el), scrollTrigger: onEnter(el, 'top 85%') });
    tl.fromTo(el, { autoAlpha: 1, clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut' });
    const img = el.querySelector('img');
    if (img) tl.fromTo(img, { scale: 1.25 }, { scale: 1, duration: 2, ease: EASE }, 0);
  });

  all('[data-anim="line-x"]').forEach((el) =>
    gsap.fromTo(
      el,
      { autoAlpha: 1, scaleX: 0, transformOrigin: 'left center' },
      { scaleX: 1, duration: 1.4, ease: 'expo.inOut', delay: delayOf(el), scrollTrigger: onEnter(el, 'top 95%') },
    ),
  );
  all('[data-anim="line-y"]').forEach((el) =>
    gsap.fromTo(
      el,
      { autoAlpha: 1, scaleY: 0, transformOrigin: 'top center' },
      { scaleY: 1, duration: 1.4, ease: 'expo.inOut', delay: delayOf(el), scrollTrigger: onEnter(el, 'top 90%') },
    ),
  );

  all('[data-anim="scrub-words"]').forEach((el) => {
    gsap.set(el, { autoAlpha: 1 });
    const split = SplitText.create(el, { type: 'words' });
    splits.push(split);
    gsap.fromTo(
      split.words,
      { opacity: 0.14 },
      { opacity: 1, stagger: 0.1, ease: 'none', scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 0.6 } },
    );
  });

  all('[data-anim="progress"]').forEach((el) => {
    const target = el.dataset.target ? document.querySelector(el.dataset.target) : document.body;
    gsap.fromTo(el, { scaleX: 0 }, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: target, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });
  });

  if (isDesktop()) all('[data-speed]').forEach((el) => {
    const speed = Number(el.dataset.speed) || 0.15;
    gsap.fromTo(
      el,
      { yPercent: -speed * 50 },
      { yPercent: speed * 50, ease: 'none', scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } },
    );
  });
}

/** Animates [data-anim] content that mounted after the page was set up (e.g. client-rendered lists). */
export function animateNew(root: ParentNode) {
  if (!ready || !ctx) return; // picked up by the full setup once the preloader finishes
  ctx.add(() => setup(root));
  ScrollTrigger.refresh();
}

export default function ScrollAnimations() {
  const pathname = usePathname();

  useEffect(() => {
    (window as Window & { __vsAnimReady?: boolean }).__vsAnimReady = true;
  }, []);

  useIsoLayoutEffect(() => {
    ctx = gsap.context(() => {});
    const cancel = whenPreloaderDone(() => {
      try {
        ready = true;
        ctx?.add(() => setup(document));
        requestAnimationFrame(() => ScrollTrigger.refresh());
      } catch (err) {
        console.error('[animations]', err);
        document.documentElement.classList.add('anim-off');
      }
    });

    return () => {
      cancel();
      ready = false;
      ctx?.revert();
      ctx = null;
      splits.forEach((s) => s.revert());
      splits = [];
      processed.forEach((el) => delete el.dataset.animInit);
      processed = [];
    };
  }, [pathname]);

  return null;
}
