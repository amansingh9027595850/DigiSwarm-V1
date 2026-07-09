import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import { serviceApi } from '@/api/service.api';
import { serviceSchema } from '@/schemas/service.schema';
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
  shortDesc: '',
  fullDesc: '',
  icon: '',
  banner: { url: '', publicId: '' },
  technologies: [],
  isFeatured: false,
  isActive: true,
  order: 0,
  seo: { title: '', description: '', keywords: [] },
};

export default function ServiceForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'service', id],
    queryFn: () => serviceApi.getById(id),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing?.data) {
      reset({
        ...emptyDefaults,
        ...existing.data,
        banner: existing.data.banner || emptyDefaults.banner,
        seo: { ...emptyDefaults.seo, ...(existing.data.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) =>
      isEdit ? serviceApi.update(id, payload) : serviceApi.create(payload),
    onSuccess: (res) => {
      toast.success(isEdit ? 'Service updated' : 'Service created');
      qc.invalidateQueries({ queryKey: ['admin', 'services'] });
      if (!isEdit) navigate(`/admin/services/${res.data._id}/edit`, { replace: true });
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
        <title>{isEdit ? 'Edit service' : 'New service'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit service' : 'New service'}
          description={isEdit ? 'Update an existing service.' : 'Add a new service offering.'}
          actions={
            <>
              <Link to="/admin/services" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button type="submit" disabled={isSubmitting || saveMut.isPending} className="btn-primary">
                <Save size={16} />
                {isSubmitting || saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create service'}
              </button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Basics</h3>
              <FormField
                label="Title"
                required
                placeholder="e.g. Web Development"
                {...register('title')}
                error={errors.title?.message}
              />
              <FormField
                label="Slug"
                hint="Auto-generated from title if left blank"
                placeholder="web-development"
                {...register('slug')}
                error={errors.slug?.message}
              />
              <TextareaField
                label="Short description"
                required
                rows={3}
                placeholder="One-liner shown in lists and cards (max 280 chars)"
                {...register('shortDesc')}
                error={errors.shortDesc?.message}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Detailed content</h3>
              <Controller
                name="fullDesc"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="services" />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">SEO</h3>
              <FormField
                label="SEO title"
                hint="Falls back to the service title"
                {...register('seo.title')}
              />
              <TextareaField
                label="SEO description"
                rows={3}
                hint="Falls back to short description"
                {...register('seo.description')}
              />
              <Controller
                name="seo.keywords"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    label="SEO keywords"
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Add keyword and press Enter"
                  />
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
                    hint="Show this service on the public site"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Featured"
                    hint="Highlight on the homepage"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <FormField
                label="Order"
                type="number"
                hint="Lower = earlier in lists"
                {...register('order', { valueAsNumber: true })}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Banner image</h3>
              <Controller
                name="banner"
                control={control}
                render={({ field }) => (
                  <ImageUpload
                    value={field.value}
                    onChange={field.onChange}
                    folder="services"
                    hint="Used on the service detail hero"
                  />
                )}
              />
              <FormField
                label="Icon name"
                hint="Lucide icon name e.g. Globe, Cloud"
                {...register('icon')}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Technologies</h3>
              <Controller
                name="technologies"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="React, Node, AWS…"
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
