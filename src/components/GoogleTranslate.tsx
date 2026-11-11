'use client';

import { useEffect } from 'react';
import { getSiteLang } from '@/lib/site-language';

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: { translate?: { TranslateElement: new (opts: object, id: string) => unknown } };
  }
}

/**
 * Loads Google's free Website Translator only when the visitor has chosen Hindi. It translates the page and keeps
 * translating content that appears later (page changes, News/Blog/Social lists, menus) as Google's script watches
 * the page. Google's own toolbar is hidden in CSS; the header switch replaces it.
 */
export default function GoogleTranslate() {
  useEffect(() => {
    if (getSiteLang() !== 'hi' || document.getElementById('google-translate-script')) return;
    document.documentElement.classList.add('gt-hi');
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate) return;
      new window.google.translate.TranslateElement({ pageLanguage: 'en', includedLanguages: 'en,hi', autoDisplay: false }, 'google_translate_element');
    };
    const s = document.createElement('script');
    s.id = 'google-translate-script';
    s.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    s.async = true;
    document.body.appendChild(s);
  }, []);

  return <div id="google_translate_element" aria-hidden className="hidden" />;
}
