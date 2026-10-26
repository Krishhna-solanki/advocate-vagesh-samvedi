'use client';

import { useEffect } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';

const STRENGTH = 0.28;

// Primary CTAs marked data-magnetic drift gently toward the pointer. Desktop mice only.
export default function Magnetic() {
  useEffect(() => {
    if (prefersReducedMotion() || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    let active: HTMLElement | null = null;
    let moveX: gsap.QuickToFunc | null = null;
    let moveY: gsap.QuickToFunc | null = null;

    const release = () => {
      if (active) gsap.to(active, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' });
      active = moveX = moveY = null;
    };

    const onMove = (e: PointerEvent) => {
      const el = (e.target as Element).closest?.('[data-magnetic]') as HTMLElement | null;
      if (el !== active) {
        release();
        if (!el) return;
        active = el;
        moveX = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
        moveY = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      }
      if (!active || !moveX || !moveY) return;
      const r = active.getBoundingClientRect();
      moveX((e.clientX - (r.left + r.width / 2)) * STRENGTH);
      moveY((e.clientY - (r.top + r.height / 2)) * STRENGTH);
    };

    document.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', release);
    return () => {
      document.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', release);
    };
  }, []);

  return null;
}
