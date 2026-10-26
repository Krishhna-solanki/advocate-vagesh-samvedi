import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="texture-columns flex min-h-[80vh] items-center pt-20">
      <div className="container text-center" data-anim="stagger">
        <p className="label">Error 404</p>
        <h1 className="display mt-6 text-5xl sm:text-7xl">Page not found</h1>
        <p className="mx-auto mt-6 max-w-md text-muted">The page you are looking for may have moved. Try the insights or the home page.</p>
        <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
          <Link href="/" className="btn-gold">
            Home
          </Link>
          <Link href="/insights" className="btn-outline">
            Insights &amp; News
          </Link>
        </div>
      </div>
    </section>
  );
}
