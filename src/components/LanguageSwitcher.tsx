'use client';

import { useEffect, useState } from 'react';
import { getSiteLang, setSiteLang, type SiteLang } from '@/lib/site-language';

// EN | हिंदी switch for the header. Hindi is a Google machine translation of the English site.
export default function LanguageSwitcher({ className = '' }: { className?: string }) {
  const [lang, setLang] = useState<SiteLang>('en');
  useEffect(() => setLang(getSiteLang()), []);

  const option = (value: SiteLang, label: string, title: string) => {
    const active = lang === value;
    return (
      <button
        type="button"
        onClick={() => setSiteLang(value)}
        aria-pressed={active}
        title={title}
        lang={value}
        className={`px-2.5 py-1.5 text-[11px] font-semibold tracking-[0.12em] transition-colors duration-300 ${
          active ? 'bg-gold text-ink' : 'text-ivory/75 hover:text-gold-light'
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    // translate="no" keeps Google from translating the switch itself
    <div role="group" aria-label="Language / भाषा" translate="no" className={`notranslate inline-flex items-center border border-gold/40 ${className}`}>
      {option('en', 'EN', 'English')}
      <span aria-hidden className="h-4 w-px bg-gold/30" />
      {option('hi', 'हिंदी', 'हिंदी (Google अनुवाद)')}
    </div>
  );
}
