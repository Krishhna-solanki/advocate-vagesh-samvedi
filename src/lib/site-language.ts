// Site-wide English/Hindi switch using Google's free Website Translator.
// The choice lives in Google's own `googtrans` cookie ("/en/hi" = Hindi), so it survives navigation and refresh.
// English is the original page: no Google script is loaded at all for English visitors.

export type SiteLang = 'en' | 'hi';

export function getSiteLang(): SiteLang {
  if (typeof document === 'undefined') return 'en';
  return /(?:^|;\s*)googtrans=\/en\/hi(?:;|$)/.test(document.cookie) ? 'hi' : 'en';
}

// Google reads the cookie on the bare host and on the parent domain; write and clear both
function writeCookie(value: string | null) {
  const host = location.hostname;
  const domains = ['', host, host.split('.').length > 2 ? `.${host.split('.').slice(-2).join('.')}` : `.${host}`];
  const base = value === null ? 'googtrans=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' : `googtrans=${value}; path=/; max-age=31536000; SameSite=Lax`;
  for (const d of new Set(domains)) document.cookie = d ? `${base}; domain=${d}` : base;
}

export function setSiteLang(lang: SiteLang) {
  if (lang === getSiteLang()) return;
  writeCookie(lang === 'hi' ? '/en/hi' : null);
  try {
    sessionStorage.setItem('vs-preloaded', '1'); // skip the intro animation on the reload
  } catch {}
  // A reload gives a clean result in both directions: Hindi loads the translator, English loads the original page
  location.reload();
}
