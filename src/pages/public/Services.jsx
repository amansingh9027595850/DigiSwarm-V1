import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Briefcase, Sparkles, CheckCircle2 } from 'lucide-react';

import { serviceApi } from '@/api/service.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';
import { SERVICES as SERVICE_IMAGES } from '@/data/placeholders';

const serviceImageBySlug = SERVICE_IMAGES.reduce((acc, s) => {
  acc[s.slug] = { image: s.image, accent: s.accent };
  return acc;
}, {});

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

const HIGHLIGHTS = [
  'Strategy-first approach',
  'In-house design + dev team',
  'Transparent weekly reporting',
];

export default function Services() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: () => serviceApi.listPublic({ limit: 50 }),
  });

  return (
    <>
      <Helmet>
        <title>Services — DigiSwarm</title>
        <meta
          name="description"
          content="Explore DigiSwarm's full set of digital marketing services — SEO, social media, web development, ads, content, and more."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="container-x pt-12 pb-8 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
              <Sparkles size={14} /> Our Services
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
              Everything your brand needs to{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                grow online
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
              From the first click to the final conversion — we cover the full digital stack.
              Every service below is built in-house, owned end-to-end.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
              {HIGHLIGHTS.map((h) => (
                <span
                  key={h}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white px-3 py-1.5 text-xs font-medium text-ink-700 shadow-soft"
                >
                  <CheckCircle2 size={12} className="text-emerald-600" />
                  {h}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* GRID */}
      <section className="section pt-4">
        <div className="container-x">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <EmptyState
              title="Couldn't load services"
              description="Please try again in a moment."
            />
          ) : !data?.data?.length ? (
            <EmptyState
              icon={Briefcase}
              title="No services published yet"
              description="Our team is finalizing the service catalog — check back soon."
              action={
                <Link to="/contact" className="btn-primary">
                  Talk to us
                </Link>
              }
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {data.data.map((svc, i) => {
                const local = serviceImageBySlug[svc.slug];
                const image = svc.banner?.url || local?.image;
                const accent = local?.accent || 'from-brand-500 to-indigo-500';
                return (
                  <motion.div
                    key={svc._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={fade}
                    custom={i}
                  >
                    <Link
                      to={`/services/${svc.slug}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                    >
                      {image ? (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={image}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div
                            aria-hidden
                            className={`absolute inset-0 bg-gradient-to-br ${accent} opacity-20 mix-blend-overlay transition-opacity group-hover:opacity-30`}
                          />
                          <div
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/40 to-transparent"
                          />
                        </div>
                      ) : (
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600">
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.3),transparent_55%)]" />
                          <div className="relative grid h-full place-items-center">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 text-white backdrop-blur">
                              <Briefcase size={28} />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex flex-1 flex-col p-6">
                        <h3 className="text-lg font-bold text-ink-900 transition group-hover:text-brand-700">
                          {svc.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
                          {svc.shortDesc}
                        </p>

                        {!!svc.technologies?.length && (
                          <div className="mt-5 flex flex-wrap gap-1.5">
                            {svc.technologies.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}

                        <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5">
                          Learn more <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <CtaBanner
        title="Not sure which service you need?"
        body="Tell us your goal — we'll suggest the right mix and walk you through it."
        primary={{ to: '/contact', label: 'Contact us' }}
        secondary={{ to: '/about', label: 'About us' }}
      />
    </>
  );
}
