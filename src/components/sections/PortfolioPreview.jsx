import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { PROJECTS } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function PortfolioPreview() {
  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Selected work"
            title="Recent projects we're proud of"
            subtitle="A glimpse at how we&apos;ve helped teams ship faster, scale further, and design better."
          />
          <Link to="/portfolio" className="btn-outline shrink-0">
            See all work
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:grid-cols-2 sm:gap-5 md:mt-12 md:gap-6">
          {PROJECTS.map((p, i) => (
            <motion.div
              key={p.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fade}
              custom={i}
            >
              <Link
                to={`/portfolio/${p.slug}`}
                className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
              >
                <div className={`relative h-36 bg-gradient-to-br sm:h-44 md:h-48 ${p.accent}`}>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
                  <div className="absolute top-4 left-4 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                    {p.category}
                  </div>
                  <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white opacity-0 transition group-hover:opacity-100">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
                <div className="p-4 sm:p-5 md:p-6">
                  <div className="flex items-center gap-2 text-xs text-ink-500">
                    <span className="font-semibold text-ink-700">{p.client}</span>
                  </div>
                  <h3 className="mt-2 text-lg font-extrabold leading-tight text-ink-900 sm:text-xl">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.summary}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
