import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import { defaultShareImage, legalServiceJsonLd, personJsonLd, websiteJsonLd } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Preloader from '@/components/Preloader';
import BackgroundEmblem from '@/components/BackgroundEmblem';
import ScrollAnimations from '@/components/ScrollAnimations';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollUI from '@/components/ScrollUI';
import Magnetic from '@/components/Magnetic';
import ChatWidget from '@/components/ChatWidget';
import GoogleTranslate from '@/components/GoogleTranslate';
import { getAssistantKnowledge } from '@/lib/assistant/knowledge';

const serif = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});
const sans = Manrope({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.fullName} | ${site.role}`, template: `%s | ${site.fullName}` },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: site.shortName, locale: 'en_IN', url: '/', images: [defaultShareImage] },
  twitter: { card: 'summary_large_image', images: [defaultShareImage.url] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  category: 'Legal services',
  formatDetection: { telephone: false },
  // Paste the codes from Google Search Console / Bing Webmaster Tools into these env vars (HTML-tag method)
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION } : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { other: { 'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } } : {}),
  },
};

// Skips the preloader for repeat visits in a session; if scripts fail to
// start within 7s, reveals everything rather than leaving content hidden.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(sessionStorage.getItem('vs-preloaded')==='1')d.classList.add('preloaded')}catch(e){}
setTimeout(function(){if(!window.__vsAnimReady)d.classList.add('anim-off','preloaded')},7000)
if(/(?:^|;\\s*)googtrans=\\/en\\/hi/.test(document.cookie)){d.classList.add('gt-hi');
/* Google Translate swaps text nodes React still owns; tolerate that instead of crashing (React issue #11538) */
var N=Node.prototype,rc=N.removeChild,ib=N.insertBefore;
N.removeChild=function(c){if(c.parentNode!==this){return c}return rc.apply(this,arguments)};
N.insertBefore=function(n,r){if(r&&r.parentNode!==this){return n}return ib.apply(this,arguments)}}})()`;

export const viewport: Viewport = { themeColor: '#0B0B0B', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        {/* Animation/preloader states apply only when JS runs, so content is never hidden without it.
            First thing in <body> rather than in <head>: hosts such as Netlify inject a comment into <head>,
            which stops React from finding a script there and makes hydration fail. */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
        <BackgroundEmblem />
        <Preloader />
        <ScrollAnimations />
        <SmoothScroll />
        <Magnetic />
        <a
          href="#main"
          className="sr-only z-[100] bg-gold px-4 py-2 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <ScrollUI />
        <ChatWidget knowledge={getAssistantKnowledge()} />
        <GoogleTranslate />
        <JsonLd data={[personJsonLd(), legalServiceJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
