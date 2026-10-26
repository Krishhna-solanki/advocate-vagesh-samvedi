type Props = {
  label: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  as?: 'h1' | 'h2';
  align?: 'left' | 'split';
  aside?: React.ReactNode;
  id?: string;
};

export default function SectionHeading({ label, title, intro, as: H = 'h2', align = 'left', aside, id }: Props) {
  return (
    <div className={align === 'split' ? 'grid gap-8 lg:grid-cols-12 lg:items-end' : ''}>
      <div className={align === 'split' ? 'lg:col-span-7' : 'max-w-3xl'}>
        <p className="label flex items-center gap-4" data-anim="fade-up">
          <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
          {label}
        </p>
        <H id={id} className="display mt-6 text-4xl sm:text-5xl lg:text-6xl" data-anim="heading" data-delay="100">
          {title}
        </H>
        {intro && align !== 'split' && (
          <p className="mt-6 max-w-2xl text-base leading-8 text-muted md:text-lg" data-anim="fade-up" data-delay="250">
            {intro}
          </p>
        )}
      </div>
      {align === 'split' && (
        <div className="lg:col-span-5 lg:pb-2" data-anim="fade-up" data-delay="250">
          {intro && <p className="text-base leading-8 text-muted">{intro}</p>}
          {aside}
        </div>
      )}
    </div>
  );
}
