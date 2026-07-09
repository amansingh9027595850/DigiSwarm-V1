import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { ArrowLeft, ArrowRight, CheckCircle2, Send, Briefcase } from 'lucide-react';
import clsx from 'clsx';

import { quoteApi } from '@/api/quote.api';
import { serviceApi } from '@/api/service.api';
import {
  quoteStep1Schema,
  quoteStep2Schema,
  quoteStep3Schema,
  quoteStep4Schema,
  BUDGET_RANGES,
  TIMELINE_OPTIONS,
} from '@/schemas/quote.schema';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';

const STEPS = [
  { id: 1, title: 'About you', description: 'Who are we talking to?' },
  { id: 2, title: 'Services', description: 'What do you need help with?' },
  { id: 3, title: 'Scope', description: 'Budget and timeline.' },
  { id: 4, title: 'Details', description: 'A bit about the project.' },
];

const SCHEMAS = {
  1: quoteStep1Schema,
  2: quoteStep2Schema,
  3: quoteStep3Schema,
  4: quoteStep4Schema,
};

const initialValues = {
  name: '',
  email: '',
  phone: '',
  company: '',
  services: [],
  budget: 'Not sure yet',
  timeline: 'Just exploring',
  requirements: '',
};

export default function GetQuote() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialValues);
  const [submitted, setSubmitted] = useState(false);

  const submitMut = useMutation({
    mutationFn: (vals) => quoteApi.create(vals),
    onSuccess: (res) => {
      toast.success(res?.message || 'Request sent');
      setSubmitted(true);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Submission failed'),
  });

  const handleNext = (vals) => {
    const merged = { ...data, ...vals };
    setData(merged);
    if (step < STEPS.length) setStep(step + 1);
    else submitMut.mutate(merged);
  };

  return (
    <>
      <Helmet>
        <title>Get a quote — DigiSwarm</title>
        <meta
          name="description"
          content="Tell us about your project — we'll come back with a clear plan, timeline, and estimate."
        />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="container-x pt-12 pb-8 md:pt-14">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-700">
              Get a quote
            </span>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              Tell us about your project
            </h1>
            <p className="mt-4 text-ink-600 leading-relaxed">
              Four short steps. Takes 2 minutes. We&apos;ll come back with next steps within one business day.
            </p>
          </div>
        </div>
      </section>

      <section className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-3xl">
            {submitted ? (
              <SuccessState />
            ) : (
              <>
                <Stepper current={step} />
                <div className="card mt-6 p-6 sm:p-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.18 }}
                    >
                      {step === 1 && (
                        <Step1 initial={data} onBack={null} onNext={handleNext} />
                      )}
                      {step === 2 && (
                        <Step2 initial={data} onBack={() => setStep(1)} onNext={handleNext} />
                      )}
                      {step === 3 && (
                        <Step3 initial={data} onBack={() => setStep(2)} onNext={handleNext} />
                      )}
                      {step === 4 && (
                        <Step4
                          initial={data}
                          onBack={() => setStep(3)}
                          onNext={handleNext}
                          submitting={submitMut.isPending}
                        />
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

function Stepper({ current }) {
  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {STEPS.map((s) => {
        const done = s.id < current;
        const active = s.id === current;
        return (
          <li
            key={s.id}
            className={clsx(
              'rounded-2xl border bg-white p-4 transition',
              active && 'border-brand-500 ring-2 ring-brand-100',
              done && 'border-emerald-200',
              !active && !done && 'border-ink-100',
            )}
          >
            <div className="flex items-center gap-2">
              <span
                className={clsx(
                  'grid h-7 w-7 place-items-center rounded-full text-xs font-bold',
                  done && 'bg-emerald-100 text-emerald-700',
                  active && 'bg-brand-600 text-white',
                  !active && !done && 'bg-ink-100 text-ink-500',
                )}
              >
                {done ? <CheckCircle2 size={14} /> : s.id}
              </span>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                {s.title}
              </p>
            </div>
            <p className="mt-2 text-xs text-ink-500 hidden sm:block">{s.description}</p>
          </li>
        );
      })}
    </ol>
  );
}

function StepActions({ onBack, nextLabel = 'Continue', submitting }) {
  return (
    <div className="mt-6 flex items-center justify-between gap-3">
      {onBack ? (
        <button type="button" onClick={onBack} className="btn-outline">
          <ArrowLeft size={14} /> Back
        </button>
      ) : (
        <span />
      )}
      <button type="submit" className="btn-primary" disabled={submitting}>
        {submitting ? 'Sending…' : nextLabel} {!submitting && <ArrowRight size={14} />}
      </button>
    </div>
  );
}

function Step1({ initial, onBack, onNext }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SCHEMAS[1]),
    defaultValues: {
      name: initial.name,
      email: initial.email,
      phone: initial.phone,
      company: initial.company,
    },
  });
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <FormField label="Full name" required {...register('name')} error={errors.name?.message} />
        <FormField
          label="Work email"
          type="email"
          required
          {...register('email')}
          error={errors.email?.message}
        />
        <FormField label="Phone" type="tel" {...register('phone')} />
        <FormField label="Company" {...register('company')} />
      </div>
      <StepActions onBack={onBack} />
    </form>
  );
}

function Step2({ initial, onBack, onNext }) {
  const { data, isLoading } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: () => serviceApi.listPublic({ limit: 50 }),
  });

  const [selected, setSelected] = useState(initial.services || []);
  const [error, setError] = useState('');

  const toggle = (id) =>
    setSelected((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]));

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = SCHEMAS[2].safeParse({ services: selected });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message || 'Pick at least one service');
      return;
    }
    setError('');
    onNext({ services: selected });
  };

  const services = data?.data || [];

  return (
    <form onSubmit={handleSubmit} noValidate>
      {isLoading ? (
        <p className="py-10 text-center text-ink-500">Loading services…</p>
      ) : services.length === 0 ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          No services have been published yet. Use the contact form to describe what you need.
        </p>
      ) : (
        <>
          <p className="text-sm text-ink-600">Pick all that apply.</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {services.map((s) => {
              const active = selected.includes(s._id);
              return (
                <button
                  type="button"
                  key={s._id}
                  onClick={() => toggle(s._id)}
                  className={clsx(
                    'flex items-start gap-3 rounded-2xl border p-4 text-left transition',
                    active
                      ? 'border-brand-500 ring-2 ring-brand-100 bg-brand-50/50'
                      : 'border-ink-100 hover:border-brand-200',
                  )}
                  aria-pressed={active}
                >
                  <div
                    className={clsx(
                      'grid h-9 w-9 shrink-0 place-items-center rounded-xl',
                      active ? 'bg-brand-600 text-white' : 'bg-brand-50 text-brand-700',
                    )}
                  >
                    <Briefcase size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-ink-900">{s.title}</p>
                    <p className="line-clamp-2 text-xs text-ink-500">{s.shortDesc}</p>
                  </div>
                  {active && <CheckCircle2 className="ml-auto text-brand-600" size={18} />}
                </button>
              );
            })}
          </div>
        </>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      <StepActions onBack={onBack} />
    </form>
  );
}

function Step3({ initial, onBack, onNext }) {
  const {
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SCHEMAS[3]),
    defaultValues: { budget: initial.budget, timeline: initial.timeline },
  });
  const budget = watch('budget');
  const timeline = watch('timeline');

  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Budget</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {BUDGET_RANGES.map((b) => (
            <OptionButton
              key={b}
              label={b}
              active={budget === b}
              onClick={() => setValue('budget', b, { shouldValidate: true })}
            />
          ))}
        </div>
        {errors.budget && <p className="mt-2 text-xs text-red-600">{errors.budget.message}</p>}
      </div>

      <div className="mt-6">
        <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Timeline</p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {TIMELINE_OPTIONS.map((t) => (
            <OptionButton
              key={t}
              label={t}
              active={timeline === t}
              onClick={() => setValue('timeline', t, { shouldValidate: true })}
            />
          ))}
        </div>
        {errors.timeline && <p className="mt-2 text-xs text-red-600">{errors.timeline.message}</p>}
      </div>

      <StepActions onBack={onBack} />
    </form>
  );
}

function Step4({ initial, onBack, onNext, submitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SCHEMAS[4]),
    defaultValues: { requirements: initial.requirements },
  });
  return (
    <form onSubmit={handleSubmit(onNext)} noValidate>
      <TextareaField
        label="Tell us about the project"
        required
        rows={8}
        placeholder="What are you building? Who's it for? Anything you've tried or want to avoid?"
        {...register('requirements')}
        error={errors.requirements?.message}
      />
      <StepActions
        onBack={onBack}
        nextLabel="Send request"
        submitting={submitting}
      />
    </form>
  );
}

function OptionButton({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'rounded-xl border px-4 py-3 text-left text-sm font-semibold transition',
        active
          ? 'border-brand-500 ring-2 ring-brand-100 bg-brand-50/50 text-brand-800'
          : 'border-ink-100 text-ink-700 hover:border-brand-200',
      )}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}

function SuccessState() {
  return (
    <div className="card mx-auto max-w-xl p-10 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Send size={22} />
      </div>
      <h2 className="mt-5 text-2xl font-extrabold text-ink-900">Request sent</h2>
      <p className="mx-auto mt-2 max-w-md text-ink-600 leading-relaxed">
        Thanks — a confirmation is on its way to your inbox. We&apos;ll review the details and come
        back to you within one business day.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
        <Link to="/portfolio" className="btn-outline">
          See our work
        </Link>
      </div>
    </div>
  );
}
