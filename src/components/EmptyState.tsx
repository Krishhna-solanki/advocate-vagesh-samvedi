import { site } from '@/lib/site';

// Shown in place of News / Social Life until real entries are published from the CMS.
export default function EmptyState({ title, text }: { title: string; text: string }) {
  const profiles = site.profiles.filter((p) => p.label !== 'Digital Card');
  return (
    <div data-anim="fade-up" className="relative border border-line px-6 py-16 text-center md:py-20">
      <span aria-hidden className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="font-serif text-3xl">{title}</p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">{text}</p>
      {profiles.length > 0 && (
        <p className="mt-8 flex flex-wrap justify-center gap-6">
          {profiles.map((p) => (
            <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className="link-gold">
              Follow on {p.label} <span className="arrow" aria-hidden>↗</span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          ))}
        </p>
      )}
    </div>
  );
}
