import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';

export default function LegalPage({ title, lastUpdated, intro, sections }) {
  return (
    <>
      <Helmet>
        <title>{title} — DigiSwarm</title>
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/40 via-white to-white" />
        <div className="container-x pt-16 pb-12 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Legal
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-3 text-sm text-ink-500">Last updated: {lastUpdated}</p>
            {intro && <p className="mx-auto mt-6 max-w-2xl text-ink-600 leading-relaxed">{intro}</p>}
          </motion.div>
        </div>
      </section>

      <section className="pb-20">
        <div className="container-x">
          <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[14rem_1fr]">
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <p className="mb-3 text-xs font-bold uppercase tracking-widest text-ink-500">
                On this page
              </p>
              <ul className="space-y-1.5 text-sm">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded-lg px-2 py-1 text-ink-600 hover:bg-ink-50 hover:text-ink-900"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </aside>

            <article className="prose-legal space-y-10">
              {sections.map((s) => (
                <section key={s.id} id={s.id} className="scroll-mt-24">
                  <h2 className="text-2xl font-extrabold text-ink-900">{s.title}</h2>
                  <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-ink-700">
                    {s.body.map((para, i) =>
                      typeof para === 'string' ? (
                        <p key={i}>{para}</p>
                      ) : (
                        <ul key={i} className="ml-5 list-disc space-y-1.5">
                          {para.items.map((item, j) => (
                            <li key={j}>{item}</li>
                          ))}
                        </ul>
                      ),
                    )}
                  </div>
                </section>
              ))}
            </article>
          </div>
        </div>
      </section>
    </>
  );
}
