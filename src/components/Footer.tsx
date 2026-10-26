import Link from 'next/link';
import { nav, site } from '@/lib/site';
import { getArticleMetas } from '@/lib/insights';
import Monogram from './Monogram';

export default function Footer() {
  const recent = getArticleMetas().slice(0, 3);
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-line bg-[#070707]">
      <span aria-hidden data-anim="line-x" className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-gold/70 via-gold/25 to-transparent" />
      <div data-anim="stagger" className="container grid gap-14 py-20 md:grid-cols-2 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <Link href="/" className="inline-flex items-center gap-4">
            <Monogram size="lg" />
            <span className="font-serif text-2xl text-ivory">Vagesh Samvedi</span>
          </Link>
          <p className="mt-6 max-w-sm text-sm leading-7 text-muted">
            Advocate &amp; legal consultant based in {site.location.city}, {site.location.region} — advising on civil law, cyber law
            and intellectual property.
          </p>
          <div className="rule-gold mt-8" />
        </div>

        <nav aria-label="Footer" className="lg:col-span-2">
          <h2 className="label mb-6">Navigate</h2>
          <ul className="space-y-3 text-sm">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="text-ivory/75 transition-colors hover:text-gold-light">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="lg:col-span-3">
          <h2 className="label mb-6">Recent insights</h2>
          <ul className="space-y-5">
            {recent.map((a) => (
              <li key={a.slug}>
                <Link href={`/insights/${a.slug}`} className="font-serif text-lg leading-snug text-ivory/85 transition-colors hover:text-gold-light">
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/publications" className="link-gold mt-6">
            Publications <span className="arrow" aria-hidden>→</span>
          </Link>
        </div>

        <div className="lg:col-span-3">
          <h2 className="label mb-6">Contact</h2>
          <address className="space-y-3 text-sm not-italic text-ivory/75">
            <a href={`mailto:${site.email}`} className="block break-all transition-colors hover:text-gold-light">
              {site.email}
            </a>
            {site.phone && (
              <a href={site.phone.href} className="block transition-colors hover:text-gold-light">
                {site.phone.display}
              </a>
            )}
            <p>
              {site.location.city}, {site.location.region}, {site.location.country}
            </p>
          </address>
          <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            {site.profiles.map((p) => (
              <li key={p.href}>
                <a href={p.href} target="_blank" rel="noopener noreferrer" className="text-gold transition-colors hover:text-gold-light">
                  {p.label}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container py-8" data-anim="fade-up">
          <p className="max-w-4xl text-xs leading-6 text-muted/80">
            <span className="text-ivory/70">Disclaimer.</span> This website provides general professional information in accordance with
            the rules of the Bar Council of India. Articles are for information only and do not constitute legal advice on any specific
            matter. Visiting this website, reading its content or contacting the advocate through it does not by itself create an
            advocate–client relationship.
          </p>
          <div className="mt-6 flex flex-col gap-4 text-xs text-muted sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {year} {site.name}. All rights reserved.
            </p>
            <ul className="flex gap-6">
              <li>
                <Link href="/disclaimer" className="hover:text-gold-light">
                  Website Disclaimer
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-gold-light">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
