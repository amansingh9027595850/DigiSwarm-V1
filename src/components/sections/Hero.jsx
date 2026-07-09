import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  PlayCircle,
} from 'lucide-react';
import { HERO_IMAGE } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

const TRUST_BADGES = [
  { icon: ShieldCheck, label: 'Trusted by 60+ brands' },
  { icon: Zap, label: '2-week kickoff' },
  { icon: Sparkles, label: 'In-house team' },
];

const FLOATING_STATS = [
  {
    icon: TrendingUp,
    value: '+312%',
    label: 'Avg. growth',
    accent: 'bg-emerald-50 text-emerald-600',
    position: 'left-[-3%] top-[14%] sm:left-[-7%] lg:left-[-9%]',
  },
  {
    icon: Users,
    value: '60+',
    label: 'Happy clients',
    accent: 'bg-brand-50 text-brand-700',
    position: 'right-[-3%] top-[58%] sm:right-[-6%] lg:right-[-7%]',
  },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Layered gradient mesh background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
      <div className="absolute -top-32 left-1/2 -z-10 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-brand-300/25 blur-3xl" />
      <div className="absolute -left-32 top-1/3 -z-10 h-64 w-64 rounded-full bg-indigo-300/20 blur-3xl" />
      <div className="absolute -right-32 top-1/4 -z-10 h-64 w-64 rounded-full bg-fuchsia-300/15 blur-3xl" />

      {/* Subtle dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.16] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="container-x pt-6 pb-8 sm:pt-8 sm:pb-10 md:pt-12 md:pb-14 lg:pt-14 lg:pb-16">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
          {/* TEXT SIDE */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fade}
            className="text-center lg:col-span-6 lg:text-left"
          >
            <motion.span
              variants={fade}
              className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-brand-700 shadow-soft backdrop-blur"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-brand-600" />
              </span>
              Complete digital presence
            </motion.span>

            <motion.h1
              variants={fade}
              custom={1}
              className="mt-5 text-[1.85rem] font-extrabold leading-[1.1] tracking-tight text-ink-900 xs:text-[2.15rem] sm:text-[2.7rem] md:text-[3rem] lg:text-[3.25rem] xl:text-[3.75rem]"
            >
              Digital{' '}
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                  Excellence
                </span>
                <svg
                  aria-hidden
                  viewBox="0 0 200 14"
                  preserveAspectRatio="none"
                  className="absolute -bottom-1.5 left-0 h-2.5 w-full text-brand-300/70"
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
              <br className="hidden sm:block" />
              for brands in{' '}
              <span className="text-ink-900">Uttarakhand.</span>
            </motion.h1>

            <motion.p
              variants={fade}
              custom={2}
              className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-600 sm:mt-4 sm:text-base lg:mx-0"
            >
              Strategy, design, content, and ads — under one roof. We are your strategic ally for
              navigating the digital landscape with measurable results.
            </motion.p>

            <motion.div
              variants={fade}
              custom={3}
              className="mt-5 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 lg:justify-start"
            >
              <Link to="/contact" className="btn-primary group">
                Start a project
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </Link>
              <Link
                to="/services"
                className="group inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2.5 text-sm font-semibold text-ink-800 ring-1 ring-ink-200 backdrop-blur transition hover:bg-white hover:ring-brand-300"
              >
                <PlayCircle size={16} className="text-brand-600" />
                View services
              </Link>
            </motion.div>

            {/* Trust row */}
            <motion.div
              variants={fade}
              custom={4}
              className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-xs text-ink-500 lg:justify-start"
            >
              <span className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white/70 px-2.5 py-1 shadow-soft backdrop-blur">
                <span className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
                  ))}
                </span>
                <span className="font-semibold text-ink-800">4.9</span>
                <span className="text-ink-500">/ 40+ clients</span>
              </span>
              {TRUST_BADGES.map(({ icon: Icon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-ink-100 bg-white/70 px-2.5 py-1 shadow-soft backdrop-blur"
                >
                  <Icon size={11} className="text-brand-600" />
                  <span className="font-medium text-ink-700">{label}</span>
                </span>
              ))}
            </motion.div>
          </motion.div>

          {/* IMAGE SIDE */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="relative lg:col-span-6"
          >
            {/* Glow halo behind image */}
            <div className="absolute -inset-8 -z-10 rounded-[2.5rem] bg-gradient-to-br from-brand-300/45 via-indigo-300/35 to-fuchsia-300/30 blur-3xl" />

            <div className="relative mx-auto max-w-[480px] sm:max-w-[520px] md:max-w-[620px] lg:max-w-none">
              {/* Decorative outer offset frame */}
              <div
                aria-hidden
                className="absolute inset-0 -z-10 translate-x-2.5 translate-y-2.5 rounded-3xl bg-gradient-to-br from-brand-600 to-indigo-600 opacity-90"
              />

              <div className="relative overflow-hidden rounded-3xl border border-white/40 bg-white/70 p-1.5 shadow-card backdrop-blur-md">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-50 to-white">
                  <img
                    src={HERO_IMAGE}
                    alt="Digital marketing dashboard showing growth metrics, analytics charts, and campaign performance"
                    className="block aspect-[5/4] w-full object-cover sm:aspect-[4/3] lg:aspect-[5/4]"
                    loading="eager"
                    fetchpriority="high"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-brand-600/5 via-transparent to-white/10"
                  />
                </div>
              </div>

              {/* Floating mini stat cards */}
              {FLOATING_STATS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.label}
                    initial={{ opacity: 0, scale: 0.85, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: 0.6 + i * 0.12, duration: 0.45 }}
                    className={`absolute ${s.position} z-10 hidden sm:block`}
                  >
                    <div className="flex items-center gap-2.5 rounded-2xl border border-ink-100 bg-white/95 px-3 py-2.5 shadow-card backdrop-blur">
                      <div
                        className={`grid h-9 w-9 place-items-center rounded-xl ${s.accent}`}
                      >
                        <Icon size={16} />
                      </div>
                      <div className="leading-tight">
                        <p className="text-base font-extrabold text-ink-900">{s.value}</p>
                        <p className="text-[10px] font-medium text-ink-500">{s.label}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {/* Floating avatar/trust pill at bottom */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.95, duration: 0.45 }}
                className="absolute -bottom-4 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
              >
                <div className="flex items-center gap-2.5 rounded-full border border-ink-100 bg-white/95 py-1.5 pl-1.5 pr-3.5 shadow-card backdrop-blur">
                  <div className="flex -space-x-2">
                    {['bg-brand-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500'].map(
                      (c, idx) => (
                        <span
                          key={idx}
                          className={`grid h-6 w-6 place-items-center rounded-full border-2 border-white text-[9px] font-bold text-white ${c}`}
                        >
                          {['A', 'R', 'N', 'S'][idx]}
                        </span>
                      ),
                    )}
                  </div>
                  <div className="leading-tight">
                    <p className="text-xs font-bold text-ink-900">60+ brands</p>
                    <p className="text-[10px] text-ink-500">trust DigiSwarm</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
