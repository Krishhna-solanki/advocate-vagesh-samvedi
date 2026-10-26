import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Privacy Policy',
  description: 'How personal information submitted through this website is handled.',
  path: '/privacy-policy',
});

export default function PrivacyPolicyPage() {
  return (
    <LegalPage label="Legal" title="Privacy Policy" path="/privacy-policy" updated="26 October 2026">
      <p>
        This policy explains how personal information is handled when you use this website. It is intended to be read alongside the
        Digital Personal Data Protection Act, 2023 and other applicable Indian law.
      </p>
      <h2>Information you provide</h2>
      <p>
        If you use the contact form, we receive your name, email address and message. This information is used only to read and respond
        to your enquiry. It is delivered by email and is not stored in a database on this website.
      </p>
      <h2>Information collected automatically</h2>
      <p>
        The website does not use advertising or analytics cookies. Your browser stores a single local setting recording that you have
        accepted the website disclaimer. The hosting provider may keep standard server logs (such as IP address and request time) for
        security and reliability.
      </p>
      <h2>Sharing</h2>
      <p>
        Personal information is not sold or shared for marketing. Contact-form messages pass through an email delivery provider solely to
        deliver them.
      </p>
      <h2>Retention</h2>
      <p>Enquiries are retained only for as long as reasonably necessary to respond and to meet professional obligations.</p>
      <h2>Your rights</h2>
      <p>
        You may ask for access to, correction of, or deletion of personal information you have shared by writing to{' '}
        <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
      <h2>Confidential information</h2>
      <p>
        Please do not send confidential or privileged information through this website. Submitting information does not create an
        advocate–client relationship.
      </p>
    </LegalPage>
  );
}
