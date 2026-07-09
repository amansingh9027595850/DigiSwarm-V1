import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Construction, ArrowRight } from 'lucide-react';

export default function ComingSoon({
  title = 'Coming soon',
  description = 'This page is being crafted as part of an upcoming release.',
  phase,
}) {
  return (
    <>
      <Helmet>
        <title>{title} — DigiSwarm</title>
      </Helmet>

      <section className="section">
        <div className="container-x">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className="mx-auto max-w-2xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              <Construction size={14} /> Under construction
            </span>
            <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-ink-600">{description}</p>
            {phase && (
              <p className="mt-2 text-sm text-ink-500">
                Planned for development phase <span className="font-semibold">{phase}</span>.
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className="btn-primary">
                Back to home <ArrowRight size={16} />
              </Link>
              <Link to="/contact" className="btn-outline">
                Talk to us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
