import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import {
  Sparkles,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  Award,
  GraduationCap,
  Phone,
  User as UserIcon,
  Building2,
  ArrowRight,
  Send,
  ShieldCheck,
} from 'lucide-react';

import { workshopApi } from '@/api/workshop.api';
import {
  workshopRegistrationSchema,
  EDUCATION_OPTIONS,
} from '@/schemas/workshopRegistration.schema';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import FormField from '@/components/forms/FormField';

const FALLBACK_EVENT_DATE = new Date('2026-05-23T10:00:00+05:30');

const PERK_FALLBACKS = [
  'Certificate of participation',
  'Live Q&A with experts',
  'Real-world digital marketing playbook',
];

const formatDate = (d) =>
  d
    ? new Date(d).toLocaleString(undefined, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : '';

function useCountdown(target) {
  const targetTs = useMemo(() => (target ? new Date(target).getTime() : 0), [target]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!targetTs) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [targetTs]);

  if (!targetTs) {
    return { isOver: false, parts: { days: 0, hours: 0, minutes: 0, seconds: 0 } };
  }
  const diff = Math.max(0, targetTs - now);
  const seconds = Math.floor(diff / 1000) % 60;
  const minutes = Math.floor(diff / (60 * 1000)) % 60;
  const hours = Math.floor(diff / (60 * 60 * 1000)) % 24;
  const days = Math.floor(diff / (24 * 60 * 60 * 1000));
  return { isOver: diff === 0, parts: { days, hours, minutes, seconds } };
}

export default function Workshop() {
  const { data, isLoading } = useQuery({
    queryKey: ['public', 'workshop', 'current'],
    queryFn: () => workshopApi.getCurrent(),
    staleTime: 60 * 1000,
  });

  const workshop = data?.data?.workshop;
  const registrationsCount = data?.data?.registrationsCount ?? 0;
  const eventDate = workshop?.eventDate || FALLBACK_EVENT_DATE;
  const seatsLeft =
    workshop && workshop.seats > 0
      ? Math.max(0, workshop.seats - registrationsCount)
      : null;

  const countdown = useCountdown(eventDate);

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!workshop) {
    return (
      <section className="section">
        <div className="container-x">
          <EmptyState
            title="No workshop scheduled right now"
            description="We don't have an active workshop at the moment. Check back soon — or get in touch."
            action={
              <Link to="/contact" className="btn-primary">
                Contact us
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const perks = workshop.perks?.length ? workshop.perks : PERK_FALLBACKS;

  return (
    <>
      <Helmet>
        <title>{workshop.seo?.title || `${workshop.title} — DigiSwarm`}</title>
        <meta
          name="description"
          content={
            workshop.seo?.description ||
            workshop.tagline ||
            'Join our FREE offline Digital Marketing Workshop. Limited seats — book yours now.'
          }
        />
      </Helmet>

      {/* HERO with countdown */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div
          aria-hidden
          className="absolute -top-32 left-1/2 -z-10 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-brand-300/25 blur-3xl"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 opacity-[0.13] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
        />

        <div className="container-x pt-12 pb-10 md:pt-16 md:pb-14">
          <div className="grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
            {/* Text + countdown */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              className="text-center lg:col-span-7 lg:text-left"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-amber-800 shadow-soft">
                <Sparkles size={13} /> {workshop.isFree ? 'Free entry' : workshop.price}
              </span>

              <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] tracking-tight text-ink-900 sm:text-5xl md:text-[3.2rem] lg:text-[3rem] xl:text-[3.5rem]">
                Join Our{' '}
                <span className="bg-gradient-to-r from-brand-600 via-brand-500 to-indigo-500 bg-clip-text text-transparent">
                  FREE Offline
                </span>{' '}
                Digital Marketing Workshop
              </h1>

              <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-ink-600 sm:text-lg lg:mx-0">
                {workshop.tagline ||
                  'Specially designed for students who want to explore career opportunities, industry knowledge, and professional growth. Attend, interact with experts, and walk out with a certificate of participation.'}
              </p>

              {/* Event meta chips */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <MetaChip icon={Calendar} text={formatDate(eventDate)} tone="brand" />
                {workshop.durationHours && (
                  <MetaChip
                    icon={Clock}
                    text={`${workshop.durationHours}h session`}
                    tone="emerald"
                  />
                )}
                {workshop.location && (
                  <MetaChip icon={MapPin} text={workshop.location} tone="rose" />
                )}
                {seatsLeft !== null && seatsLeft > 0 && (
                  <MetaChip
                    icon={Users}
                    text={`${seatsLeft} seats left`}
                    tone="amber"
                  />
                )}
              </div>

              {/* Countdown */}
              {!countdown.isOver ? (
                <div className="mt-8">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-brand-700">
                    Workshop starts in
                  </p>
                  <div className="mt-3 grid max-w-md grid-cols-4 gap-2 sm:gap-3 lg:max-w-lg">
                    <CountdownBlock value={countdown.parts.days} label="Days" />
                    <CountdownBlock value={countdown.parts.hours} label="Hours" />
                    <CountdownBlock value={countdown.parts.minutes} label="Mins" />
                    <CountdownBlock value={countdown.parts.seconds} label="Secs" pulse />
                  </div>
                </div>
              ) : (
                <div className="mt-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
                  <p className="text-sm font-semibold">
                    The workshop is live or completed — check back for the next session.
                  </p>
                </div>
              )}

              {/* CTA */}
              <div className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <a href="#register" className="btn-primary group">
                  Book your FREE seat
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </a>
                <span className="text-xs text-ink-500">
                  Takes 30 seconds · Confirmation on your phone
                </span>
              </div>

              {/* Perks list */}
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {perks.map((p) => (
                  <div
                    key={p}
                    className="flex items-start gap-2.5 rounded-xl border border-ink-100 bg-white/80 p-3 text-sm shadow-soft backdrop-blur"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-emerald-600"
                    />
                    <span className="text-ink-700">{p}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Registration card */}
            <motion.div
              id="register"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
              className="lg:col-span-5"
            >
              <RegistrationCard
                slug={workshop.slug}
                workshopTitle={workshop.title}
                seatsLeft={seatsLeft}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT — long description from admin */}
      {workshop.description && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="mx-auto max-w-3xl rounded-3xl border border-ink-100 bg-white p-7 shadow-soft sm:p-10">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                About this workshop
              </span>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                What you&apos;ll get out of it
              </h2>
              <article
                className="prose mt-5 max-w-none"
                dangerouslySetInnerHTML={{ __html: workshop.description }}
              />
            </div>
          </div>
        </section>
      )}

      {/* Speakers — optional */}
      {!!workshop.speakers?.length && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="mx-auto max-w-2xl text-center">
              <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                Speakers
              </span>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
                Learn from people who do this every day
              </h2>
            </div>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {workshop.speakers.map((sp, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-ink-100 bg-white p-6 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
                >
                  <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-700">
                    <Award size={20} />
                  </div>
                  <p className="mt-4 font-bold text-ink-900">{sp.name}</p>
                  {sp.role && <p className="text-xs text-ink-500">{sp.role}</p>}
                  {sp.bio && (
                    <p className="mt-3 text-sm leading-relaxed text-ink-600">{sp.bio}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

// ---------- Helpers ----------

const CHIP_TONES = {
  brand: 'bg-brand-50 text-brand-800',
  emerald: 'bg-emerald-50 text-emerald-800',
  amber: 'bg-amber-50 text-amber-800',
  rose: 'bg-rose-50 text-rose-800',
};
function MetaChip({ icon: Icon, text, tone = 'brand' }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${CHIP_TONES[tone]}`}
    >
      <Icon size={12} /> {text}
    </span>
  );
}

function CountdownBlock({ value, label, pulse }) {
  const display = String(value).padStart(2, '0');
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-3 text-center shadow-soft">
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-6 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-brand-100/60 blur-xl ${
          pulse ? 'animate-pulse' : ''
        }`}
      />
      <p className="relative text-3xl font-extrabold leading-none tracking-tight text-ink-900 tabular-nums sm:text-4xl">
        {display}
      </p>
      <p className="relative mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
        {label}
      </p>
    </div>
  );
}

function RegistrationCard({ slug, workshopTitle, seatsLeft }) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(workshopRegistrationSchema),
    defaultValues: {
      fullName: '',
      city: '',
      education: '',
      phone: '',
      email: '',
    },
  });

  const submitMut = useMutation({
    mutationFn: (vals) => workshopApi.register(slug, vals),
    onSuccess: (res) => {
      toast.success(res?.message || 'Registered!');
      setSubmitted(true);
      reset();
    },
    onError: (err) => {
      const fieldErrors = err?.response?.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        toast.error(
          fieldErrors.map((e) => `${e.path || 'field'}: ${e.message}`).join('\n'),
        );
      } else {
        toast.error(err?.response?.data?.message || 'Registration failed');
      }
    },
  });

  if (submitted) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-white p-7 shadow-card sm:p-8">
        <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-card">
          <CheckCircle2 size={26} strokeWidth={2.5} />
        </div>
        <h2 className="mt-5 text-2xl font-extrabold text-ink-900">You&apos;re in!</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-600">
          Your seat for <span className="font-semibold text-ink-900">{workshopTitle}</span>{' '}
          is reserved. We&apos;ll send confirmation details on your phone shortly.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => setSubmitted(false)} className="btn-outline">
            Register someone else
          </button>
          <Link to="/" className="btn-primary">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-card">
      {/* Gradient banner */}
      <div className="relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-700 to-indigo-700 p-6 text-white sm:p-7">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/10 blur-3xl"
        />
        <p className="text-[11px] font-bold uppercase tracking-widest text-white/85">
          Book your free seat
        </p>
        <h3 className="mt-1.5 text-2xl font-extrabold leading-tight">
          Reserve your spot
        </h3>
        <p className="mt-1.5 text-sm text-white/85">
          {seatsLeft !== null && seatsLeft <= 10 && seatsLeft > 0
            ? `Only ${seatsLeft} seats left — grab yours.`
            : 'Limited seats. First come, first served.'}
        </p>
      </div>

      <form
        onSubmit={handleSubmit((vals) =>
          submitMut.mutate({ ...vals, email: vals.email || undefined }),
        )}
        className="space-y-4 p-6 sm:p-7"
        noValidate
      >
        <FormField
          label="Full name"
          required
          placeholder="Your full name"
          {...register('fullName')}
          error={errors.fullName?.message}
        />
        <FormField
          label="City"
          required
          placeholder="Dehradun, Delhi, etc."
          {...register('city')}
          error={errors.city?.message}
        />
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-700">
            Education <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            {EDUCATION_OPTIONS.map((opt) => (
              <label
                key={opt}
                className="group cursor-pointer rounded-xl border border-ink-200 bg-white p-2.5 text-center text-xs font-semibold text-ink-700 transition has-[input:checked]:border-brand-500 has-[input:checked]:bg-brand-50 has-[input:checked]:text-brand-700 hover:border-brand-300"
              >
                <input
                  type="radio"
                  value={opt}
                  className="sr-only"
                  {...register('education')}
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
          {errors.education && (
            <p className="mt-1 text-xs text-red-600">{errors.education.message}</p>
          )}
        </div>
        <FormField
          label="Phone number"
          required
          type="tel"
          inputMode="tel"
          placeholder="+91 9876543210"
          {...register('phone')}
          error={errors.phone?.message}
        />
        <FormField
          label="Email (optional)"
          type="email"
          placeholder="you@example.com"
          {...register('email')}
          error={errors.email?.message}
        />

        <button
          type="submit"
          className="btn-primary w-full justify-center group"
          disabled={submitMut.isPending}
        >
          <Send size={14} />
          {submitMut.isPending ? 'Booking…' : 'Book my FREE seat'}
        </button>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-ink-500">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={11} className="text-emerald-600" /> Your data is private
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Phone size={11} className="text-brand-600" /> Confirmation on your phone
          </span>
        </div>
      </form>
    </div>
  );
}

// Lucide icons used only as decoration; keep imports.
// eslint-disable-next-line no-unused-vars
const _unused = { GraduationCap, UserIcon, Building2 };
