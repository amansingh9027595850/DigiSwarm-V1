import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import { jobApi } from '@/api/job.api';
import { jobSchema, JOB_TYPES } from '@/schemas/job.schema';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';
import SwitchField from '@/components/forms/SwitchField';
import ArrayInput from '@/components/forms/ArrayInput';
import RichTextEditor from '@/components/forms/RichTextEditor';

const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
};

const emptyDefaults = {
  title: '',
  slug: '',
  department: 'Engineering',
  location: 'Remote',
  type: 'full-time',
  experience: '',
  salaryRange: '',
  summary: '',
  description: '',
  responsibilities: [],
  requirements: [],
  benefits: [],
  isActive: true,
  closesAt: '',
  order: 0,
  seo: { title: '', description: '', keywords: [] },
};

export default function JobForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'job', id],
    queryFn: () => jobApi.getById(id),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing?.data) {
      const j = existing.data;
      reset({
        ...emptyDefaults,
        ...j,
        closesAt: toLocalInput(j.closesAt),
        seo: { ...emptyDefaults.seo, ...(j.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) => {
      const cleaned = { ...payload };
      if (cleaned.closesAt) cleaned.closesAt = new Date(cleaned.closesAt).toISOString();
      else delete cleaned.closesAt;
      return isEdit ? jobApi.update(id, cleaned) : jobApi.create(cleaned);
    },
    onSuccess: (res) => {
      toast.success(isEdit ? 'Role updated' : 'Role created');
      qc.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      if (!isEdit) navigate(`/admin/jobs/${res.data._id}/edit`, { replace: true });
    },
    onError: (err) => {
      const fieldErrors = err?.response?.data?.errors;
      if (Array.isArray(fieldErrors) && fieldErrors.length) {
        toast.error(
          fieldErrors.map((e) => `${e.path || 'field'}: ${e.message}`).join('\n'),
        );
      } else {
        toast.error(err?.response?.data?.message || 'Save failed');
      }
    },
  });

  if (isEdit && isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{isEdit ? 'Edit role' : 'New role'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit role' : 'New role'}
          actions={
            <>
              <Link to="/admin/jobs" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || saveMut.isPending}
                className="btn-primary"
              >
                <Save size={16} />
                {saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create role'}
              </button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Basics</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Title"
                  required
                  {...register('title')}
                  error={errors.title?.message}
                />
                <FormField label="Slug" hint="Auto from title if blank" {...register('slug')} />
                <FormField label="Department" required {...register('department')} error={errors.department?.message} />
                <FormField label="Location" required {...register('location')} error={errors.location?.message} />
                <div>
                  <label className="mb-1 block text-xs font-semibold text-ink-700">Type</label>
                  <select className="input capitalize" {...register('type')}>
                    {JOB_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t.replace(/-/g, ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <FormField label="Experience" placeholder="e.g. 3-5 years" {...register('experience')} />
                <FormField label="Salary range" placeholder="e.g. $90k - $120k" {...register('salaryRange')} />
                <FormField
                  label="Closes at"
                  type="datetime-local"
                  hint="Hides the role from public listings after this time"
                  {...register('closesAt')}
                />
              </div>
              <TextareaField
                label="Summary"
                required
                rows={3}
                hint="One-paragraph hook shown in lists"
                {...register('summary')}
                error={errors.summary?.message}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Long description
              </h3>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="jobs" />
                )}
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-500">
                  Responsibilities
                </h3>
                <Controller
                  name="responsibilities"
                  control={control}
                  render={({ field }) => (
                    <ArrayInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="Lead delivery of…"
                      addLabel="Add responsibility"
                    />
                  )}
                />
              </div>
              <div className="card p-6">
                <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-500">
                  Requirements
                </h3>
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <ArrayInput
                      value={field.value || []}
                      onChange={field.onChange}
                      placeholder="5+ years of…"
                      addLabel="Add requirement"
                    />
                  )}
                />
              </div>
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-500">
                Benefits
              </h3>
              <Controller
                name="benefits"
                control={control}
                render={({ field }) => (
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Remote-first culture"
                    addLabel="Add benefit"
                  />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">SEO</h3>
              <FormField label="SEO title" {...register('seo.title')} />
              <TextareaField label="SEO description" rows={3} {...register('seo.description')} />
              <Controller
                name="seo.keywords"
                control={control}
                render={({ field }) => (
                  <TagsInput label="SEO keywords" value={field.value || []} onChange={field.onChange} />
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Visibility</h3>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Active"
                    hint="Inactive jobs are hidden from the public career page"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField label="Order" type="number" {...register('order', { valueAsNumber: true })} />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
