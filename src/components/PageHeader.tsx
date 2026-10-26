import Breadcrumbs, { type Crumb } from './Breadcrumbs';

export default function PageHeader({
  label,
  title,
  intro,
  crumbs,
}: {
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  crumbs?: Crumb[];
}) {
  return (
    <section className="texture-columns relative isolate overflow-hidden border-b border-line pb-16 pt-36 md:pb-24 md:pt-44">
      <div aria-hidden className="absolute inset-0 -z-10" data-speed="0.3">
        <div className="absolute right-[8%] top-0 h-full w-px bg-gradient-to-b from-gold/30 via-gold/5 to-transparent" />
      </div>
      <div className="container">
        {crumbs && (
          <div data-anim="fade-up">
            <Breadcrumbs items={crumbs} />
          </div>
        )}
        <p className="label mt-8 flex items-center gap-4" data-anim="fade-up" data-delay="100">
          <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="250" />
          {label}
        </p>
        <h1 className="display mt-6 max-w-4xl text-5xl sm:text-6xl lg:text-7xl" data-anim="heading" data-delay="150">
          {title}
        </h1>
        {intro && (
          <p className="mt-8 max-w-2xl text-base leading-8 text-muted md:text-lg" data-anim="fade-up" data-delay="450">
            {intro}
          </p>
        )}
      </div>
    </section>
  );
}
