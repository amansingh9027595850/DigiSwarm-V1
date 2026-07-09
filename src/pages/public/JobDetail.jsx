import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  MapPin,
  Clock,
  Briefcase,
  CalendarClock,
  CheckCircle2,
  Send,
  Sparkles,
  IndianRupee,
  ShieldCheck,
} from 'lucide-react';

import { jobApi } from '@/api/job.api';
import { applySchema } from '@/schemas/application.schema';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import FileField from '@/components/forms/FileField';

const meta = [
  { icon: Briefcase, key: 'department' },
  { icon: MapPin, key: 'location' },
  { icon: Clock, key: 'experience' },
];

export default function JobDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'job', slug],
    queryFn: () => jobApi.getBySlug(slug),
    retry: 0,
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
            title="Role not available"
            description="This role isn't open right now. Browse other openings or get in touch."
            action={
              <Link to="/career" className="btn-primary">
                <ArrowLeft size={16} /> Back to careers
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const j = data.data;

  return (
    <>
      <Helmet>
        <title>{j.seo?.title || j.title} — Careers at DigiSwarm</title>
        <meta name="description" content={j.seo?.description || j.summary} />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-64 w-[640px] -translate-x-1/2 rounded-full bg-brand-200/35 blur-3xl" />

        <div className="container-x pt-10 pb-6 md:pt-14">
          <Link
            to="/career"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft size={14} /> All open roles
          </Link>

          <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:items-start">
            <div className="lg:col-span-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 font-semibold text-brand-700 ring-1 ring-brand-100">
                  <Briefcase size={11} /> {j.department}
                </span>
                <span className="rounded-full bg-ink-50 px-2.5 py-1 font-medium text-ink-700 capitalize">
                  {j.type.replace(/-/g, ' ')}
                </span>
                {j.isFeatured && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 px-2.5 py-1 font-bold uppercase tracking-wider text-amber-800">
                    <Sparkles size={10} /> Featured
                  </span>
                )}
              </div>
              <h1 className="mt-4 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl">
                {j.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">{j.summary}</p>
            </div>

            <aside className="card relative space-y-3 overflow-hidden p-5 lg:sticky lg:top-24 lg:self-start">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-50/80"
              />
              <p className="relative text-[11px] font-bold uppercase tracking-widest text-brand-700">
                Role overview
              </p>
              <div className="relative space-y-2 divide-y divide-ink-100">
                {meta
                  .filter((m) => j[m.key])
                  .map((m) => (
                    <Row
                      key={m.key}
                      icon={m.icon}
                      label={m.key.charAt(0).toUpperCase() + m.key.slice(1)}
                      value={j[m.key]}
                    />
                  ))}
                {j.salaryRange && (
                  <Row icon={IndianRupee} label="Salary" value={j.salaryRange} highlight />
                )}
                {j.closesAt && (
                  <Row
                    icon={CalendarClock}
                    label="Closes"
                    value={new Date(j.closesAt).toLocaleDateString(undefined, {
                      dateStyle: 'medium',
                    })}
                  />
                )}
              </div>
              <a
                href="#apply"
                className="btn-primary relative mt-3 w-full justify-center group"
              >
                Apply now
                <Send
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </a>
              <p className="relative text-center text-[11px] text-ink-500">
                Takes 2 minutes · Resume required
              </p>
            </aside>
          </div>
        </div>
      </section>

      <section className="section pt-8">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="space-y-10">
            {j.description && (
              <article
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: j.description }}
              />
            )}

            {!!j.responsibilities?.length && (
              <BulletBlock title="What you'll do" items={j.responsibilities} />
            )}
            {!!j.requirements?.length && (
              <BulletBlock title="What we're looking for" items={j.requirements} />
            )}
            {!!j.benefits?.length && <BulletBlock title="What we offer" items={j.benefits} />}
          </div>

          <aside className="hidden lg:block" aria-hidden />
        </div>
      </section>

      <section id="apply" className="section pt-0">
        <div className="container-x">
          <div className="mx-auto max-w-2xl">
            <ApplyForm slug={j.slug} jobTitle={j.title} />
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ icon: Icon, label, value, highlight }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2 text-sm first:pt-0 last:pb-0">
      <span className="inline-flex items-center gap-2 text-ink-500">
        <Icon size={14} /> {label}
      </span>
      <span
        className={`text-right font-semibold capitalize ${
          highlight ? 'text-emerald-700' : 'text-ink-900'
        }`}
      >
        {String(value).replace(/-/g, ' ')}
      </span>
    </div>
  );
}

function BulletBlock({ title, items }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-ink-900">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-start gap-2.5 text-ink-700">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ApplyForm({ slug, jobTitle }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      coverLetter: '',
      linkedIn: '',
      portfolio: '',
    },
  });

  const [resume, setResume] = useState(null);
  const [resumeError, setResumeError] = useState('');

  const submitMut = useMutation({
    mutationFn: (vals) => {
      const fd = new FormData();
      Object.entries(vals).forEach(([k, v]) => fd.append(k, v ?? ''));
      fd.append('resume', resume);
      return jobApi.apply(slug, fd);
    },
    onSuccess: (res) => {
      toast.success(res?.message || 'Application sent');
      navigate('/career/thanks', {
        replace: true,
        state: { jobTitle, jobSlug: slug },
      });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Submission failed'),
  });

  const onSubmit = (vals) => {
    if (!resume) {
      setResumeError('Resume is required');
      return;
    }
    setResumeError('');
    submitMut.mutate(vals);
  };

  return (
    <div className="card relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-brand-50/80"
      />
      <div className="relative flex items-start gap-3">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
          <Send size={20} />
        </div>
        <div>
          <h2 className="text-2xl font-extrabold text-ink-900">Apply for this role</h2>
          <p className="mt-1 text-sm text-ink-500">
            Takes 2 minutes. Resume required — cover letter optional.
          </p>
        </div>
      </div>

      <div className="relative mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-emerald-600" /> Your data is private
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock size={12} className="text-brand-600" /> Reply within 48 hours
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="relative mt-6 space-y-4"
        noValidate
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField
            label="Full name"
            required
            {...register('name')}
            error={errors.name?.message}
          />
          <FormField
            label="Email"
            type="email"
            required
            {...register('email')}
            error={errors.email?.message}
          />
          <FormField label="Phone" type="tel" {...register('phone')} />
          <FormField
            label="LinkedIn"
            type="url"
            placeholder="https://linkedin.com/in/…"
            {...register('linkedIn')}
            error={errors.linkedIn?.message}
          />
          <div className="sm:col-span-2">
            <FormField
              label="Portfolio / website"
              type="url"
              placeholder="https://"
              {...register('portfolio')}
              error={errors.portfolio?.message}
            />
          </div>
        </div>

        <Controller
          name="resume"
          control={control}
          render={() => (
            <FileField
              label="Resume"
              required
              value={resume}
              onChange={(f) => {
                setResume(f);
                setResumeError('');
              }}
              error={resumeError}
            />
          )}
        />

        <TextareaField
          label="Cover letter (optional)"
          rows={5}
          placeholder="Tell us why you're excited about this role…"
          {...register('coverLetter')}
          error={errors.coverLetter?.message}
        />

        <button
          type="submit"
          className="btn-primary w-full sm:w-auto"
          disabled={submitMut.isPending}
        >
          <Send size={14} /> {submitMut.isPending ? 'Submitting…' : 'Submit application'}
        </button>
      </form>
    </div>
  );
}
