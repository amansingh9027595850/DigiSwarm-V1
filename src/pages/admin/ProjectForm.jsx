import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import { projectApi } from '@/api/project.api';
import { projectSchema } from '@/schemas/project.schema';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';
import MultiImageUpload from '@/components/forms/MultiImageUpload';
import RichTextEditor from '@/components/forms/RichTextEditor';

const emptyDefaults = {
  title: '',
  slug: '',
  client: '',
  category: 'Web',
  tags: [],
  cover: { url: '', publicId: '' },
  gallery: [],
  stack: [],
  liveUrl: '',
  summary: '',
  content: '',
  year: new Date().getFullYear(),
  isFeatured: false,
  isActive: true,
  order: 0,
  seo: { title: '', description: '', keywords: [] },
};

export default function ProjectForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'project', id],
    queryFn: () => projectApi.getById(id),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        ...emptyDefaults,
        ...existing.data,
        cover: existing.data.cover || emptyDefaults.cover,
        seo: { ...emptyDefaults.seo, ...(existing.data.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) =>
      isEdit ? projectApi.update(id, payload) : projectApi.create(payload),
    onSuccess: (res) => {
      toast.success(isEdit ? 'Project updated' : 'Project created');
      qc.invalidateQueries({ queryKey: ['admin', 'projects'] });
      if (!isEdit) navigate(`/admin/projects/${res.data._id}/edit`, { replace: true });
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
        <title>{isEdit ? 'Edit project' : 'New project'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit project' : 'New project'}
          description={isEdit ? 'Update an existing project.' : 'Add a new portfolio entry.'}
          actions={
            <>
              <Link to="/admin/projects" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || saveMut.isPending}
                className="btn-primary"
              >
                <Save size={16} />
                {isSubmitting || saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create project'}
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
                <FormField label="Client" {...register('client')} />
                <FormField label="Category" required {...register('category')} error={errors.category?.message} />
                <FormField
                  label="Year"
                  type="number"
                  {...register('year', { valueAsNumber: true })}
                  error={errors.year?.message}
                />
                <FormField label="Live URL" type="url" placeholder="https://…" {...register('liveUrl')} error={errors.liveUrl?.message} />
              </div>
              <TextareaField
                label="Summary"
                required
                rows={3}
                {...register('summary')}
                error={errors.summary?.message}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Full content</h3>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="projects" />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Gallery</h3>
              <Controller
                name="gallery"
                control={control}
                render={({ field }) => (
                  <MultiImageUpload value={field.value || []} onChange={field.onChange} folder="projects" />
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
                  <SwitchField label="Active" hint="Show on portfolio" checked={field.value} onChange={field.onChange} />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <SwitchField label="Featured" hint="Highlight on the home strip" checked={field.value} onChange={field.onChange} />
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
                  <ImageUpload value={field.value} onChange={field.onChange} folder="projects" />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Tags & stack</h3>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput label="Tags" value={field.value || []} onChange={field.onChange} />
                )}
              />
              <Controller
                name="stack"
                control={control}
                render={({ field }) => (
                  <TagsInput label="Tech stack" value={field.value || []} onChange={field.onChange} />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
