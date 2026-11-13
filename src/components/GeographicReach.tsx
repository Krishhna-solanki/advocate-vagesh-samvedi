import SectionHeading from './SectionHeading';
import Reveal from './Reveal';
import { site } from '@/lib/site';

// Areas of professional reach — not offices (content document, Page 4).
const mpPlaces = [...site.reachPlaces.madhyaPradesh, 'Other districts and locations across Madhya Pradesh'];
const gujaratPlaces = site.reachPlaces.gujarat;

function PlaceList({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-2">
      {items.map((p) => (
        <li key={p} className="border border-gold/25 bg-charcoal/60 px-3.5 py-1.5 text-sm text-ivory/85">
          {p}
        </li>
      ))}
    </ul>
  );
}

export default function GeographicReach({ variant = 'full' }: { variant?: 'full' | 'contact' }) {
  const full = variant === 'full';
  return (
    <section aria-labelledby="reach-heading" className="border-t border-line bg-charcoal/40 py-24 md:py-32">
      <div className="container">
        <SectionHeading
          id="reach-heading"
          align="split"
          label="Geographical Reach"
          title={full ? 'Professional Practice Across Madhya Pradesh & Gujarat' : 'Professional Reach Across Madhya Pradesh & Gujarat'}
        />
        <Reveal variant="stagger" className="mt-10 max-w-3xl space-y-5 leading-8 text-ivory/80">
          {full ? (
            <>
              <p>
                Advocate Vagesh Samvedi undertakes legal matters across Madhya Pradesh and in selected locations in Gujarat, subject to
                applicable jurisdictional requirements and professional permissions.
              </p>
              <p>
                His geographical professional reach includes matters arising across Madhya Pradesh, including proceedings before the High
                Court of Madhya Pradesh at its Indore Bench and Principal Seat at Jabalpur.
              </p>
              <p>His professional reach also extends to Vadodara, Dahod and Ahmedabad in Gujarat.</p>
              <p>
                The geographical scope of practice is considered according to the nature of each legal matter, the competent court or
                authority and applicable professional regulations.
              </p>
            </>
          ) : (
            <>
              <p>
                Legal matters are undertaken across Madhya Pradesh, including relevant proceedings before the High Court of Madhya Pradesh
                at its Indore Bench and Principal Seat at Jabalpur, subject to applicable professional and jurisdictional requirements.
              </p>
              <p>The geographical professional reach also includes selected locations in Gujarat, namely Vadodara, Dahod and Ahmedabad.</p>
              <p>
                The availability of legal representation in any particular matter depends on the applicable jurisdiction, professional
                permissions and nature of the proceedings.
              </p>
            </>
          )}
        </Reveal>

        {full && (
          <Reveal variant="stagger" className="mt-14 grid gap-5 lg:grid-cols-2">
            <div className="contact-card group flex-col !gap-0">
              <h3 className="label">Madhya Pradesh</h3>
              <p className="mt-3 text-ivory/80">Statewide professional reach across Madhya Pradesh, including:</p>
              <PlaceList items={mpPlaces} />
              <h4 className="mt-7 text-sm font-semibold uppercase tracking-[0.16em] text-gold-light">High Court of Madhya Pradesh</h4>
              <ul className="mt-3 space-y-1.5 text-ivory/80">
                <li>Principal Seat — Jabalpur.</li>
                <li>Indore Bench — Indore.</li>
              </ul>
            </div>
            <div className="contact-card group flex-col !gap-0">
              <h3 className="label">Gujarat</h3>
              <p className="mt-3 text-ivory/80">Professional geographical reach includes:</p>
              <PlaceList items={gujaratPlaces} />
            </div>
          </Reveal>
        )}
        <p className="mt-10 max-w-3xl text-sm leading-7 text-muted" data-anim="fade-up">
          These are areas of professional reach, not separate offices. Appearance before any court or forum is subject to the applicable
          enrolment, jurisdiction and appearance requirements.
        </p>
      </div>
    </section>
  );
}
