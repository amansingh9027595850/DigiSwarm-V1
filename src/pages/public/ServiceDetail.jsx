import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Briefcase,
  Target,
  Users,
  Award,
  Zap,
  Wrench,
  Rocket,
  TrendingUp,
  ShieldCheck,
  Clock,
  Star,
} from 'lucide-react';

import { serviceApi } from '@/api/service.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';
import { SERVICES as SERVICE_IMAGES } from '@/data/placeholders';

const serviceImageBySlug = SERVICE_IMAGES.reduce((acc, s) => {
  acc[s.slug] = { image: s.image, accent: s.accent };
  return acc;
}, {});

const WHY_CHOOSE = [
  {
    icon: Users,
    title: 'In-house specialists',
    body: 'Designers, developers, and strategists — all under one roof, no freelance handoffs.',
    accent: 'from-brand-500 to-indigo-500',
  },
  {
    icon: Target,
    title: 'Outcome-focused',
    body: 'Real metrics — leads, sales, rankings — not just deliverables shipped.',
    accent: 'from-emerald-500 to-teal-500',
  },
  {
    icon: Zap,
    title: 'Fast turnarounds',
    body: 'Weekly demos and visible progress. No black-box waits or surprise delays.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: Award,
    title: '60+ happy clients',
    body: 'A track record across industries — local startups to growing brands.',
    accent: 'from-fuchsia-500 to-rose-500',
  },
];

const DEFAULT_PROCESS = [
  {
    step: '01',
    title: 'Discover',
    body: 'We listen, audit, and learn what your audience actually wants.',
    icon: Icons.Search,
  },
  {
    step: '02',
    title: 'Plan',
    body: 'A clear strategy with measurable goals, timelines, and budgets.',
    icon: Icons.ClipboardList,
  },
  {
    step: '03',
    title: 'Execute',
    body: 'Designs, copy, campaigns — shipped in weekly sprints.',
    icon: Rocket,
  },
  {
    step: '04',
    title: 'Optimise',
    body: 'Continuous testing & reporting until results compound.',
    icon: TrendingUp,
  },
];

const SERVICE_STATS = [
  { value: '60+', label: 'Happy clients', icon: Users },
  { value: '200+', label: 'Projects delivered', icon: Briefcase },
  { value: '4.9★', label: 'Average rating', icon: Star },
  { value: '2 wks', label: 'Avg. kickoff', icon: Zap },
];

const INDUSTRIES = [
  'Hospitality',
  'Healthcare',
  'Jewellery',
  'Real Estate',
  'Education',
  'D2C / E-commerce',
  'Local Services',
  'SaaS / Tech',
];

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

// Resolve a feature's icon string to a lucide component, falling back to CheckCircle2.
const FeatureIcon = ({ name }) => {
  const Cmp = (name && Icons[name]) || CheckCircle2;
  return <Cmp size={20} />;
};

export default function ServiceDetail() {
  const { slug } = useParams();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'service', slug],
    queryFn: () => serviceApi.getBySlug(slug),
    retry: 0,
  });

  const { data: relatedRes } = useQuery({
    queryKey: ['public', 'services', 'related'],
    queryFn: () => serviceApi.listPublic({ limit: 6 }),
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="section">
        <div className="container-x">
          <EmptyState
            title="Service not found"
            description="The service you're looking for has moved or doesn't exist yet."
            action={
              <Link to="/services" className="btn-primary">
                <ArrowLeft size={16} /> All services
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const s = data.data;
  const related =
    relatedRes?.data?.filter((r) => r.slug !== s.slug).slice(0, 3) || [];
  const local = serviceImageBySlug[s.slug];
  const heroImage = s.banner?.url || local?.image;
  const accent = local?.accent || 'from-brand-500 to-indigo-500';

  return (
    <>
      <Helmet>
        <title>{s.seo?.title || s.title} — DigiSwarm</title>
        <meta name="description" content={s.seo?.description || s.shortDesc} />
        {s.seo?.keywords?.length > 0 && (
          <meta name="keywords" content={s.seo.keywords.join(', ')} />
        )}
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute -top-32 right-1/4 -z-10 h-80 w-80 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -left-24 top-40 -z-10 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="container-x pt-10 pb-8 md:pt-14 md:pb-10">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-700"
          >
            <ArrowLeft size={14} /> All services
          </Link>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-12">
            <motion.div initial="hidden" animate="visible" variants={fade}>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 shadow-soft backdrop-blur">
                <Sparkles size={13} /> Service
              </span>
              <motion.h1
                variants={fade}
                custom={1}
                className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-[3.4rem] xl:text-6xl"
              >
                {s.title}
              </motion.h1>
              <motion.p
                variants={fade}
                custom={2}
                className="mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg"
              >
                {s.shortDesc}
              </motion.p>

              <motion.div
                variants={fade}
                custom={3}
                className="mt-7 flex flex-wrap gap-3"
              >
                <Link to="/contact" className="btn-primary group">
                  Get in touch
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
                <Link to="/services" className="btn-outline">
                  Other services
                </Link>
              </motion.div>

              {/* Trust strip */}
              <motion.div
                variants={fade}
                custom={4}
                className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-ink-500"
              >
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-emerald-600" /> In-house team
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock size={13} className="text-brand-600" /> 2-week kickoff
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Star size={13} className="fill-amber-400 text-amber-400" /> 4.9 / 5 rating
                </span>
              </motion.div>

              {!!s.technologies?.length && (
                <motion.div
                  variants={fade}
                  custom={5}
                  className="mt-7"
                >
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                    Tools we use
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {s.technologies.map((t) => (
                      <span
                        key={t}
                        className="inline-flex items-center gap-1 rounded-full border border-ink-100 bg-white/80 px-3 py-1 text-xs font-medium text-ink-700 shadow-soft backdrop-blur"
                      >
                        <Wrench size={11} className="text-brand-600" /> {t}
                      </span>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[480px] md:max-w-[560px] lg:max-w-none">
                <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-300/50 via-indigo-200/40 to-transparent blur-3xl" />
                <div
                  aria-hidden
                  className={`absolute inset-0 -z-10 translate-x-4 translate-y-4 rounded-3xl bg-gradient-to-br ${accent} opacity-90`}
                />
                <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-2 shadow-card backdrop-blur-md">
                <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700">
                  {heroImage ? (
                    <>
                      <img
                        src={heroImage}
                        alt={s.title}
                        className="h-full w-full object-cover"
                        loading="eager"
                      />
                      <div
                        aria-hidden
                        className={`absolute inset-0 bg-gradient-to-tr ${accent} opacity-10 mix-blend-overlay`}
                      />
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.25),transparent_55%)]" />
                      <div className="absolute inset-0 grid place-items-center p-10 text-white">
                        <div className="text-center">
                          <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                            <Briefcase size={36} />
                          </div>
                          <p className="mt-6 text-2xl font-extrabold leading-tight">
                            {s.title}
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="relative">
        <div className="container-x">
          <div className="grid grid-cols-2 gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft sm:grid-cols-4 sm:gap-0 sm:divide-x sm:divide-ink-100 sm:p-2">
            {SERVICE_STATS.map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-3 p-4">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <s.icon size={18} />
                </div>
                <div>
                  <p className="text-xl font-extrabold leading-tight text-ink-900">
                    {s.value}
                  </p>
                  <p className="text-[11px] font-medium text-ink-500">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU GET */}
      {!!s.features?.length && (
        <section className="section">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                What you get
              </span>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Everything included in this service
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-600">
                No hidden add-ons. Every deliverable below is part of the standard scope.
              </p>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {s.features.map((f, i) => (
                <motion.div
                  key={f.title || i}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.25 }}
                  variants={fade}
                  custom={i}
                  className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                >
                  <div
                    aria-hidden
                    className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-50 opacity-0 transition-opacity group-hover:opacity-100"
                  />
                  <div className="relative grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                    <FeatureIcon name={f.icon} />
                  </div>
                  <h3 className="relative mt-4 text-base font-extrabold text-ink-900">
                    {f.title}
                  </h3>
                  {f.description && (
                    <p className="relative mt-2 text-sm leading-relaxed text-ink-600">
                      {f.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              How we work
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              From kickoff to results
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              A simple, repeatable process that keeps everyone aligned and shipping.
            </p>
          </div>

          <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Connector line on desktop */}
            <div
              aria-hidden
              className="pointer-events-none absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-transparent via-brand-200 to-transparent lg:block"
            />
            {DEFAULT_PROCESS.map((p, i) => {
              const Icon = p.icon;
              return (
                <motion.div
                  key={p.step}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fade}
                  custom={i}
                  className="group relative rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-3xl font-extrabold tracking-tight text-brand-100 transition group-hover:text-brand-200">
                      {p.step}.
                    </span>
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-ink-900">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* LONG DESCRIPTION */}
      {s.fullDesc && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="relative mx-auto max-w-3xl">
              <div
                aria-hidden
                className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-brand-50/60 to-transparent blur-2xl"
              />
              <div className="rounded-3xl border border-ink-100 bg-white p-7 shadow-soft sm:p-10">
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                  About this service
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                  Why {s.title.toLowerCase()} matters
                </h2>
                <article
                  className="prose mt-5 max-w-none"
                  dangerouslySetInnerHTML={{ __html: s.fullDesc }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* WHO THIS IS FOR */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="rounded-3xl border border-ink-100 bg-gradient-to-br from-ink-50 via-white to-brand-50/40 p-7 sm:p-10">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                Who this is for
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Industries we work with
              </h2>
              <p className="mt-3 text-base leading-relaxed text-ink-600">
                From local Dehradun businesses to growing Indian D2C brands and global SaaS
                companies — our playbook adapts.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {INDUSTRIES.map((ind) => (
                <span
                  key={ind}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-200 bg-white px-3.5 py-1.5 text-sm font-medium text-ink-700 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:text-brand-700"
                >
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  {ind}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Why DigiSwarm
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              The partner you can trust
            </h2>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {WHY_CHOOSE.map((w, i) => (
              <motion.div
                key={w.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fade}
                custom={i}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${w.accent} text-white shadow-soft`}
                >
                  <w.icon size={20} />
                </div>
                <h3 className="mt-4 font-bold text-ink-900">{w.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{w.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED SERVICES */}
      {related.length > 0 && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                  Explore more
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                  Related services
                </h2>
              </div>
              <Link to="/services" className="btn-outline shrink-0">
                All services
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => {
                const rLocal = serviceImageBySlug[r.slug];
                return (
                  <Link
                    key={r._id}
                    to={`/services/${r.slug}`}
                    className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
                  >
                    {rLocal?.image && (
                      <div className="relative h-32 overflow-hidden">
                        <img
                          src={rLocal.image}
                          alt={r.title}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                        />
                        <div
                          aria-hidden
                          className={`absolute inset-0 bg-gradient-to-br ${rLocal.accent} opacity-25 mix-blend-overlay`}
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                        <Briefcase size={20} />
                      </div>
                      <h3 className="mt-4 font-bold text-ink-900">{r.title}</h3>
                      <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
                        {r.shortDesc}
                      </p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5">
                        Learn more <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title={`Ready to start your ${s.title.toLowerCase()} project?`}
        body="Send us a few details and we'll come back with a clear plan and estimate within 24 hours."
        primary={{ to: '/contact', label: 'Contact us' }}
        secondary={{ to: '/services', label: 'View all services' }}
      />
    </>
  );
}
