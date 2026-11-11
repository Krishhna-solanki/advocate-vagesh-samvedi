import PageHeader from '@/components/PageHeader';
import SocialGallery from '@/components/SocialGallery';
import EmptyState from '@/components/EmptyState';
import JsonLd from '@/components/JsonLd';
import Reveal from '@/components/Reveal';
import { getSocialPosts } from '@/lib/social';
import { socialProfiles } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Beyond the Courtroom | Advocate Vagesh Samvedi',
  description: 'Explore human rights engagement, humanitarian activities, sports initiatives and community participation.',
  path: '/social',
});

const themes = [
  {
    title: 'Human Rights & Social Awareness',
    paragraphs: [
      'Engagement with human rights involves an understanding of individual dignity, equality, legal protections and the importance of awareness within society.',
      'Through organisational responsibilities and participation in community initiatives, the focus remains on encouraging awareness of rights, social responsibility and the importance of accessible legal knowledge.',
    ],
  },
  {
    title: 'Humanitarian Initiatives & Community Assistance',
    paragraphs: [
      'Community participation also finds expression through activities involving humanitarian assistance, healthcare-related engagement and support for local welfare initiatives.',
      'Documented activities, including hospital visits and community assistance programmes, are presented as part of this continuing engagement with society.',
    ],
  },
  {
    title: 'Education, Children & Community Development',
    paragraphs: [
      'Participation in educational and community-oriented initiatives reflects an interest in the well-being and development of younger generations.',
      'Activities involving Van Kanya Ashram and other community programmes form part of the documented social initiatives featured on this page.',
    ],
  },
  {
    title: 'Sports Administration & Youth Engagement',
    paragraphs: [
      'Sports provide opportunities for discipline, participation, teamwork and personal development.',
      'Through his organisational responsibility as Secretary of the Boxing Association, Jhabua, and participation in community sports activities, Advocate Vagesh Samvedi remains engaged with initiatives relating to sports administration and youth participation.',
      'Activities involving Kabaddi, Kho-Kho, boxing and National Sports Day may be documented through the photographs and event records presented here.',
    ],
  },
];

export default function SocialPage() {
  const posts = getSocialPosts();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Beyond the Courtroom', path: '/social' },
  ];

  return (
    <>
      <PageHeader
        label="Social Journey"
        title={
          <>
            Beyond the <span className="italic text-gold-light">Courtroom</span>
          </>
        }
        intro="A Commitment to Human Dignity, Community Engagement and Social Responsibility."
        crumbs={crumbs}
      />

      {/* Introduction */}
      <section className="container py-16 md:py-24">
        <Reveal variant="stagger" className="mx-auto max-w-3xl space-y-6 text-lg leading-9 text-ivory/80">
          <p className="font-serif text-2xl leading-snug text-ivory md:text-[1.9rem]">
            The responsibilities of a professional extend beyond the boundaries of their chosen occupation. Engagement with society,
            awareness of individual rights and participation in community initiatives form an important dimension of public responsibility.
          </p>
          <p>
            Advocate Vagesh Samvedi’s involvement in social and organisational activities reflects an interest in human rights, equality,
            humanitarian assistance, sports and community development.
          </p>
          <p>
            Through his association with the Judicial Human Rights Council, Jhabua, and the Boxing Association, Jhabua, he participates in
            organisational responsibilities and initiatives connected with social awareness and community engagement.
          </p>
          <p>This section documents selected activities, events and initiatives that reflect this dimension of his public and professional journey.</p>
        </Reveal>
      </section>

      {/* Themes */}
      <section aria-label="Areas of engagement" className="border-t border-line bg-charcoal/40 py-20 md:py-28">
        <Reveal variant="stagger" className="container grid gap-5 md:grid-cols-2">
          {themes.map((t, i) => (
            <article key={t.title} className="contact-card group flex-col !gap-0 !p-7 md:!p-9">
              <span className="font-serif text-sm italic text-muted">{String(i + 1).padStart(2, '0')}</span>
              <h2 className="mt-4 font-serif text-[1.65rem] leading-tight text-ivory transition-colors duration-500 group-hover:text-gold-light">
                {t.title}
              </h2>
              <div className="mt-5 space-y-4 text-[15px] leading-7 text-muted">
                {t.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      {/* Gallery */}
      <section aria-label="Photographs and posts" className="container py-16 md:py-24">
        {posts.length > 0 ? (
          <>
            <SocialGallery posts={posts} />
            {socialProfiles.length > 0 && (
              <div data-anim="fade-up" className="mt-14 flex flex-wrap items-center justify-center gap-6 border-t border-line pt-10">
                <span className="label text-muted">Follow</span>
                <SocialLinks variant="labelled" />
              </div>
            )}
          </>
        ) : (
          <EmptyState title="Gallery coming soon" text="Photographs and posts from events and professional activities will appear here." />
        )}
      </section>

      {/* Closing statement */}
      <section aria-label="Closing statement" className="border-t border-line py-20 md:py-28">
        <div className="container">
          <p data-anim="fade-up" className="mx-auto max-w-4xl text-center font-serif text-2xl leading-snug text-gold-light md:text-[2.1rem]">
            A meaningful professional journey is shaped not only by the work performed within professional institutions, but also by the
            responsibility one demonstrates towards society. Engagement with human dignity, community welfare and public awareness remains
            an important part of this broader perspective.
          </p>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
