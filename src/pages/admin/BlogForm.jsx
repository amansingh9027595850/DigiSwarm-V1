import { useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, Save } from 'lucide-react';

import { blogApi } from '@/api/blog.api';
import { blogCategoryApi } from '@/api/blogCategory.api';
import { blogSchema } from '@/schemas/blog.schema';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';
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
  excerpt: '',
  content: '',
  cover: { url: '', publicId: '' },
  category: '',
  tags: [],
  status: 'draft',
  publishedAt: '',
  isFeatured: false,
  isActive: true,
  seo: { title: '', description: '', keywords: [] },
};

export default function BlogForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'blog', id],
    queryFn: () => blogApi.getById(id),
    enabled: isEdit,
  });

  const { data: categoriesRes } = useQuery({
    queryKey: ['admin', 'blog-categories'],
    queryFn: () => blogCategoryApi.listAdmin(),
  });
  const categories = categoriesRes?.data || [];

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(blogSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (existing?.data) {
      const b = existing.data;
      reset({
        ...emptyDefaults,
        ...b,
        category: b.category?._id || b.category || '',
        cover: b.cover || emptyDefaults.cover,
        publishedAt: toLocalInput(b.publishedAt),
        seo: { ...emptyDefaults.seo, ...(b.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) => {
      const cleaned = { ...payload };
      if (cleaned.publishedAt) cleaned.publishedAt = new Date(cleaned.publishedAt).toISOString();
      else delete cleaned.publishedAt;
      return isEdit ? blogApi.update(id, cleaned) : blogApi.create(cleaned);
    },
    onSuccess: (res) => {
      toast.success(isEdit ? 'Article saved' : 'Article created');
      qc.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      if (!isEdit) navigate(`/admin/blogs/${res.data._id}/edit`, { replace: true });
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

  const noCategories = useMemo(() => categories.length === 0, [categories]);

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
        <title>{isEdit ? 'Edit article' : 'New article'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit article' : 'New article'}
          description={isEdit ? 'Refine and republish.' : 'Draft a new article.'}
          actions={
            <>
              <Link to="/admin/blogs" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting || saveMut.isPending}
              >
                <Save size={16} />
                {saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create article'}
              </button>
            </>
          }
        />

        {noCategories && (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            You need at least one active category before publishing.{' '}
            <Link to="/admin/blog-categories" className="font-semibold underline">
              Create one
            </Link>
            .
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Basics</h3>
              <FormField
                label="Title"
                required
                {...register('title')}
                error={errors.title?.message}
              />
              <FormField label="Slug" hint="Auto from title if blank" {...register('slug')} />
              <TextareaField
                label="Excerpt"
                required
                rows={3}
                hint="Shown in list cards and used as fallback for SEO description"
                {...register('excerpt')}
                error={errors.excerpt?.message}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Content</h3>
              <Controller
                name="content"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="blogs" />
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
                  <TagsInput
                    label="SEO keywords"
                    value={field.value || []}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Publishing</h3>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-700">Status</label>
                <select className="input" {...register('status')}>
                  <option value="draft">Draft</option>
                  <option value="published">Published / Scheduled</option>
                </select>
                <p className="mt-1 text-xs text-ink-500">
                  If status is published with a future date, it stays scheduled until then.
                </p>
              </div>
              <FormField
                label="Publish date"
                type="datetime-local"
                hint="Leave blank to publish immediately on save"
                {...register('publishedAt')}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Featured"
                    hint="Highlight on the blog index"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Active"
                    hint="Inactive articles never appear publicly, even if published"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Category & tags</h3>
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select className="input" {...register('category')} aria-invalid={!!errors.category}>
                  <option value="">— Pick a category —</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
                )}
              </div>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    label="Tags"
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="react, performance…"
                  />
                )}
              />
            </div>

            <div className="card p-6 space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Cover image</h3>
              <Controller
                name="cover"
                control={control}
                render={({ field }) => (
                  <ImageUpload value={field.value} onChange={field.onChange} folder="blogs" />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
