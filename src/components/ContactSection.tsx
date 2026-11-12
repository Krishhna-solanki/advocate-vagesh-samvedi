import Link from 'next/link';
import ContactForm from './ContactForm';
import SectionHeading from './SectionHeading';
import SocialLinks from './SocialLinks';
import BookAppointmentButton from './BookAppointmentButton';
import WhatsAppChannelButton from './WhatsAppChannelButton';
import { site } from '@/lib/site';

type IconName = 'mail' | 'phone' | 'pin' | 'globe' | 'quill';

function Icon({ name, className = 'h-5 w-5' }: { name: IconName; className?: string }) {
  const paths: Record<IconName, React.ReactNode> = {
    mail: (
      <>
        <rect x="3.5" y="5.5" width="17" height="13" rx="1" />
        <path d="M4 6.5l8 6 8-6" />
      </>
    ),
    phone: <path d="M6.6 3.8l2.6-.6 1.6 3.9-1.9 1.4a11 11 0 0 0 5 5l1.4-1.9 3.9 1.6-.6 2.6a2 2 0 0 1-2 1.5A15.5 15.5 0 0 1 5.1 5.8a2 2 0 0 1 1.5-2z" />,
    pin: (
      <>
        <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11z" />
        <circle cx="12" cy="10" r="2.4" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="M3.5 12h17M12 3.5c2.4 2.6 3.5 5.4 3.5 8.5s-1.1 5.9-3.5 8.5c-2.4-2.6-3.5-5.4-3.5-8.5s1.1-5.9 3.5-8.5z" />
      </>
    ),
    quill: (
      <>
        <path d="M19.5 4.5c-6 .5-10.5 5-12 12.5l-1 3" />
        <path d="M8.5 13.5h5M19.5 4.5c.3 5.5-3.2 9.5-9 10" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      {paths[name]}
    </svg>
  );
}

function Card({ icon, label, children, href, sub }: { icon: IconName; label: string; children: React.ReactNode; href?: string; sub?: React.ReactNode }) {
  const body = (
    <>
      <span className="contact-card__icon" aria-hidden>
        <Icon name={icon} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="label block text-muted transition-colors duration-500 group-hover:text-gold">{label}</span>
        <span className="mt-2 block break-words font-serif text-[1.05rem] leading-snug text-ivory transition-colors duration-500 group-hover:text-gold-light min-[400px]:text-xl sm:text-[1.35rem]">
          {children}
        </span>
        {sub && <span className="mt-1 block text-sm text-muted">{sub}</span>}
      </span>
      {href && (
        <span aria-hidden className="contact-card__arrow hidden sm:inline">
          ↗
        </span>
      )}
    </>
  );
  return href ? (
    <a href={href} className="contact-card group">
      {body}
    </a>
  ) : (
    <div className="contact-card group">{body}</div>
  );
}

/**
 * Contact details beside the enquiry form. Used on the homepage ("home": with its own heading) and on the
 * Contact page ("page": below the page header, adding profiles and the appointment button).
 */
export default function ContactSection({ variant = 'home' }: { variant?: 'home' | 'page' }) {
  const page = variant === 'page';
  const FormHeading = page ? 'h2' : 'h3';
  const BookHeading = page ? 'h3' : 'h4';

  return (
    <section
      aria-labelledby={page ? 'contact-form-heading' : 'contact-heading'}
      className={`contact-luxe relative overflow-hidden ${page ? 'py-20 md:py-28' : 'py-28 md:py-36'}`}
    >
      <div className="container relative grid gap-14 lg:grid-cols-12 lg:gap-x-12 xl:gap-x-20">
        {/* Details (stay in view beside the taller form on large screens) */}
        <div className="lg:sticky lg:top-28 lg:col-span-5 lg:self-start">
          {page ? (
            <p className="label flex items-center gap-4" data-anim="fade-up">
              <span className="h-px w-10 bg-gold" aria-hidden data-anim="line-x" data-delay="150" />
              Get in touch
            </p>
          ) : (
            <SectionHeading id="contact-heading" label="Contact" title="Have a Legal Concern? Begin with an Informed Discussion." />
          )}

          <p className={`max-w-md leading-8 text-muted ${page ? 'mt-6' : 'mt-8'}`} data-anim="fade-up" data-delay="200">
            {page
              ? 'Reach the office directly using the details below, or submit an enquiry using the form.'
              : 'For enquiries concerning legal representation, litigation or advisory assistance, connect through the available contact channels. Each enquiry can be considered in light of its facts, applicable law and relevant jurisdiction.'}
          </p>
          {!page && (
            <div data-anim="fade-up" data-delay="250" className="mt-8">
              <Link href="/contact" className="btn-outline">
                Get in Touch <span aria-hidden>→</span>
              </Link>
            </div>
          )}

          <div data-anim="stagger" data-delay="300" className="mt-10 grid gap-3.5">
            <Card icon="mail" label="Email" href={`mailto:${site.email}`}>
              <span translate="no" className="notranslate">
                {site.email}
              </span>
            </Card>
            {site.phone && (
              <Card icon="phone" label="Phone" href={site.phone.href}>
                <span translate="no" className="notranslate">
                  {site.phone.display}
                </span>
              </Card>
            )}
            <Card icon="pin" label="Professional Locations" sub={`Madhya Pradesh · Professional reach: ${site.reach}`}>
              {site.locations.join(' · ')}
            </Card>
            {page && (
              <div className="contact-card group">
                <span className="contact-card__icon" aria-hidden>
                  <Icon name="globe" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="label block text-muted transition-colors duration-500 group-hover:text-gold">Profiles</span>
                  <span className="mt-3 block">
                    <SocialLinks variant="labelled" />
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* WhatsApp channel, directly below the contact details */}
          <div data-anim="fade-up" data-delay="200" className="mt-6">
            <WhatsAppChannelButton />
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-7" data-anim="fade-up" data-delay="350">
          <div className="form-panel form-panel--luxe">
            <div className="flex items-start gap-4">
              <span className="contact-card__icon !h-12 !w-12 shrink-0" aria-hidden>
                <Icon name="quill" className="h-5 w-5" />
              </span>
              <div>
                <FormHeading id={page ? 'contact-form-heading' : undefined} className="font-serif text-3xl leading-tight sm:text-[2.1rem]">
                  Submit a Legal Enquiry
                </FormHeading>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Please provide a brief description of your legal concern so that the nature of your enquiry can be understood. All fields
                  are required.
                </p>
              </div>
            </div>
            <span aria-hidden className="mb-10 mt-7 block h-px bg-gradient-to-r from-gold/50 via-gold/15 to-transparent" />
            <ContactForm />

            <div className="mt-12 flex flex-col gap-5 border-t border-gold/15 pt-10 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <BookHeading className="font-serif text-2xl">Prefer to meet?</BookHeading>
                <p className="mt-2 text-sm text-muted">See the times open for appointments and book one in a few steps.</p>
              </div>
              <BookAppointmentButton className="shrink-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
