import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';

export const metadata = pageMetadata({
  title: 'Website Disclaimer',
  description: 'Disclaimer governing the use of this website, in accordance with the Bar Council of India Rules.',
  path: '/disclaimer',
});

export default function DisclaimerPage() {
  return (
    <LegalPage label="Legal" title="Website Disclaimer" path="/disclaimer" updated="26 October 2026">
      <p>
        The Bar Council of India does not permit advocates to solicit work or advertise in any manner. This website has been created
        solely to provide general professional information about {site.name} to persons who seek it of their own accord.
      </p>
      <h2>No solicitation</h2>
      <p>
        By accessing this website, you acknowledge and confirm that you are seeking information relating to {site.name} of your own
        accord and that there has been no form of solicitation, advertisement, invitation or inducement by the advocate or anyone acting
        on his behalf.
      </p>
      <h2>No legal advice</h2>
      <p>
        The content of this website, including all articles and insights, is for general informational purposes only. It is not legal
        advice and should not be relied upon as a substitute for advice on the facts of a particular matter. Laws and judicial
        interpretations change; content may not reflect the most recent developments.
      </p>
      <h2>No advocate–client relationship</h2>
      <p>
        Visiting this website, reading its content, or contacting the advocate through it — including by email, phone or the contact form —
        does not by itself create an advocate–client relationship. Please do not send confidential information until such a relationship
        has been formally established.
      </p>
      <h2>No guarantee of outcome</h2>
      <p>Nothing on this website is, or should be read as, a representation or promise about the outcome of any legal matter.</p>
      <h2>External links</h2>
      <p>
        This website may contain links to third-party websites. These are provided for convenience only; the advocate does not endorse and
        is not responsible for their content.
      </p>
      <h2>Liability</h2>
      <p>
        The advocate shall not be liable for any consequence of any action taken by relying on material or information provided on this
        website.
      </p>
    </LegalPage>
  );
}
