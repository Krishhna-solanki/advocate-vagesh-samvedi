import Image from 'next/image';
import Link from 'next/link';
import Hero from '@/components/Hero';
import SectionHeading from '@/components/SectionHeading';
import PracticeGrid from '@/components/PracticeGrid';
import FeaturedArticle from '@/components/FeaturedArticle';
import ArticleCard from '@/components/ArticleCard';
import ContactForm from '@/components/ContactForm';
import OfficeLocations from '@/components/OfficeLocations';
import Reveal from '@/components/Reveal';
import { getArticleMetas, getFeatured } from '@/lib/insights';
import { getNewsMetas } from '@/lib/news';
import { getHomepageSocial, getSocialPosts } from '@/lib/social';
import { NewsLead, NewsRow } from '@/components/NewsItems';
import SocialGallery from '@/components/SocialGallery';
import DigitalCardBanner from '@/components/DigitalCardBanner';
import EmptyState from '@/components/EmptyState';
import { site } from '@/lib/site';

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
        <div className="container grid gap-16 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-20">
          <div className="relative lg:col-span-5">
            <Reveal variant="image" className="relative aspect-[4/5] overflow-hidden">
              <div className="absolute -inset-y-[10%] inset-x-0" data-speed="0.25">
                <Image
                  src={site.portrait}
                  alt="Advocate Vagesh Samvedi taking notes, with books on his desk"
                  fill
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover object-[30%_78%] grayscale-[35%]"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
            </Reveal>
            <div aria-hidden className="absolute -bottom-6 -right-6 hidden h-40 w-40 md:block">
              <span className="absolute bottom-0 right-0 h-px w-full bg-gold/50" data-anim="line-x" data-delay="600" />
              <span className="absolute bottom-0 right-0 h-full w-px bg-gold/50" data-anim="line-y" data-delay="600" />
            </div>
          </div>

          <div className="lg:col-span-7 lg:pt-10">
            <SectionHeading
              id="about-heading"
              label="About Vagesh Samvedi"
              title={
                <>
                  An Approach Grounded in Law, <span className="italic text-gold-light">Research</span> &amp; Perspective
                </>
              }
            />
            <Reveal variant="stagger" className="mt-10 grid gap-8 text-base leading-8 text-ivory/80 md:grid-cols-2">
              <p>
                Vagesh Samvedi is an advocate and legal advisor based in {site.location.city}, {site.location.region}, whose work centres on
                civil law, cyber law and intellectual property law.
              </p>
              <p>
                His aim is to simplify complex legal matters — combining a commitment to justice with a creative, analytical approach to
                the questions businesses and individuals bring to him.
              </p>
            </Reveal>
            <div className="relative mt-12 pt-8">
              <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" data-anim="line-x" />
              <Reveal variant="stagger" className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <dl className="grid grid-cols-2 gap-x-10 gap-y-4 text-sm">
                  <div>
                    <dt className="label text-muted">Education</dt>
                    <dd className="mt-1.5 text-ivory/90">{site.education.institution}</dd>
                  </div>
                  <div>
                    <dt className="label text-muted">Practice</dt>
                    <dd className="mt-1.5 text-ivory/90">{site.firm.name}</dd>
                  </div>
                </dl>
                <Link href="/about" className="link-gold">
                  Full profile <span className="arrow">→</span>
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
            label="Practice Areas"
            title="Areas of Legal Practice"
            intro="Advisory and dispute-resolution work across civil, commercial, intellectual property and technology law."
          />
          <div className="mt-16">
            <PracticeGrid />
          </div>
        </div>
      </section>

      {/* News */}
      <section aria-labelledby="news-heading" className="border-t border-line py-28 md:py-36">
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
        <section aria-labelledby="insights-heading" className="border-t border-line bg-charcoal/40 py-28 md:py-36">
          <div className="container">
            <SectionHeading
              id="insights-heading"
              align="split"
              label="Blog & Articles"
              title="Legal Insights & Developments"
              intro="Perspectives on legal developments, legislation, landmark judgments and emerging legal questions."
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

      {/* Social Journey */}
      <section aria-labelledby="social-heading" className="border-t border-line py-28 md:py-36">
        <div className="container">
          <SectionHeading
            id="social-heading"
            align="split"
            label="Social Journey"
            title="Beyond the Courtroom"
            intro="Moments from events, professional gatherings and the work behind the practice."
          />
          <div className="mt-16">
            {social.length > 0 ? (
              <>
                <SocialGallery posts={social} />
                <div data-anim="fade-up" className="mt-12 flex flex-col items-center gap-3">
                  <Link href="/social" className="btn-outline">
                    View All Moments <span aria-hidden>→</span>
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


      {/* Philosophy — proposed editorial copy, pending the advocate's approval */}
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
            <blockquote className="mt-10">
              <p
                data-anim="scrub-words"
                className="font-serif text-[1.9rem] font-normal leading-[1.3] text-gold-light sm:text-[2.5rem] lg:text-[3.4rem]"
              >
                “Good legal thinking begins with careful research, a clear understanding of the facts and the discipline to examine every
                relevant perspective.”
              </p>
            </blockquote>
            <div aria-hidden className="mx-auto mt-12 flex items-center justify-center gap-4">
              <span className="h-px w-12 bg-gold/60" data-anim="line-x" />
              <span className="h-1.5 w-1.5 rotate-45 bg-gold" data-anim="fade-up" data-delay="300" />
              <span className="h-px w-12 bg-gold/60" data-anim="line-x" />
            </div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section aria-labelledby="contact-heading" className="py-28 md:py-36">
        <div className="container grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="contact-heading" label="Contact" title="Professional Enquiries" />
            <div className="mt-10 space-y-8">
              <p className="max-w-md leading-8 text-muted" data-anim="fade-up">
                For professional enquiries, please write using the form or by email. Information shared here is general and does not create
                an advocate–client relationship.
              </p>
              <Reveal as="div" variant="stagger" className="space-y-6 border-t border-line pt-8">
                <div>
                  <p className="label text-muted">Email</p>
                  <p className="mt-2 font-serif text-xl">
                    <a href={`mailto:${site.email}`} className="break-all hover:text-gold-light">
                      {site.email}
                    </a>
                  </p>
                </div>
                {site.phone && (
                  <div>
                    <p className="label text-muted">Phone</p>
                    <p className="mt-2 font-serif text-xl">
                      <a href={site.phone.href} className="hover:text-gold-light">
                        {site.phone.display}
                      </a>
                    </p>
                  </div>
                )}
                <div>
                  <p className="label text-muted">Location</p>
                  <p className="mt-2 font-serif text-xl">
                    {site.location.city}, {site.location.region}
                  </p>
                </div>
              </Reveal>
            </div>
          </div>
          <Reveal delay={150} className="form-panel lg:col-span-6 lg:col-start-7 lg:mt-6">
            <h3 className="font-serif text-3xl">Send a message</h3>
            <p className="mb-10 mt-3 text-sm text-muted">All fields are required.</p>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      {/* Office locations */}
      <OfficeLocations />
    </>
  );
}
