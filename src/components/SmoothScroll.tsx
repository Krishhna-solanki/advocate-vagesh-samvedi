'use client';

import Lenis from 'lenis';
import { useEffect } from 'react';
import { gsap, ScrollTrigger, prefersReducedMotion } from '@/lib/gsap';
import { whenPreloaderDone } from '@/lib/preloader-signal';
import { lockScroll, scrollToElement, setLenis } from '@/lib/smooth-scroll';

export default function SmoothScroll() {
  // Keep ScrollTrigger positions correct as fonts, images and late content change the layout
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
    let timer = 0;
    const refresh = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    };
    document.fonts?.ready.then(refresh);
    window.addEventListener('load', refresh);
    let lastHeight = document.body.scrollHeight;
    const ro = new ResizeObserver(() => {
      const h = document.body.scrollHeight;
      if (Math.abs(h - lastHeight) > 2) {
        lastHeight = h;
        refresh();
      }
    });
    ro.observe(document.body);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('load', refresh);
      ro.disconnect();
    };
  }, []);

  // Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const lenis = new Lenis({
      lerp: 0.1,
      wheelMultiplier: 0.9,
      stopInertiaOnNavigate: true,
      // Let scrollable overlays scroll natively
      prevent: (node) => Boolean(node.closest?.('dialog, #mobile-menu, [data-lenis-prevent]')),
    });
    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    setLenis(lenis);

    lockScroll('preloader', true);
    const cancel = whenPreloaderDone(() => lockScroll('preloader', false));

    return () => {
      cancel();
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // Same-page anchor links (table of contents, skip link): smooth scroll, focus target, update history
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element).closest?.('a[href*="#"]') as HTMLAnchorElement | null;
      if (!a || a.target === '_blank') return;
      const url = new URL(a.href, location.href);
      if (url.pathname !== location.pathname || url.search !== location.search || !url.hash) return;
      const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
      if (!target) return;
      e.preventDefault();
      if (location.hash !== url.hash) history.pushState(history.state, '', url.hash);
      // Next frame: Lenis's own click handler (stopInertiaOnNavigate) would otherwise cancel this scroll
      requestAnimationFrame(() => scrollToElement(target));
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
