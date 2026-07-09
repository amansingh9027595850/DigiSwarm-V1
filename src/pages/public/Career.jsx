import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  MapPin,
  Clock,
  Sparkles,
  Heart,
  Coffee,
  Zap,
  Users,
  Search,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  IndianRupee,
} from 'lucide-react';
import clsx from 'clsx';

import { jobApi } from '@/api/job.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';
import { CAREER_HERO_IMAGE } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

const DEPT_COLORS = [
  'bg-brand-50 text-brand-700 ring-brand-100',
  'bg-emerald-50 text-emerald-700 ring-emerald-100',
  'bg-amber-50 text-amber-700 ring-amber-100',
  'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-100',
  'bg-indigo-50 text-indigo-700 ring-indigo-100',
  'bg-rose-50 text-rose-700 ring-rose-100',
];

const PERKS = [
  {
    icon: Heart,
    title: 'Work that matters',
    body: 'Real projects with real impact — your work goes live and gets used by 60+ brands.',
    accent: 'from-rose-500 to-pink-500',
  },
  {
    icon: Users,
    title: 'Senior team',
    body: 'Surrounded by craftspeople who care about quality and ship together every week.',
    accent: 'from-brand-500 to-indigo-500',
  },
  {
    icon: Coffee,
    title: 'Hybrid + flex',
    body: 'Office vibe when you need it, deep focus from home when you don\'t. Output > presence.',
    accent: 'from-amber-500 to-orange-500',
  },
  {
    icon: Zap,
    title: 'Fast growth',
    body: 'Take on responsibility quickly — your output decides your trajectory, not your tenure.',
    accent: 'from-emerald-500 to-teal-500',
  },
];

const HIRING_PROCESS = [
  {
    step: '01',
    icon: ClipboardList,
    title: 'Apply',
    body: 'Send your resume + a short note about why this role excites you. Takes 2 minutes.',
  },
  {
    step: '02',
    icon: MessageSquare,
    title: 'Intro call',
    body: '30-min chat with the hiring manager. Get a feel for the team, the work, and ask anything.',
  },
  {
    step: '03',
    icon: Search,
    title: 'Skills round',
    body: 'A practical exercise or take-home tied to real work — designed to take less than 3 hours.',
  },
  {
    step: '04',
    icon: CheckCircle2,
    title: 'Offer',
    body: 'A final culture call with the founders, then a clear offer within 48 hours.',
  },
];

const hashColor = (s = '') => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return DEPT_COLORS[h % DEPT_COLORS.length];
};

export default function Career() {
  const [department, setDepartment] = useState('');
  const [type, setType] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'jobs', { department, type }],
    queryFn: () =>
      jobApi.listPublic({
        department: department || undefined,
        type: type || undefined,
      }),
  });

  const allJobs = data?.data || [];

  const departments = useMemo(() => {
    const all = new Set(allJobs.map((j) => j.department).filter(Boolean));
    return ['', ...Array.from(all)];
  }, [allJobs]);

  const types = useMemo(() => {
    const all = new Set(allJobs.map((j) => j.type).filter(Boolean));
    return ['', ...Array.from(all)];
  }, [allJobs]);

  const openCount = allJobs.length;

  return (
    <>
      <Helmet>
        <title>Careers — DigiSwarm</title>
        <meta
          name="description"
          content="Join DigiSwarm. See open roles across marketing, design, and engineering — and apply in 2 minutes."
        />
      </Helmet>

      {/* HERO — split layout */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute -top-32 left-1/2 -z-10 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-brand-300/25 blur-3xl" />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.15] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="container-x pt-8 pb-8 md:pt-10 md:pb-12">
          <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-10">
            {/* Text — 7 cols, more room for content */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center lg:col-span-7 lg:text-left"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-800 shadow-soft">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-600" />
                </span>
                Now hiring · {openCount > 0 ? `${openCount} open role${openCount === 1 ? '' : 's'}` : 'Open positions'}
              </span>
              <h1 className="mt-4 text-3xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-4xl md:text-5xl lg:text-[2.75rem] xl:text-[3.25rem]">
                Come build{' '}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                    with us
                  </span>
                  <svg
                    aria-hidden
                    viewBox="0 0 200 14"
                    preserveAspectRatio="none"
                    className="absolute -bottom-1 left-0 h-2 w-full text-brand-300/70"
                  >
                    <path
                      d="M2 8 Q 50 0 100 8 T 198 8"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </h1>
              <p className="mx-auto mt-4 max-w-xl text-[14px] leading-relaxed text-ink-600 sm:text-[15px] lg:mx-0">
                A senior, in-house team that ships every week, helps each other, and takes pride
                in the craft. If that resonates, take a look at our open roles.
              </p>

              <div className="mt-5 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <a href="#open-roles" className="btn-primary group">
                  See open roles
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <Link to="/about" className="btn-outline">
                  About us
                </Link>
              </div>

              {/* Stat strip */}
              <div className="mx-auto mt-5 grid max-w-md grid-cols-3 gap-2 lg:mx-0 lg:max-w-md">
                <Stat value={openCount > 0 ? `${openCount}` : '—'} label="Open roles" />
                <Stat value="12" label="Specialists" />
                <Stat value="48h" label="Avg. reply" />
              </div>
            </motion.div>

            {/* Image — 5 cols, compact landscape */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5"
            >
              <div className="relative mx-auto w-full max-w-[380px] sm:max-w-[440px] md:max-w-[520px] lg:max-w-none">
                <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-300/40 via-indigo-300/30 to-emerald-300/25 blur-3xl" />
                <div
                  aria-hidden
                  className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-600 opacity-90"
                />

                <div className="relative w-full overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-1.5 shadow-card backdrop-blur-md">
                  <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white">
                    <img
                      src={CAREER_HERO_IMAGE}
                      alt="Build your career at DigiSwarm"
                      className="block aspect-[4/5] w-full object-cover sm:aspect-[5/4]"
                      loading="eager"
                      fetchpriority="high"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-600/5 via-transparent to-white/10"
                    />
                  </div>
                </div>

                {/* Floating "Hiring" — top-right */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: 8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.6, duration: 0.45 }}
                  className="absolute right-[-5%] top-[6%] z-10 hidden sm:block"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-white/95 px-3 py-2 shadow-card backdrop-blur">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-emerald-500 text-white">
                      <Sparkles size={12} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-700">
                        Hiring
                      </p>
                      <p className="text-xs font-extrabold text-ink-900">
                        {openCount > 0
                          ? `${openCount} role${openCount === 1 ? '' : 's'} open`
                          : 'Open positions'}
                      </p>
                    </div>
                  </div>
                </motion.div>

                {/* Floating "Hybrid + flex" — bottom-left */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, x: -8 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  transition={{ delay: 0.75, duration: 0.45 }}
                  className="absolute bottom-[6%] left-[-5%] z-10 hidden sm:block"
                >
                  <div className="flex items-center gap-2 rounded-xl border border-ink-100 bg-white/95 px-3 py-2 shadow-card backdrop-blur">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-amber-50 text-amber-700">
                      <Coffee size={14} />
                    </span>
                    <div className="leading-tight">
                      <p className="text-xs font-extrabold text-ink-900">Hybrid + flex</p>
                      <p className="text-[9px] font-medium text-ink-500">Output &gt; presence</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PERKS */}
      <section className="section pt-2">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Why DigiSwarm
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              What you&apos;ll find here
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PERKS.map((p, i) => (
              <motion.div
                key={p.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={fade}
                custom={i}
                className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <div
                  className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${p.accent} text-white shadow-soft`}
                >
                  <p.icon size={20} />
                </div>
                <p className="mt-4 font-bold text-ink-900">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-600">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* OPEN ROLES */}
      <section id="open-roles" className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              Open positions
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              {openCount > 0 ? `${openCount} role${openCount === 1 ? '' : 's'} open` : 'Open roles'}
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">
              Filter by team or type. Click any role for details and apply in 2 minutes.
            </p>
          </div>

          {/* Filters */}
          {!!allJobs.length && (departments.length > 1 || types.length > 1) && (
            <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
              {departments.length > 1 &&
                departments.map((d) => (
                  <button
                    key={d || 'dept-all'}
                    onClick={() => setDepartment(d)}
                    className={clsx(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium transition',
                      d === department
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                    )}
                  >
                    {d || 'All teams'}
                  </button>
                ))}
              {types.length > 1 && <span className="mx-2 h-5 w-px bg-ink-200" />}
              {types.length > 1 &&
                types.map((t) => (
                  <button
                    key={t || 'type-all'}
                    onClick={() => setType(t)}
                    className={clsx(
                      'rounded-full border px-3.5 py-1.5 text-sm font-medium capitalize transition',
                      t === type
                        ? 'border-brand-600 bg-brand-600 text-white shadow-soft'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                    )}
                  >
                    {t ? t.replace(/-/g, ' ') : 'All types'}
                  </button>
                ))}
            </div>
          )}

          {/* List */}
          <div className="mt-10">
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader />
              </div>
            ) : isError ? (
              <EmptyState
                title="Couldn't load roles"
                description="Please try again in a moment."
              />
            ) : !allJobs.length ? (
              <EmptyState
                icon={Briefcase}
                title="No open roles right now"
                description="We're not actively hiring, but always happy to hear from great people."
                action={
                  <Link to="/contact" className="btn-primary">
                    Get in touch
                  </Link>
                }
              />
            ) : (
              <div className="grid gap-4">
                {allJobs.map((j, i) => (
                  <motion.div
                    key={j._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fade}
                    custom={i}
                  >
                    <Link
                      to={`/career/${j.slug}`}
                      className="group relative flex flex-col items-start justify-between gap-4 overflow-hidden rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card sm:flex-row sm:items-center sm:p-7"
                    >
                      {/* Decorative accent strip on hover */}
                      <div
                        aria-hidden
                        className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-brand-500 to-indigo-500 transition-transform duration-300 group-hover:scale-y-100"
                      />

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span
                            className={clsx(
                              'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-semibold ring-1',
                              hashColor(j.department),
                            )}
                          >
                            <Briefcase size={11} /> {j.department}
                          </span>
                          <span className="rounded-full bg-ink-50 px-2.5 py-0.5 font-medium capitalize text-ink-700">
                            {j.type.replace(/-/g, ' ')}
                          </span>
                          {j.isFeatured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-0.5 font-bold uppercase tracking-wider text-amber-800">
                              <Sparkles size={10} /> Featured
                            </span>
                          )}
                        </div>
                        <h3 className="mt-3 text-xl font-extrabold text-ink-900 transition group-hover:text-brand-700 sm:text-2xl">
                          {j.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-ink-600">
                          {j.summary}
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                          <span className="inline-flex items-center gap-1.5">
                            <MapPin size={12} /> {j.location}
                          </span>
                          {j.experience && (
                            <span className="inline-flex items-center gap-1.5">
                              <Clock size={12} /> {j.experience}
                            </span>
                          )}
                          {j.salaryRange && (
                            <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
                              <IndianRupee size={12} /> {j.salaryRange}
                            </span>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5 group-hover:bg-brand-600 group-hover:text-white">
                        View role <ArrowRight size={14} />
                      </span>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HIRING PROCESS */}
      <section className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
              How we hire
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
              A respectful, fast process
            </h2>
            <p className="mt-3 text-base leading-relaxed text-ink-600">
              From "I applied" to "I have an offer" in ~10 days. No ghosting, no take-home that
              eats your weekend.
            </p>
          </div>

          <div className="relative mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {HIRING_PROCESS.map((p, i) => (
              <motion.div
                key={p.step}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fade}
                custom={i}
                className="group relative rounded-2xl border border-ink-100 bg-white p-6 transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <div className="flex items-start justify-between">
                  <span className="text-4xl font-extrabold tracking-tight text-brand-100 transition group-hover:text-brand-200">
                    {p.step}.
                  </span>
                  <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white">
                    <p.icon size={18} />
                  </div>
                </div>
                <h3 className="mt-4 text-lg font-extrabold text-ink-900">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CtaBanner
        title="Don't see your role?"
        body="We're always interested in meeting talented people. Send us a note and we'll see where it goes."
        primary={{ to: '/contact', label: 'Reach out' }}
        secondary={{ to: '/about', label: 'About us' }}
      />
    </>
  );
}

function Stat({ value, label }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white/85 px-2.5 py-2 text-center shadow-soft backdrop-blur lg:text-left">
      <p className="text-lg font-extrabold leading-none text-ink-900 sm:text-xl">{value}</p>
      <p className="mt-1 text-[9px] font-medium uppercase tracking-widest text-ink-500">
        {label}
      </p>
    </div>
  );
}
