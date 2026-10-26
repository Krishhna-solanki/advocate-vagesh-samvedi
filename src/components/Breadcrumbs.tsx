import Link from 'next/link';

export type Crumb = { name: string; path: string };

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs uppercase tracking-[0.16em] text-muted">
        {items.map((c, i) => {
          const last = i === items.length - 1;
          return (
            <li key={c.path} className="flex items-center gap-3">
              {last ? (
                <span aria-current="page" className="line-clamp-1 max-w-[16rem] text-ivory/70 sm:max-w-md">
                  {c.name}
                </span>
              ) : (
                <>
                  <Link href={c.path} className="transition-colors hover:text-gold-light">
                    {c.name}
                  </Link>
                  <span aria-hidden className="text-gold/60">
                    /
                  </span>
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
