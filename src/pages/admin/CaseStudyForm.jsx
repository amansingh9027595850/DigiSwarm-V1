import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, Plus, Save, Trash2 } from 'lucide-react';

import { caseStudyApi } from '@/api/caseStudy.api';
import { projectApi } from '@/api/project.api';
import { caseStudySchema } from '@/schemas/caseStudy.schema';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';
import RichTextEditor from '@/components/forms/RichTextEditor';

const emptyDefaults = {
  title: '',
  slug: '',
  project: '',
  client: '',
  industry: '',
  cover: { url: '', publicId: '' },
  challenge: '',
  solution: '',
  results: '',
  metrics: [],
  content: '',
  duration: '',
  teamSize: '',
  isFeatured: false,
  isActive: true,
  order: 0,
  seo: { title: '', description: '', keywords: [] },
};

export default function CaseStudyForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'case-study', id],
    queryFn: () => caseStudyApi.getById(id),
    enabled: isEdit,
  });

  const { data: projectsList } = useQuery({
    queryKey: ['admin', 'projects', 'mini'],
    queryFn: () => projectApi.listAdmin({ limit: 100 }),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(caseStudySchema),
    defaultValues: emptyDefaults,
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'metrics' });

  useEffect(() => {
    if (existing?.data) {
      const d = existing.data;
      reset({
        ...emptyDefaults,
        ...d,
        project: d.project?._id || d.project || '',
        cover: d.cover || emptyDefaults.cover,
        seo: { ...emptyDefaults.seo, ...(d.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) => {
      const cleaned = { ...payload };
      if (!cleaned.project) delete cleaned.project;
      return isEdit ? caseStudyApi.update(id, cleaned) : caseStudyApi.create(cleaned);
    },
    onSuccess: (res) => {
      toast.success(isEdit ? 'Case study updated' : 'Case study created');
      qc.invalidateQueries({ queryKey: ['admin', 'case-studies'] });
      if (!isEdit) navigate(`/admin/case-studies/${res.data._id}/edit`, { replace: true });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
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
        <title>{isEdit ? 'Edit case study' : 'New case study'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit case study' : 'New case study'}
          actions={
            <>
              <Link to="/admin/case-studies" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || saveMut.isPending}
                className="btn-primary"
              >
                <Save size={16} />
                {isSubmitting || saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create'}
              </button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Basics</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField label="Title" required {...register('title')} error={errors.title?.message} />
                <FormField label="Slug" hint="Auto from title if blank" {...register('slug')} />
                <FormField label="Client" {...register('client')} />
                <FormField label="Industry" {...register('industry')} />
                <FormField label="Duration" placeholder="e.g. 8 weeks" {...register('duration')} />
                <FormField label="Team size" placeholder="e.g. 4 engineers" {...register('teamSize')} />
                <div className="sm:col-span-2">
                  <label className="mb-1 block text-xs font-semibold text-ink-700">
                    Linked project (optional)
                  </label>
                  <select className="input" {...register('project')}>
                    <option value="">— None —</option>
                    {projectsList?.data?.map((p) => (
                      <option key={p._id} value={p._id}>
                        {p.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Story</h3>
              <TextareaField
                label="The challenge"
                rows={3}
                {...register('challenge')}
                error={errors.challenge?.message}
              />
              <TextareaField
                label="Our solution"
                rows={3}
                {...register('solution')}
                error={errors.solution?.message}
              />
              <TextareaField
                label="The results"
                rows={3}
                {...register('results')}
                error={errors.results?.message}
              />
            </div>

            <div className="card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                  Key metrics
                </h3>
                <button
                  type="button"
                  onClick={() => append({ label: '', value: '' })}
                  className="btn-ghost px-2"
                >
                  <Plus size={14} /> Add
                </button>
              </div>
              {fields.length === 0 ? (
                <p className="text-sm text-ink-500">
                  Add metrics like &quot;3x faster checkout&quot; or &quot;21% revenue lift&quot;.
                </p>
              ) : (
                <div className="space-y-3">
                  {fields.map((f, idx) => (
                    <div key={f.id} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                      <input
                        className="input"
                        placeholder="Label (e.g. Conversion lift)"
                        {...register(`metrics.${idx}.label`)}
                      />
                      <input
                        className="input"
                        placeholder="Value (e.g. +21%)"
                        {...register(`metrics.${idx}.value`)}
                      />
                      <button
                        type="button"
                        onClick={() => remove(idx)}
                        className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                        aria-label="Remove metric"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Long-form content
              </h3>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="case-studies" />
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
                  <SwitchField label="Active" checked={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <SwitchField label="Featured" checked={field.value} onChange={field.onChange} />
                )}
              />
              <FormField label="Order" type="number" {...register('order', { valueAsNumber: true })} />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Cover image</h3>
              <Controller
                name="cover"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} folder="case-studies" />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
