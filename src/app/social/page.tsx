import PageHeader from '@/components/PageHeader';
import SocialGallery from '@/components/SocialGallery';
import EmptyState from '@/components/EmptyState';
import JsonLd from '@/components/JsonLd';
import { getSocialPosts } from '@/lib/social';
import { socialProfiles } from '@/lib/site';
import SocialLinks from '@/components/SocialLinks';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Social Life',
  description: 'Photographs and posts from events, professional gatherings and activities of Advocate Vagesh Samvedi.',
  path: '/social',
});

export default function SocialPage() {
  const posts = getSocialPosts();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'Social Life', path: '/social' },
  ];

  return (
    <>
      <PageHeader
        label="Social Life"
        title={
          <>
            Beyond the <span className="italic text-gold-light">Courtroom</span>
          </>
        }
        intro="Moments from events, professional gatherings and the work behind the practice."
        crumbs={crumbs}
      />
      <section className="container py-16 md:py-24">
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
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
