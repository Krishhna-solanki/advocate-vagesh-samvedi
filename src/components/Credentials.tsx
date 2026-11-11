// "Professional Background & Credentials" on the homepage: one card per credential, wording passed in unchanged.

type IconName = 'practice' | 'degree' | 'diploma' | 'scales' | 'exam' | 'rights' | 'sport';

const ICONS: IconName[] = ['practice', 'degree', 'diploma', 'scales', 'exam', 'rights', 'sport'];

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, React.ReactNode> = {
    practice: (
      <>
        <rect x="3.5" y="7.5" width="17" height="12" rx="1" />
        <path d="M9 7.5V5.5h6v2M3.5 12.5h17M11 12.5v2h2v-2" />
      </>
    ),
    degree: (
      <>
        <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
        <path d="M6.5 11v4.5c0 1.4 2.5 3 5.5 3s5.5-1.6 5.5-3V11M21.5 9v5" />
      </>
    ),
    diploma: (
      <>
        <rect x="3.5" y="5" width="17" height="11" rx="1" />
        <path d="M7 9h10M7 12h6" />
        <circle cx="16.5" cy="16.5" r="2.5" />
        <path d="m15.3 18.7-.8 2.8 2-1 2 1-.8-2.8" />
      </>
    ),
    scales: (
      <>
        <path d="M12 4v16M8 20h8M5 7h14" />
        <path d="M5 7 2.5 13h5L5 7ZM19 7l-2.5 6h5L19 7Z" />
        <path d="M2.5 13a2.5 1.6 0 0 0 5 0M16.5 13a2.5 1.6 0 0 0 5 0" />
      </>
    ),
    exam: (
      <>
        <circle cx="12" cy="10" r="6" />
        <path d="m9.3 10 1.8 1.8L14.8 8M8.5 15l-1.5 5.5 5-2 5 2-1.5-5.5" />
      </>
    ),
    rights: (
      <>
        <path d="M12 3.5 5 6.5v5c0 4.3 3 7.6 7 9 4-1.4 7-4.7 7-9v-5l-7-3Z" />
        <path d="M8.5 12.5l2.3 2.3 4.7-4.8" />
      </>
    ),
    sport: (
      <>
        <circle cx="12" cy="14.5" r="5" />
        <path d="M9 3.5l3 5.5 3-5.5M9 3.5h6" />
        <path d="m12 12 .9 1.8 2 .3-1.4 1.4.3 2-1.8-.9-1.8.9.3-2-1.4-1.4 2-.3L12 12Z" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden>
      {paths[name]}
    </svg>
  );
}

export default function Credentials({ items }: { items: string[] }) {
  return (
    <section aria-labelledby="profile-heading" className="credentials-luxe relative overflow-hidden border-t border-line py-28 md:py-36">
      <div className="container relative">
        {/* Heading */}
        <div className="mx-auto max-w-3xl text-center">
          <p className="label flex items-center justify-center gap-4" data-anim="fade-up">
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
            Professional Profile
            <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
          </p>
          <h2 id="profile-heading" className="display mt-6 text-4xl sm:text-5xl lg:text-6xl" data-anim="heading" data-delay="100">
            Professional Background <span className="italic text-gold-light">&amp;</span> Credentials
          </h2>
          <div aria-hidden className="mx-auto mt-9 flex items-center justify-center gap-4">
            <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold/70" data-anim="line-x" />
            <span className="h-2 w-2 rotate-45 border border-gold" data-anim="fade-up" data-delay="300" />
            <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold/70" data-anim="line-x" />
          </div>
        </div>

        {/* Credentials: 4 + 3 on large screens, 2 per row on tablets, 1 on phones */}
        <ul data-anim="stagger" className="mt-16 flex flex-wrap justify-center gap-4 md:mt-20">
          {items.map((text, i) => (
            <li key={text} className="w-full sm:w-[calc(50%-0.5rem)] lg:w-[calc(25%-0.75rem)]">
              <div className="contact-card cred-card group h-full flex-col !items-stretch !gap-0 !p-7">
                <div className="flex items-center justify-between">
                  <span className="contact-card__icon">
                    <Icon name={ICONS[i] ?? 'practice'} />
                  </span>
                  <span className="font-serif text-sm italic text-gold/60 transition-colors duration-500 group-hover:text-gold-light">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                </div>
                <p className="mt-7 font-serif text-[1.3rem] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-light">
                  {text}
                </p>
                <span aria-hidden className="cred-card__rule mt-auto" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
