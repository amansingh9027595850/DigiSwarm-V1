import { Link, Navigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Mail,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const TIMELINE = [
  {
    icon: CheckCircle2,
    title: 'Application received',
    body: 'We have your details and resume safely on file.',
    state: 'done',
  },
  {
    icon: Clock,
    title: 'HR review in progress',
    body: 'Our hiring team is reviewing your profile. Average review time is 24-48 hours.',
    state: 'current',
  },
  {
    icon: MessageSquare,
    title: 'You hear back',
    body: 'Expect an email — either to schedule an intro call or with thoughtful feedback.',
    state: 'pending',
  },
];

export default function ApplyThanks() {
  const location = useLocation();
  const { settings } = useSettings();
  const state = location.state || {};
  const jobTitle = state.jobTitle;
  const jobSlug = state.jobSlug;

  // If someone lands here without applying, send them back to careers.
  if (!jobTitle) {
    return <Navigate to="/career" replace />;
  }

  const hrEmail = settings.contact?.email || 'hr@digiswarm.in';

  return (
    <>
      <Helmet>
        <title>Application received — DigiSwarm Careers</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-emerald-50/60 via-white to-white" />
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 h-[460px] w-[680px] -translate-x-1/2 rounded-full bg-emerald-300/20 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.14] [background-image:radial-gradient(rgba(16,185,129,0.45)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="container-x pt-14 pb-12 md:pt-20 md:pb-16">
          <div className="mx-auto max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="text-center"
            >
              {/* Animated checkmark badge */}
              <motion.div
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
                className="relative mx-auto inline-flex"
              >
                <span className="absolute -inset-4 -z-10 rounded-full bg-emerald-200/50 blur-2xl" />
                <span className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-card">
                  <CheckCircle2 size={36} strokeWidth={2.5} />
                </span>
              </motion.div>

              <motion.span
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.45 }}
                className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-emerald-700 shadow-soft"
              >
                <Sparkles size={13} /> Application received
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl md:text-6xl"
              >
                Thank you for{' '}
                <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                  applying
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-ink-600 sm:text-lg"
              >
                Your application for{' '}
                <span className="font-semibold text-ink-900">{jobTitle}</span> has been submitted.
                Our HR team will review it and get back to you soon.
              </motion.p>

              {/* Waiting badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.45 }}
                className="mt-7 inline-flex items-center gap-2.5 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-soft"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
                </span>
                Waiting for HR response · typically within 24-48 hours
              </motion.div>
            </motion.div>

            {/* Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.5 }}
              className="mt-12 grid gap-4 sm:grid-cols-3"
            >
              {TIMELINE.map((t, i) => {
                const Icon = t.icon;
                const isDone = t.state === 'done';
                const isCurrent = t.state === 'current';
                return (
                  <div
                    key={t.title}
                    className={`relative rounded-2xl border p-5 transition ${
                      isDone
                        ? 'border-emerald-200 bg-emerald-50/50'
                        : isCurrent
                          ? 'border-amber-200 bg-amber-50/50 shadow-card ring-1 ring-amber-100'
                          : 'border-ink-100 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`grid h-9 w-9 place-items-center rounded-xl ${
                          isDone
                            ? 'bg-emerald-500 text-white'
                            : isCurrent
                              ? 'bg-amber-500 text-white'
                              : 'bg-ink-100 text-ink-500'
                        }`}
                      >
                        <Icon size={16} />
                      </span>
                      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                        Step {i + 1}
                      </p>
                    </div>
                    <h3 className="mt-3 text-sm font-bold text-ink-900">{t.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-ink-600">{t.body}</p>
                  </div>
                );
              })}
            </motion.div>

            {/* What's next */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 grid gap-4 sm:grid-cols-2"
            >
              <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-900">Watch your inbox</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    We&apos;ll reach out to{' '}
                    <span className="font-semibold text-ink-800">your email</span> with next
                    steps. Check spam too — just in case.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-ink-100 bg-white p-5">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-ink-900">Your data is safe</p>
                  <p className="mt-1 text-xs leading-relaxed text-ink-600">
                    Resume and details stay private to our HR team. We don&apos;t share them
                    with anyone else.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* HR contact + actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="mt-8 rounded-2xl border border-ink-100 bg-gradient-to-br from-white via-brand-50/40 to-white p-6 text-center"
            >
              <p className="text-sm text-ink-600">
                Have an urgent question about this role? Reach our HR team directly at{' '}
                <a
                  href={`mailto:${hrEmail}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {hrEmail}
                </a>
                .
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                <Link to="/career" className="btn-outline">
                  <ArrowLeft size={14} /> Back to careers
                </Link>
                {jobSlug && (
                  <Link to={`/career/${jobSlug}`} className="btn-ghost">
                    View this role
                  </Link>
                )}
                <Link to="/" className="btn-primary group">
                  Back to home
                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
}
