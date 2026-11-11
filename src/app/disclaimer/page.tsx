import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Legal Disclaimer | Advocate Vagesh Samvedi',
  description: 'Legal disclaimer governing the information published on the website of Advocate Vagesh Samvedi.',
  path: '/disclaimer',
});

// Content document, Page 11. To be reviewed against applicable Bar Council of India requirements before publication.
export default function DisclaimerPage() {
  return (
    <LegalPage label="Legal" title="Legal Disclaimer" path="/disclaimer" updated="11 November 2026">
      <p>The information provided on this website is intended for general informational and educational purposes only.</p>
      <p>
        The content available on this website, including legal articles, explanations, descriptions of legal services and professional
        information, should not be construed as specific legal advice or a substitute for consultation concerning an individual legal
        matter.
      </p>
      <p>
        Accessing or using this website, or communicating through its general enquiry facilities, does not automatically establish an
        advocate-client relationship.
      </p>
      <p>
        Legal outcomes depend upon the facts, evidence, applicable legislation, judicial interpretation and circumstances of each individual
        matter. No guarantee or assurance of any particular legal outcome is made through the information published on this website.
      </p>
      <p>
        The information presented is not intended to solicit legal work or advertise professional services in violation of applicable
        professional-conduct rules governing advocates in India.
      </p>
      <p>Visitors should independently assess their legal circumstances and seek appropriate professional advice where required.</p>
      <p>
        External links, if provided, are included for informational convenience. Their content and accuracy remain the responsibility of
        the respective website operators.
      </p>
      <p>Advocate Vagesh Samvedi reserves the right to update website information where necessary to maintain accuracy and relevance.</p>
    </LegalPage>
  );
}
