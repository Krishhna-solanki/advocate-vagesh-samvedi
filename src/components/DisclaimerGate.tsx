'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap, prefersReducedMotion } from '@/lib/gsap';
import { whenPreloaderDone } from '@/lib/preloader-signal';
import { lockScroll } from '@/lib/smooth-scroll';

const KEY = 'vs-disclaimer-accepted-v1';

// Entry acknowledgement commonly used on Indian advocates' websites under Rule 36 of the
// Bar Council of India Rules (no solicitation or advertising).
export default function DisclaimerGate() {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    let accepted = false;
    try {
      accepted = localStorage.getItem(KEY) === 'yes';
    } catch {}
    if (accepted || location.pathname.startsWith('/disclaimer')) return;
    return whenPreloaderDone(() => {
      const dialog = ref.current;
      if (!dialog || dialog.open) return;
      dialog.showModal();
      lockScroll('disclaimer', true);
      gsap.fromTo(dialog, { autoAlpha: 0, y: prefersReducedMotion() ? 0 : 30 }, { autoAlpha: 1, y: 0, duration: 0.9, ease: 'expo.out', delay: 0.9 });
    });
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(KEY, 'yes');
    } catch {}
    ref.current?.close();
  };

  return (
    <dialog
      ref={ref}
      aria-labelledby="disclaimer-title"
      onCancel={(e) => e.preventDefault()}
      onClose={() => lockScroll('disclaimer', false)}
      className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl overflow-y-auto border border-gold/40 bg-charcoal p-0 text-ivory shadow-2xl"
    >
      <div className="p-7 sm:p-10">
        <p className="label">Before you proceed</p>
        <h2 id="disclaimer-title" className="mt-4 font-serif text-3xl">
          Disclaimer
        </h2>
        <div className="rule-gold mt-6" />
        <div className="mt-6 space-y-4 text-sm leading-7 text-ivory/80">
          <p>
            The Bar Council of India does not permit advocates to solicit work or advertise. By clicking “I Agree”, you acknowledge
            that:
          </p>
          <ul className="list-disc space-y-2 pl-5 marker:text-gold">
            <li>you are seeking information about Advocate Vagesh Samvedi of your own accord;</li>
            <li>there has been no advertisement, solicitation, invitation or inducement of any sort;</li>
            <li>the information on this website is general in nature and is not legal advice;</li>
            <li>using this website does not create an advocate–client relationship.</li>
          </ul>
        </div>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <button type="button" onClick={accept} className="btn-gold" autoFocus>
            I Agree
          </button>
          <Link href="/disclaimer" onClick={() => ref.current?.close()} className="btn-outline">
            Read full disclaimer
          </Link>
        </div>
      </div>
    </dialog>
  );
}
