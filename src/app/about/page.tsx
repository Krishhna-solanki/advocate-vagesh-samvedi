import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';
import Reveal from '@/components/Reveal';
import JsonLd from '@/components/JsonLd';
import { site } from '@/lib/site';
import { breadcrumbJsonLd, pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata({
  title: 'About Advocate Vagesh Samvedi | Professional Profile',
  description:
    'Explore the professional background, legal education, qualifications and professional journey of Advocate Vagesh Samvedi.',
  path: '/about',
});

const principles = [
  'Respect for the rule of law and judicial institutions.',
  'Careful examination of facts and documentary evidence.',
  'Application of statutory provisions and relevant judicial precedents.',
  'Recognition of individual rights and procedural safeguards.',
  'Professional diligence in legal preparation and representation.',
  'Respect for equality, fairness and access to justice.',
  'Continuous learning and engagement with evolving legal developments.',
];

const roleNotes: Record<string, string> = {
  'Judicial Human Rights Council, Jhabua':
    'An organisational responsibility involving engagement with human rights, social awareness and community-oriented initiatives.',
  'Boxing Association, Jhabua':
    'An organisational role associated with sports administration and participation in activities concerning sports and youth development.',
};

function Block({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="relative mt-20 pt-12">
      <span aria-hidden className="absolute inset-x-0 top-0 h-px bg-line" data-anim="line-x" />
      <h2 id={id} className="display text-3xl md:text-4xl" data-anim="heading">
        {title}
      </h2>
      <div className="mt-8">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
  ];
  return (
    <>
      <PageHeader
        label="About"
        title={
          <>
            About Advocate <span className="italic text-gold-light">Vagesh Samvedi</span>
          </>
        }
        intro="An Independent Legal Practitioner Committed to Legal Reasoning, Professional Responsibility and Justice."
        crumbs={crumbs}
      />

      <section className="py-24 md:py-32">
        <div className="container grid gap-16 lg:grid-cols-12 lg:gap-x-10 xl:gap-x-24">
          <Reveal className="lg:col-span-5" delay={200}>
            <div className="relative lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] overflow-hidden" data-anim="image">
                <Image
                  src="/images/about-portrait.jpg"
                  alt="Advocate Vagesh Samvedi reading a law book in his chamber"
                  fill
                  sizes="(min-width: 1024px) 38vw, 92vw"
                  className="object-cover object-[48%_50%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
              </div>
              <div aria-hidden className="absolute -left-5 -top-5 hidden h-32 w-32 border-l border-t border-gold/50 md:block" />
              <p className="mt-5 text-xs uppercase tracking-[0.2em] text-muted">
                {site.fullName} · {site.reach}
              </p>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            {/* Professional background */}
            <h2 className="label" data-anim="fade-up">
              Professional Background
            </h2>
            <Reveal variant="stagger" className="mt-8 space-y-7 text-lg leading-9 text-ivory/85">
              <p className="font-serif text-3xl leading-snug text-ivory md:text-[2.1rem]">
                Advocate Vagesh Samvedi is an independent legal practitioner engaged in litigation, legal representation and advisory work
                across various areas of Indian law.
              </p>
              <p>His professional journey reflects an engagement with legal practice, academic learning and social responsibility.</p>
              <p>
                Having completed his B.A. LL.B. (Hons.) in 2025 and subsequently pursued and completed an LL.M. in Intellectual Property
                Rights, he has developed an academic foundation that combines conventional legal education with an interest in
                contemporary legal developments.
              </p>
              <p>
                His professional practice encompasses civil litigation, property and revenue disputes, criminal matters, family law, cyber
                law, intellectual property and other legal issues requiring representation and legal assistance.
              </p>
              <p>
                As an independent practitioner, he undertakes legal matters individually, involving legal research, preparation, drafting,
                procedural applications and representation according to the requirements of each case. His professional work includes
                matters in which favourable legal outcomes have been achieved.
              </p>
              <p>
                His academic interests extend to the relationship between law and technology, particularly intellectual property,
                cybersecurity, artificial intelligence and digital rights.
              </p>
              <p>
                Beyond legal practice, he holds organisational responsibilities as District President of the Judicial Human Rights Council,
                Jhabua, and Secretary of the Boxing Association, Jhabua. These responsibilities form part of his engagement with human
                rights, sports administration and community-oriented initiatives.
              </p>
              <p>
                His professional outlook is informed by the importance of legal knowledge, careful reasoning, procedural fairness and
                respect for the rule of law.
              </p>
            </Reveal>

            <Block id="about-education" title="Education & Academic Qualifications">
              <Reveal as="ol" variant="stagger" className="relative border-l border-gold/30 pl-8">
                {site.education.map((e) => (
                  <li key={e.degree} className="relative pb-9 last:pb-0">
                    <span aria-hidden className="absolute -left-[2.3rem] top-2 h-2.5 w-2.5 rotate-45 border border-gold bg-ink" />
                    <p className="font-serif text-2xl leading-snug text-ivory">{e.degree}</p>
                    <p className="mt-1.5 text-ivory/75">{e.institution}</p>
                    <p className="mt-1 text-sm uppercase tracking-[0.16em] text-gold">{e.detail}</p>
                  </li>
                ))}
              </Reveal>
            </Block>

            <Block id="about-registration" title="Professional Registration & Qualifications">
              <Reveal as="ul" variant="stagger" className="border-t border-line">
                {[
                  `Advocate enrolled with the ${site.barCouncil}.`,
                  'Successfully qualified the All India Bar Examination (AIBE) in 2025.',
                  'Engaged in independent legal practice since 2025.',
                  ...(site.enrolment ? [`Enrolment number: ${site.enrolment}`] : []),
                ].map((item) => (
                  <li key={item} className="flex gap-4 border-b border-line py-4 text-ivory/85">
                    <span aria-hidden className="mt-3 h-px w-4 shrink-0 bg-gold" />
                    {item}
                  </li>
                ))}
              </Reveal>
            </Block>

            <Block id="about-practice" title="Independent Practice & Legal Representation">
              <Reveal variant="stagger" className="space-y-6 text-lg leading-9 text-ivory/80">
                <p>
                  Advocate Vagesh Samvedi follows an independent approach to legal practice, undertaking and handling legal matters
                  individually across different areas of law.
                </p>
                <p>
                  His professional responsibilities involve examining case facts, studying relevant legal provisions, preparing legal
                  documents, developing appropriate legal strategies and pursuing remedies available under the applicable legal framework.
                </p>
                <p>
                  His practice includes civil, property, revenue, criminal, family and cyber-related matters, alongside legal interests in
                  intellectual property and emerging areas of law.
                </p>
                <p>
                  The experience gained through independently handled matters has contributed to his understanding of legal procedures,
                  litigation requirements and the practical application of legal principles.
                </p>
                <p>Each matter is approached according to its individual circumstances, evidentiary position and applicable law.</p>
              </Reveal>
            </Block>

            <Block id="about-principles" title="Principles That Guide the Practice">
              <Reveal variant="stagger" className="space-y-6 text-lg leading-9 text-ivory/80">
                <p>A responsible legal practice requires a balance of knowledge, preparation, reasoning and professional integrity.</p>
                <p>The foundation of Advocate Vagesh Samvedi’s professional outlook includes:</p>
              </Reveal>
              <Reveal as="ul" variant="stagger" className="mt-6 grid gap-x-8 border-t border-line sm:grid-cols-2">
                {principles.map((p) => (
                  <li key={p} className="flex gap-4 border-b border-line py-4 text-ivory/85">
                    <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-gold" />
                    {p}
                  </li>
                ))}
              </Reveal>
            </Block>

            <Block id="about-interests" title="Beyond Conventional Legal Practice">
              <Reveal variant="stagger" className="space-y-6 text-lg leading-9 text-ivory/80">
                <p>
                  His academic and intellectual interests include Intellectual Property Rights, artificial intelligence and law,
                  cybersecurity, digital regulation, technology-related legal questions and the evolving interpretation of established legal
                  principles.
                </p>
                <p>
                  His interdisciplinary learning also includes psychology, contributing to an interest in human behaviour, social interaction
                  and the circumstances surrounding legal disputes.
                </p>
              </Reveal>
            </Block>

            <Block id="about-roles" title="Professional Responsibilities Beyond Legal Practice">
              <Reveal variant="stagger" className="grid gap-4 sm:grid-cols-2">
                {site.roles.map((r) => (
                  <div key={r.organisation} className="contact-card group flex-col !gap-3">
                    <p className="label">{r.title}</p>
                    <p className="font-serif text-2xl leading-snug text-ivory">{r.organisation}</p>
                    <p className="text-sm leading-7 text-muted">{roleNotes[r.organisation]}</p>
                  </div>
                ))}
              </Reveal>
            </Block>

            <Reveal variant="stagger" className="mt-16 flex flex-col gap-4 sm:flex-row">
              <Link href="/practice-areas" className="btn-gold">
                Explore Practice Areas
              </Link>
              <Link href="/contact" className="btn-outline">
                Contact
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />
    </>
  );
}
