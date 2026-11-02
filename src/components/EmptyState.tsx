import { socialProfiles } from '@/lib/site';
import SocialLinks from './SocialLinks';

// Shown in place of News / Social Life until real entries are published from the CMS.
export default function EmptyState({ title, text }: { title: string; text: string }) {
  return (
    <div data-anim="fade-up" className="relative border border-line px-6 py-16 text-center md:py-20">
      <span aria-hidden className="absolute left-1/2 top-0 h-px w-24 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold to-transparent" />
      <p className="font-serif text-3xl">{title}</p>
      <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-muted">{text}</p>
      {socialProfiles.length > 0 && (
        <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
          <span className="label text-muted">Follow</span>
          <SocialLinks variant="labelled" />
        </div>
      )}
    </div>
  );
}
