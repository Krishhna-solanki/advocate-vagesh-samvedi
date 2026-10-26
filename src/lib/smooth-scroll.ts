import type Lenis from 'lenis';

// Shared Lenis instance (null when smoothing is off, e.g. reduced motion) and scroll locks
// used by the preloader, mobile menu and disclaimer dialog.
let lenis: Lenis | null = null;
const locks = new Set<string>();

export const getLenis = () => lenis;

export function setLenis(instance: Lenis | null) {
  lenis = instance;
  if (lenis && locks.size) lenis.stop();
}

export function lockScroll(reason: string, locked: boolean) {
  if (locked) locks.add(reason);
  else locks.delete(reason);
  if (!lenis) return;
  if (locks.size) lenis.stop();
  else lenis.start();
}

const HEADER_OFFSET = 110;

/** Scrolls to an element (smoothly when Lenis is active) and moves keyboard focus to it. */
export function scrollToElement(el: HTMLElement, { focus = true } = {}) {
  const done = () => {
    if (!focus) return;
    if (!el.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) el.setAttribute('tabindex', '-1');
    el.focus({ preventScroll: true });
  };
  // Lenis already honours an element's scroll-margin-top; only add the header offset when there is none
  const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  if (lenis) lenis.scrollTo(el, { offset: margin ? 0 : -HEADER_OFFSET, duration: 1.2, onComplete: done });
  else {
    el.scrollIntoView({ block: 'start' });
    done();
  }
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { duration: 1.4 });
  else window.scrollTo(0, 0);
}
