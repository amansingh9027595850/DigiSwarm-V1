import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Tag } from 'lucide-react';

import { blogCategoryApi } from '@/api/blogCategory.api';
import { blogCategorySchema } from '@/schemas/blogCategory.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';

const emptyDefaults = {
  name: '',
  slug: '',
  description: '',
  color: '#1f44f5',
  order: 0,
  isActive: true,
};

export default function BlogCategories() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);
  const [open, setOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'blog-categories'],
    queryFn: () => blogCategoryApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(blogCategorySchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? blogCategoryApi.update(editing._id, payload) : blogCategoryApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Category updated' : 'Category created');
      qc.invalidateQueries({ queryKey: ['admin', 'blog-categories'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => blogCategoryApi.remove(id),
    onSuccess: () => {
      toast.success('Category deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'blog-categories'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (cat) => {
    setEditing(cat);
    reset({ ...emptyDefaults, ...cat });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const color = watch('color');

  return (
    <>
      <Helmet>
        <title>Blog categories — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Blog categories"
          description="Group your articles into clear themes for readers and SEO."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New category
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Tag}
            title="No categories yet"
            description="Add a category before publishing your first article."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New category
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((c) => (
              <div key={c._id} className="card flex items-center justify-between gap-3 p-5">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white font-bold"
                    style={{ backgroundColor: c.color }}
                  >
                    #{c.name[0]?.toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{c.name}</p>
                    <p className="truncate text-xs text-ink-500">/{c.slug}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="btn-ghost p-2"
                    aria-label="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => setToDelete(c)}
                    className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={16} />
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
        title={editing ? 'Edit category' : 'New category'}
        size="lg"
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create category'}
            </button>
          </div>
        }
      >
        <form
          onSubmit={handleSubmit((v) => saveMut.mutate(v))}
          className="space-y-4"
          noValidate
        >
          <FormField label="Name" required {...register('name')} error={errors.name?.message} />
          <FormField label="Slug" hint="Auto from name if blank" {...register('slug')} />
          <TextareaField
            label="Description"
            rows={2}
            {...register('description')}
            error={errors.description?.message}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={color || '#1f44f5'}
                  onChange={(e) => setValue('color', e.target.value)}
                  className="h-10 w-12 cursor-pointer rounded-lg border border-ink-200 bg-white p-1"
                />
                <input
                  {...register('color')}
                  className="input"
                  placeholder="#1f44f5"
                  aria-invalid={!!errors.color}
                />
              </div>
              {errors.color && (
                <p className="mt-1 text-xs text-red-600">{errors.color.message}</p>
              )}
            </div>
            <FormField
              label="Order"
              type="number"
              {...register('order', { valueAsNumber: true })}
            />
          </div>
          <SwitchField
            label="Active"
            hint="Inactive categories are hidden from the public site"
            checked={watch('isActive')}
            onChange={(v) => setValue('isActive', v)}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete "${toDelete?.name}"?`}
        description="Categories with existing articles cannot be deleted — move or remove those articles first."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}
