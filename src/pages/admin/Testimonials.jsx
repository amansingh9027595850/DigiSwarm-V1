import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Star } from 'lucide-react';
import clsx from 'clsx';

import { testimonialApi } from '@/api/testimonial.api';
import { testimonialSchema } from '@/schemas/testimonial.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';

const emptyDefaults = {
  clientName: '',
  clientRole: '',
  company: '',
  photo: { url: '', publicId: '' },
  rating: 5,
  content: '',
  isFeatured: false,
  isActive: true,
  order: 0,
};

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

export default function Testimonials() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: () => testimonialApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(testimonialSchema), defaultValues: emptyDefaults });

  const rating = watch('rating');

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? testimonialApi.update(editing._id, payload) : testimonialApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Testimonial updated' : 'Testimonial added');
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => testimonialApi.remove(id),
    onSuccess: () => {
      toast.success('Testimonial removed');
      qc.invalidateQueries({ queryKey: ['admin', 'testimonials'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (t) => {
    setEditing(t);
    reset({ ...emptyDefaults, ...t, photo: t.photo || emptyDefaults.photo });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>Testimonials — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Testimonials"
          description="Client quotes shown on the homepage."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New testimonial
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Star}
            title="No testimonials yet"
            description="Add your first one — it will appear on the homepage."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New testimonial
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((t) => (
              <div key={t._id} className="card relative p-5">
                <div className="absolute right-3 top-3 flex gap-1">
                  <button
                    onClick={() => openEdit(t)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-ink-700 shadow-soft hover:bg-ink-50"
                    aria-label="Edit"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setToDelete(t)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-red-600 shadow-soft hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                <div className="flex gap-0.5">
                  {[...Array(t.rating)].map((_, k) => (
                    <Star key={k} size={13} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-ink-700">
                  “{t.content}”
                </p>
                <div className="mt-4 flex items-center gap-3 border-t border-ink-100 pt-4">
                  {t.photo?.url ? (
                    <img
                      src={t.photo.url}
                      alt={t.clientName}
                      className="h-9 w-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="grid h-9 w-9 place-items-center rounded-full bg-brand-100 text-[11px] font-bold text-brand-700">
                      {initialsOf(t.clientName)}
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900">{t.clientName}</p>
                    <p className="truncate text-xs text-ink-500">
                      {[t.clientRole, t.company].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1">
                  {!t.isActive && (
                    <span className="rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                      Inactive
                    </span>
                  )}
                  {t.isFeatured && (
                    <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-700">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit testimonial' : 'New testimonial'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add testimonial'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <Controller
            name="photo"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Photo (optional)"
                value={field.value}
                onChange={field.onChange}
                folder="testimonials"
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Client name"
              required
              {...register('clientName')}
              error={errors.clientName?.message}
            />
            <FormField label="Role" {...register('clientRole')} />
            <FormField label="Company" {...register('company')} />
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">Rating</label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setValue('rating', n, { shouldValidate: true })}
                    aria-label={`${n} stars`}
                  >
                    <Star
                      size={22}
                      className={clsx(
                        n <= rating ? 'fill-amber-400 text-amber-400' : 'text-ink-300',
                      )}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <TextareaField
            label="Content"
            required
            rows={4}
            {...register('content')}
            error={errors.content?.message}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Order" type="number" {...register('order', { valueAsNumber: true })} />
            <Controller
              name="isFeatured"
              control={control}
              render={({ field }) => (
                <SwitchField label="Featured" checked={field.value} onChange={field.onChange} />
              )}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <SwitchField label="Active" checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Remove testimonial from ${toDelete?.clientName}?`}
        description="Their photo will be removed from storage. This cannot be undone."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
