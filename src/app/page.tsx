import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import PracticeGrid from '@/components/PracticeGrid';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleCard from '@/components/ArticleCard';
import ContactSection from '@/components/ContactSection';
import OfficeLocations from '@/components/OfficeLocations';
import Reveal from '@/components/Reveal';
import Credentials from '@/components/Credentials';
import { getArticleMetas, getFeatured } from '@/lib/insights';
import { getNewsMetas } from '@/lib/news';
import { getHomepageSocial, getSocialPosts } from '@/lib/social';
import { NewsLead, NewsRow } from '@/components/NewsItems';
import SocialGallery from '@/components/SocialGallery';
import DigitalCardBanner from '@/components/DigitalCardBanner';
import EmptyState from '@/components/EmptyState';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Advocate Vagesh Samvedi | Lawyer in Petlawad, Jhabua & Indore',
  description:
    'Advocate Vagesh Samvedi, lawyer in Petlawad (Jhabua) and Indore — civil, criminal, property, family, cyber and IP law matters across Madhya Pradesh and Gujarat.',
  path: '/',
});

const highlights = [
  'Independent legal practice since 2025.',
  'B.A. LL.B. (Hons.), completed in 2025.',
  'LL.M. in Intellectual Property Rights, completed.',
  'Enrolled with the State Bar Council of Madhya Pradesh.',
  'Successfully qualified the All India Bar Examination (AIBE) in 2025.',
  'District President, Judicial Human Rights Council, Jhabua.',
  'Secretary, Boxing Association, Jhabua.',
];

export default function HomePage() {
  const featured = getFeatured();
  const recent = getArticleMetas()
    .filter((a) => a.slug !== featured?.slug)
    .slice(0, 3);
  const news = getNewsMetas();
  // A real featured item outranks the dev-only sample drafts
  const leadNews = news.find((n) => n.featured && !n.draft) ?? news.find((n) => n.featured) ?? news[0];
  const moreNews = news.filter((n) => n !== leadNews).slice(0, 4);
  // Real posts first, so dev-only sample drafts never push them off the homepage
  // Latest 4 posts, including the 2 most recent reels; the rest stay on /social
  const social = getHomepageSocial(4, 2);
  const socialTotal = getSocialPosts().filter((p) => !p.draft).length;

  return (
    <>
      <Hero />

      {/* About */}
      <section aria-labelledby="about-heading" className="relative py-28 md:py-36">
        <div className="container grid items-start gap-14 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-20">
          {/* Portrait: natural flow on phones and tablets, pinned beside the text on desktop */}
          <div className="relative lg:sticky lg:top-28 lg:col-span-6">
            <Reveal
              variant="image"
              className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/6] lg:aspect-auto lg:h-[min(80vh,46rem)]"
            >
              <Image
                src="/images/about-portrait.jpg"
                alt="Advocate Vagesh Samvedi reading a law book in his chamber, with law reports on the shelves behind him"
                fill
                sizes="(min-width: 1024px) 46vw, 92vw"
                className="object-cover object-[48%_45%] grayscale-[25%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/5 to-transparent" />
              <div aria-hidden className="pointer-events-none absolute inset-3 border border-gold/20" />
            </Reveal>
            <div aria-hidden className="absolute -bottom-5 -right-5 hidden h-36 w-36 md:block">
              <span className="absolute bottom-0 right-0 h-px w-full bg-gold/50" data-anim="line-x" data-delay="600" />
              <span className="absolute bottom-0 right-0 h-full w-px bg-gold/50" data-anim="line-y" data-delay="600" />
            </div>
            <div aria-hidden className="absolute -left-5 -top-5 hidden h-24 w-24 border-l border-t border-gold/40 md:block" />
          </div>

          <div className="lg:col-span-6 lg:py-6">
            <SectionHeading
              id="about-heading"
              label="About"
              title={
                <>
                  A Legal Practice Shaped by <span className="italic text-gold-light">Knowledge</span>, Reasoning &amp; Responsibility
                </>
              }
            />
            <Reveal variant="stagger" className="mt-12 max-w-xl space-y-7">
              <p className="font-serif text-[1.45rem] leading-[1.55] text-ivory md:text-[1.65rem]">
                Advocate Vagesh Samvedi is an independent legal practitioner whose professional work encompasses litigation, legal
                representation and advisory services across diverse areas of Indian law.
              </p>
              <p className="border-l border-gold/40 pl-6 text-base leading-8 text-ivory/80 md:text-[1.05rem]">
                His academic background includes a B.A. LL.B. (Hons.) and a completed LL.M. in Intellectual Property Rights. His legal
                interests extend beyond conventional litigation to include technology law, cybersecurity, intellectual property and
                contemporary legal developments.
              </p>
              <p className="text-base leading-8 text-ivory/75 md:text-[1.05rem]">
                His approach to legal practice is informed by careful examination of facts, legal research, statutory interpretation and
                consideration of applicable judicial precedents.
              </p>
              <p className="text-base leading-8 text-ivory/75 md:text-[1.05rem]">
                Alongside his professional responsibilities, he remains engaged in human rights initiatives, social activities and
                community-oriented organisational work.
              </p>
            </Reveal>
            <div className="relative mt-12 max-w-xl pt-9">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-gold/50 via-line to-transparent" data-anim="line-x" />
              <Reveal variant="stagger" className="space-y-8">
                <dl className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <dt className="label text-muted">Education</dt>
                    <dd className="mt-2 font-serif text-xl text-ivory">B.A. LL.B. (Hons.) · LL.M. (IPR)</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">Enrolment</dt>
                    <dd className="mt-2 font-serif text-xl text-ivory">State Bar Council of Madhya Pradesh</dd>
                  </div>
                </dl>
                <Link href="/about" className="btn-outline">
                  Read Full Biography <span aria-hidden>→</span>
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Practice areas */}
      <section aria-labelledby="practice-heading" className="border-t border-line bg-charcoal/40 py-28 md:py-36">
        <div className="container">
          <SectionHeading
            id="practice-heading"
            align="split"
            label="Areas of Practice"
            title="Legal Services Across Diverse Areas of Law"
            intro="Legal matters often require an understanding of different statutory frameworks, procedural requirements and individual circumstances. The practice encompasses legal assistance and representation across various areas of law, subject to the nature of the matter and applicable jurisdiction."
          />
          <div className="mt-16">
            <PracticeGrid />
          </div>
        </div>
      </section>

      {/* Professional profile */}
      <Credentials items={highlights} />

      {/* Social Journey */}
      <section aria-labelledby="social-heading" className="border-t border-line py-28 md:py-36">
        <div className="container">
          <SectionHeading
            id="social-heading"
            align="split"
            label="Social Journey"
            title="Beyond the Courtroom: Law, Society and Responsibility"
            intro="Professional life extends beyond courtroom proceedings. Engagement with human rights, community initiatives, sports and public welfare reflects another dimension of social responsibility. Through organisational roles and community participation, Advocate Vagesh Samvedi remains involved in initiatives concerning human dignity, equality and community development."
          />
          <div className="mt-16">
            {social.length > 0 ? (
              <>
                <SocialGallery posts={social} />
                <div data-anim="fade-up" className="mt-12 flex flex-col items-center gap-3">
                  <Link href="/social" className="btn-outline">
                    Explore Social Initiatives <span aria-hidden>→</span>
                  </Link>
                  {socialTotal > social.length && (
                    <p className="text-xs uppercase tracking-[0.2em] text-muted">{socialTotal} moments in the gallery</p>
                  )}
                </div>
              </>
            ) : (
              <EmptyState title="Gallery coming soon" text="Photographs and posts from events and professional activities will appear here." />
            )}
          </div>
          <DigitalCardBanner />
        </div>
      </section>

      {/* News */}
      <section aria-labelledby="news-heading" className="border-t border-line bg-charcoal/40 py-28 md:py-36">
        <div className="container">
          <SectionHeading
            id="news-heading"
            align="split"
            label="News"
            title="News & Professional Updates"
            intro="Professional activities, events, achievements and updates from the practice."
            aside={
              news.length > 0 && (
                <Link href="/news" className="link-gold mt-6">
                  View all news <span className="arrow">→</span>
                </Link>
              )
            }
          />
          <div className="mt-16">
            {leadNews ? (
              <div className="grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-5" data-anim="fade-up">
                  <NewsLead item={leadNews} />
                </div>
                {moreNews.length > 0 && (
                  <ul data-anim="stagger" data-delay="200" className="border-t border-line lg:col-span-7">
                    {moreNews.map((n) => (
                      <li key={n.slug}>
                        <NewsRow item={n} />
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : (
              <EmptyState title="News coming soon" text="Updates on professional activities, events and achievements will be shared here." />
            )}
          </div>
        </div>
      </section>

      {/* Blog & Articles */}
      {featured && (
        <section aria-labelledby="insights-heading" className="border-t border-line py-28 md:py-36">
          <div className="container">
            <SectionHeading
              id="insights-heading"
              align="split"
              label="Legal Knowledge"
              title="Legal Insights & Contemporary Developments"
              intro="Explore discussions on Indian law, legal procedures, intellectual property, cyber law, property disputes and emerging legal developments. This section aims to make relevant legal concepts more accessible through informative and research-oriented content."
              aside={
                <Link href="/blog" className="link-gold mt-6">
                  View all articles <span className="arrow">→</span>
                </Link>
              }
            />
            <div className="mt-16">
              <FeaturedArticle article={featured} />
            </div>
            {recent.length > 0 && (
              <div className="relative mt-20 pt-14">
                <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" data-anim="line-x" />
                <Reveal as="ul" variant="stagger" className="grid gap-x-10 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                  {recent.map((a) => (
                    <li key={a.slug}>
                      <ArticleCard article={a} />
                    </li>
                  ))}
                </Reveal>
              </div>
            )}
          </div>
        </section>
      )}


      {/* Professional philosophy */}
      <section aria-label="Professional philosophy" className="texture-grain relative overflow-hidden border-y border-line bg-black/40 py-32 md:py-44">
        <div aria-hidden className="absolute left-1/2 top-0 h-20 w-px -translate-x-1/2 bg-gradient-to-b from-transparent to-gold/70" />
        <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center" data-speed="0.4">
          <span className="select-none font-serif text-[22rem] leading-none text-gold/[0.04]">“</span>
        </div>
        <div className="container relative">
          <div className="mx-auto max-w-5xl text-center">
            <p className="label" data-anim="fade-up">
              Professional Philosophy
            </p>
            <h2
              data-anim="scrub-words"
              className="mt-10 font-serif text-[1.9rem] font-normal leading-[1.3] text-gold-light sm:text-[2.5rem] lg:text-[3.4rem]"
            >
              A Thoughtful Approach to Law and Justice
            </h2>
            <Reveal variant="stagger" className="mx-auto mt-10 max-w-3xl space-y-6 text-base leading-8 text-ivory/75 md:text-lg">
              <p>
                Legal practice requires more than an understanding of statutory provisions. It demands careful reasoning, attention to facts,
                examination of evidence and an appreciation of the circumstances surrounding each matter.
              </p>
              <p>
                Advocate Vagesh Samvedi approaches legal matters through considered analysis, legal research and an understanding of the
                remedies available under applicable law.
              </p>
              <p>
                The emphasis remains on professional diligence, procedural fairness, responsible legal representation and respect for the
                principles underlying the rule of law.
              </p>
            </Reveal>
            <div aria-hidden className="mx-auto mt-12 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gold/60" data-anim="line-x" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" data-anim="fade-up" data-delay="300" />
              <span className="h-px w-12 bg-gold/60" data-anim="line-x" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <ContactSection />

      {/* Office locations */}
      <OfficeLocations />
    </>
  );
}
