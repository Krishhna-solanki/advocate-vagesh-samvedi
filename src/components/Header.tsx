'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { nav, site } from '@/lib/site';
import Monogram from './Monogram';
import { gsap, ScrollTrigger, EASE, prefersReducedMotion } from '@/lib/gsap';
import { whenPreloaderDone } from '@/lib/preloader-signal';
import { lockScroll } from '@/lib/smooth-scroll';

const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement>(null);
  const openRef = useRef(open);
  openRef.current = open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Entrance after the preloader, then hide on scroll down / reveal on scroll up
  useEffect(() => {
    const header = headerRef.current!;
    const reduce = prefersReducedMotion();

    const cancel = whenPreloaderDone(() => {
      gsap.fromTo(
        header.querySelectorAll('[data-header-item]'),
        { autoAlpha: 0, y: reduce ? 0 : -14 },
        { autoAlpha: 1, y: 0, duration: 1, ease: EASE, stagger: 0.07, delay: 0.5, clearProps: 'transform' },
      );
    });
    // Sliding the header away is motion; reduced-motion visitors keep it fixed
    if (reduce) return cancel;

    const show = () => gsap.to(header, { yPercent: 0, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
    const trigger = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        // Keep it visible while the menu is open or a keyboard user is inside it
        if (openRef.current || header.contains(document.activeElement)) return show();
        if (self.direction === 1 && self.scroll() > 240) {
          gsap.to(header, { yPercent: -100, duration: 0.45, ease: 'power3.out', overwrite: 'auto' });
        } else show();
      },
    });
    header.addEventListener('focusin', show);
    return () => {
      cancel();
      trigger.kill();
      header.removeEventListener('focusin', show);
    };
  }, []);

  // Wipes the menu closed, then unmounts it
  const closeMenu = () => {
    const panel = panelRef.current;
    if (!panel || panel.hidden) return setOpen(false);
    const reduce = prefersReducedMotion();
    gsap.to(panel, {
      clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)',
      autoAlpha: reduce ? 0 : 1,
      duration: reduce ? 0.3 : 0.55,
      ease: 'expo.inOut',
      overwrite: true,
      onComplete: () => setOpen(false),
    });
  };

  useEffect(() => {
    setOpen(false);
    if (headerRef.current) gsap.set(headerRef.current, { yPercent: 0 });
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    lockScroll('menu', true);
    const panel = panelRef.current;
    panel?.querySelector<HTMLElement>('a')?.focus();
    if (panel) {
      const reduce = prefersReducedMotion();
      gsap.fromTo(
        panel,
        { clipPath: reduce ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', autoAlpha: reduce ? 0 : 1 },
        { clipPath: 'inset(0% 0% 0% 0%)', autoAlpha: 1, duration: reduce ? 0.4 : 0.7, ease: 'expo.out' },
      );
      gsap.fromTo(
        panel.querySelectorAll('li, [data-menu-meta]'),
        { autoAlpha: 0, y: reduce ? 0 : 32 },
        { autoAlpha: 1, y: 0, duration: 0.8, ease: EASE, stagger: 0.06, delay: reduce ? 0 : 0.15 },
      );
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        toggleRef.current?.focus();
      }
      // Keep focus inside the open menu
      if (e.key === 'Tab' && panel) {
        const items = [toggleRef.current, ...panel.querySelectorAll<HTMLElement>('a')].filter(Boolean) as HTMLElement[];
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = '';
      lockScroll('menu', false);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      ref={headerRef}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid ? 'border-b border-line bg-ink/95 backdrop-blur-md' : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="container flex h-20 items-center justify-between gap-6">
        <Link href="/" data-header-item className="group flex items-center gap-3.5" aria-label={`${site.shortName} — home`}>
          <Monogram />
          <span className="flex flex-col leading-none">
            <span className="font-sans text-[12px] font-semibold uppercase tracking-[0.2em] text-ivory sm:text-[13px]">
              Adv. Vagesh Samvedi
            </span>
            <span className="mt-1.5 hidden text-[10px] uppercase tracking-[0.24em] text-muted sm:block">{site.role}</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.slice(0, -1).map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href} data-header-item>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className={`relative py-2 text-[13px] tracking-[0.04em] transition-colors after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:bg-gold after:transition-transform after:duration-500 ${
                      active ? 'text-gold-light after:scale-x-100' : 'text-ivory/80 after:scale-x-0 hover:text-ivory hover:after:scale-x-100'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li data-header-item>
              <Link href="/contact" data-magnetic className="btn-outline px-5 py-2.5" aria-current={isActive(pathname, '/contact') ? 'page' : undefined}>
                Get in Touch
              </Link>
            </li>
          </ul>
        </nav>

        <button
          ref={toggleRef}
          data-header-item
          type="button"
          className="relative -mr-2 flex h-11 w-11 items-center justify-center lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => (open ? closeMenu() : setOpen(true))}
        >
          <span className="relative block h-3 w-6">
            <span className={`absolute left-0 h-px w-6 bg-gold transition-all duration-300 ${open ? 'top-1.5 rotate-45' : 'top-0'}`} />
            <span className={`absolute left-0 h-px bg-gold transition-all duration-300 ${open ? 'top-1.5 w-6 -rotate-45' : 'top-3 w-4'}`} />
          </span>
        </button>
      </div>

      <div
        id="mobile-menu"
        ref={panelRef}
        hidden={!open}
        className="h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-ink lg:hidden"
      >
        <nav aria-label="Mobile" className="container flex min-h-full flex-col justify-between py-10">
          <ul className="space-y-1">
            {nav.map((item, i) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? 'page' : undefined}
                    className="flex items-baseline gap-5 border-b border-line py-4"
                  >
                    <span className="w-6 font-sans text-[11px] tracking-[0.2em] text-gold/70">{String(i + 1).padStart(2, '0')}</span>
                    <span className={`font-serif text-3xl ${active ? 'text-gold-light' : 'text-ivory'}`}>{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <div data-menu-meta className="mt-10 space-y-2 text-sm text-muted">
            <a href={`mailto:${site.email}`} className="block hover:text-gold-light">
              {site.email}
            </a>
            <p>
              {site.location.city}, {site.location.region}
            </p>
          </div>
        </nav>
      </div>
    </header>
  );
}
