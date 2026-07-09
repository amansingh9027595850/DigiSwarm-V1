import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function NotFound() {
  return (
    <>
      <Helmet>
        <title>Page not found — DigiSwarm</title>
      </Helmet>
      <section className="container-x section text-center">
        <p className="text-sm font-semibold uppercase tracking-widest text-brand-700">404</p>
        <h1 className="mt-3 text-4xl font-extrabold text-ink-900 sm:text-5xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-ink-600">
          The page you&apos;re looking for has moved, or never existed.
        </p>
        <Link to="/" className="btn-primary mt-8">
          Back to home
        </Link>
      </section>
    </>
  );
}
