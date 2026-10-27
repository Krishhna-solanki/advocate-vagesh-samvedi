import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope } from 'next/font/google';
import './globals.css';
import { site } from '@/lib/site';
import { personJsonLd, websiteJsonLd } from '@/lib/seo';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JsonLd from '@/components/JsonLd';
import Preloader from '@/components/Preloader';
import BackgroundEmblem from '@/components/BackgroundEmblem';
import ScrollAnimations from '@/components/ScrollAnimations';
import SmoothScroll from '@/components/SmoothScroll';
import ScrollUI from '@/components/ScrollUI';
import Magnetic from '@/components/Magnetic';

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
  title: { default: `${site.shortName} — ${site.role}`, template: `%s | ${site.shortName}` },
  description: site.description,
  applicationName: site.shortName,
  authors: [{ name: site.name, url: site.url }],
  alternates: { canonical: '/' },
  openGraph: { type: 'website', siteName: site.shortName, locale: 'en_IN', url: '/' },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
};

// Skips the preloader for repeat visits in a session; if scripts fail to
// start within 7s, reveals everything rather than leaving content hidden.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');
try{if(sessionStorage.getItem('vs-preloaded')==='1')d.classList.add('preloaded')}catch(e){}
setTimeout(function(){if(!window.__vsAnimReady)d.classList.add('anim-off','preloaded')},7000)})()`;

export const viewport: Viewport = { themeColor: '#0B0B0B', colorScheme: 'dark' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <head>
        {/* Animation/preloader states apply only when JS runs, so content is never hidden without it */}
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
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
        <JsonLd data={[personJsonLd(), websiteJsonLd()]} />
      </body>
    </html>
  );
}
