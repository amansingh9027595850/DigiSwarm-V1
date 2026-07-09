import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CtaBanner({
  title = "Got an idea? Let's scope it together.",
  body = "Tell us about your project — we'll come back with a clear plan, timeline, and estimate within 48 hours.",
  primary = { to: '/contact', label: 'Contact us' },
  secondary = { to: '/services', label: 'View services' },
}) {
  return (
    <section className="section pt-0">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-700 via-brand-600 to-brand-500 p-6 text-white shadow-card sm:p-8 md:p-10 lg:p-12">
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -left-16 bottom-0 h-56 w-56 rounded-full bg-white/10 blur-3xl" />

          <div className="relative flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl">
              <h2 className="text-xl font-extrabold tracking-tight sm:text-2xl md:text-3xl lg:text-4xl">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-brand-100 sm:mt-3 sm:text-base">{body}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to={primary.to}
                className="inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 hover:bg-brand-50 transition"
              >
                {primary.label} <ArrowRight size={16} />
              </Link>
              <Link
                to={secondary.to}
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
              >
                {secondary.label}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
