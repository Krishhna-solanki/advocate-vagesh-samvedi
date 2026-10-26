import Link from 'next/link';
import { practiceAreas } from '@/lib/practice-areas';
import PracticeIcon from './PracticeIcon';

export default function PracticeGrid({ headingLevel = 'h3' }: { headingLevel?: 'h2' | 'h3' }) {
  const H = headingLevel;
  return (
    <ul data-anim="stagger" className="grid border-l border-t border-line sm:grid-cols-2 lg:grid-cols-3">
      {practiceAreas.map((p, i) => (
        <li key={p.slug} className="group relative border-b border-r border-line">
          <span
            aria-hidden
            className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100"
          />
          <div className="flex h-full flex-col p-8 transition-[background-color,box-shadow] duration-700 group-hover:bg-charcoal group-hover:shadow-[inset_0_0_0_1px_rgba(200,164,93,0.22),inset_0_-60px_80px_-60px_rgba(200,164,93,0.12)] md:p-10">
            <div className="flex items-start justify-between">
              <PracticeIcon name={p.icon} className="h-11 w-11 text-gold transition-[color,transform] duration-500 motion-safe:group-hover:-translate-y-1 group-hover:text-gold-light" />
              <span className="font-serif text-sm italic text-muted">{String(i + 1).padStart(2, '0')}</span>
            </div>
            <H className="mt-10 font-serif text-[1.65rem] leading-tight">
              <Link href={`/practice-areas/${p.slug}`} className="after:absolute after:inset-0">
                {p.title}
              </Link>
            </H>
            <p className="mt-4 text-sm leading-7 text-muted">{p.summary}</p>
            <span className="link-gold mt-auto pt-8" aria-hidden>
              Learn more <span className="arrow">→</span>
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
}
