import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search } from 'lucide-react';

import { seoApi } from '@/api/seoMeta.api';
import { seoMetaSchema } from '@/schemas/seoMeta.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';
import SwitchField from '@/components/forms/SwitchField';

const emptyDefaults = {
  path: '/',
  title: '',
  description: '',
  keywords: [],
  ogImage: '',
  canonical: '',
  noindex: false,
};

export default function Seo() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'seo'],
    queryFn: () => seoApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(seoMetaSchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? seoApi.update(editing._id, payload) : seoApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Override updated' : 'Override added');
      qc.invalidateQueries({ queryKey: ['admin', 'seo'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => seoApi.remove(id),
    onSuccess: () => {
      toast.success('Override removed');
      qc.invalidateQueries({ queryKey: ['admin', 'seo'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (s) => {
    setEditing(s);
    reset({ ...emptyDefaults, ...s });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>SEO — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="SEO overrides"
          description="Per-route title, description, OG image, and indexing rules."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New override
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Search}
            title="No SEO overrides yet"
            description="Pages use their own defaults. Add an override to customize what search engines and social platforms see."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New override
              </button>
            }
          />
        ) : (
          <div className="space-y-2">
            {data.data.map((s) => (
              <div
                key={s._id}
                className="card flex items-start justify-between gap-3 p-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <code className="rounded-md bg-ink-50 px-2 py-0.5 text-xs font-semibold text-ink-800">
                      {s.path}
                    </code>
                    {s.noindex && (
                      <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-red-700">
                        Noindex
                      </span>
                    )}
                  </div>
                  {s.title && (
                    <p className="mt-1 truncate text-sm font-semibold text-ink-900">{s.title}</p>
                  )}
                  {s.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-ink-600">{s.description}</p>
                  )}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openEdit(s)} className="btn-ghost p-2" aria-label="Edit">
                    <Edit size={14} />
                  </button>
                  <button
                    onClick={() => setToDelete(s)}
                    className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit SEO override' : 'New SEO override'}
        size="xl"
        footer={
          <div className="flex justify-end gap-2">
            <button onClick={closeModal} className="btn-outline">
              Cancel
            </button>
            <button
              onClick={handleSubmit((v) => saveMut.mutate(v))}
              className="btn-primary"
              disabled={isSubmitting || saveMut.isPending}
            >
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add override'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <FormField
            label="Path"
            required
            placeholder="/about"
            hint="The route to override (must start with /)"
            {...register('path')}
            error={errors.path?.message}
          />
          <FormField label="SEO title" {...register('title')} error={errors.title?.message} />
          <TextareaField
            label="Meta description"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />
          <Controller
            name="keywords"
            control={control}
            render={({ field }) => (
              <TagsInput
                label="Keywords"
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Add keyword and press Enter"
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="OG image URL"
              type="url"
              placeholder="https://"
              {...register('ogImage')}
              error={errors.ogImage?.message}
            />
            <FormField
              label="Canonical URL"
              type="url"
              placeholder="https://"
              {...register('canonical')}
              error={errors.canonical?.message}
            />
          </div>
          <Controller
            name="noindex"
            control={control}
            render={({ field }) => (
              <SwitchField
                label="Hide from search engines"
                hint="Sends noindex,nofollow"
                checked={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Remove override for "${toDelete?.path}"?`}
        description="The page will fall back to its built-in SEO defaults."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
