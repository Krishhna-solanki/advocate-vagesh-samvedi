import LegalPage from '@/components/LegalPage';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'Privacy Policy | Advocate Vagesh Samvedi',
  description: 'How information submitted through the website of Advocate Vagesh Samvedi may be collected, used and handled.',
  path: '/privacy-policy',
});

// Content document, Page 12. The specific services named in sections 2, 6 and 7 reflect how the website actually works.
export default function PrivacyPolicyPage() {
  return (
    <LegalPage label="Legal" title="Privacy Policy" path="/privacy-policy" updated="11 November 2026">
      <h2>1. Introduction</h2>
      <p>
        This Privacy Policy explains how information may be collected, used and handled when visitors access the website of Advocate
        Vagesh Samvedi.
      </p>

      <h2>2. Information We May Collect</h2>
      <p>Information voluntarily submitted through the website may include:</p>
      <ul>
        <li>Name.</li>
        <li>Email address.</li>
        <li>Contact number.</li>
        <li>General description of a legal enquiry.</li>
        <li>Other information voluntarily provided through communication channels.</li>
      </ul>
      <p>
        When an appointment is booked through the website’s assistant, the details entered (name, address, email address, contact number,
        purpose and the chosen time) are also collected.
      </p>

      <h2>3. Purpose of Collection</h2>
      <p>Information submitted through the website may be used to:</p>
      <ul>
        <li>Review and respond to general enquiries.</li>
        <li>Understand the nature of a legal concern.</li>
        <li>Facilitate communication.</li>
        <li>Maintain necessary administrative records.</li>
        <li>Improve the website and its functionality.</li>
      </ul>

      <h2>4. Confidential Information</h2>
      <p>
        Visitors should avoid submitting highly sensitive personal information, confidential legal documents or privileged communications
        through general website enquiry forms unless an appropriate secure communication method has been provided.
      </p>

      <h2>5. Data Security</h2>
      <p>
        Reasonable measures should be taken to protect information against unauthorised access, disclosure or misuse. However, no
        internet-based transmission or storage method can be guaranteed to be completely secure.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        The website may use third-party services for hosting, maps, analytics, communication or other technical functions. Such services may
        process information in accordance with their respective privacy policies.
      </p>
      <p>
        At present these are: Vercel (website hosting); an email delivery service for contact-form enquiries; Google Calendar and Gmail
        (appointment bookings and their notification emails); OpenStreetMap (map display on the office-locations map); and Google Translate,
        which receives the page text only when a visitor chooses to view the website in Hindi. The website does not use advertising or
        analytics cookies.
      </p>

      <h2>7. Data Retention</h2>
      <p>
        Information submitted through website forms may be retained for the period necessary to address the enquiry, maintain relevant
        records or comply with applicable legal obligations, depending on the actual technical configuration.
      </p>
      <p>
        Contact-form enquiries are delivered by email and are not stored in a database on this website. Appointment details are kept as
        entries in the advocate’s Google Calendar.
      </p>

      <h2>8. External Links</h2>
      <p>
        The website may contain links to external websites. This Privacy Policy does not govern the privacy practices of those independent
        websites.
      </p>

      <h2>9. Policy Updates</h2>
      <p>
        This Privacy Policy may be updated when necessary to reflect changes in website functionality, information-handling practices or
        applicable legal requirements.
      </p>

      <h2>10. Contact</h2>
      <p>For questions concerning this Privacy Policy, visitors may use the professional contact details provided on the website.</p>
    </LegalPage>
  );
}
