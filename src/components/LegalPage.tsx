import PageHeader from './PageHeader';

export default function LegalPage({ label, title, path, updated, children }: { label: string; title: string; path: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <PageHeader label={label} title={title} crumbs={[{ name: 'Home', path: '/' }, { name: title, path }]} />
      <section className="container py-20">
        <div data-anim="children" className="prose prose-legal mx-auto max-w-prose">
          <p className="text-sm text-muted">Last updated: {updated}</p>
          {children}
        </div>
      </section>
    </>
  );
}
