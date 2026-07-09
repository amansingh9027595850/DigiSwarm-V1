import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Building2 } from 'lucide-react';

import { clientLogoApi } from '@/api/clientLogo.api';
import { clientLogoSchema } from '@/schemas/clientLogo.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';

const emptyDefaults = {
  name: '',
  logo: { url: '', publicId: '' },
  website: '',
  order: 0,
  isActive: true,
};

export default function ClientLogos() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'client-logos'],
    queryFn: () => clientLogoApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(clientLogoSchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? clientLogoApi.update(editing._id, payload) : clientLogoApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Logo updated' : 'Logo added');
      qc.invalidateQueries({ queryKey: ['admin', 'client-logos'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => clientLogoApi.remove(id),
    onSuccess: () => {
      toast.success('Logo removed');
      qc.invalidateQueries({ queryKey: ['admin', 'client-logos'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (c) => {
    setEditing(c);
    reset({ ...emptyDefaults, ...c, logo: c.logo || emptyDefaults.logo });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>Client logos — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Client logos"
          description="Logos shown in the trusted-by strip on the homepage."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New logo
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Building2}
            title="No client logos yet"
            description="Add a logo to populate the homepage trusted-by strip."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New logo
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {data.data.map((c) => (
              <div key={c._id} className="card relative p-5">
                <div className="absolute right-2 top-2 flex gap-1">
                  <button
                    onClick={() => openEdit(c)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-ink-700 shadow-soft hover:bg-ink-50"
                    aria-label="Edit"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setToDelete(c)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-red-600 shadow-soft hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                <div className="grid h-20 place-items-center">
                  {c.logo?.url ? (
                    <img
                      src={c.logo.url}
                      alt={c.name}
                      className="max-h-12 max-w-full object-contain"
                    />
                  ) : (
                    <Building2 className="text-ink-300" size={32} />
                  )}
                </div>
                <p className="mt-3 text-center text-sm font-semibold text-ink-900">{c.name}</p>
                {!c.isActive && (
                  <p className="mt-1 text-center text-[10px] font-semibold uppercase tracking-widest text-ink-500">
                    Inactive
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit logo' : 'New client logo'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add logo'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <Controller
            name="logo"
            control={control}
            render={({ field }) => (
              <ImageUpload
                label="Logo"
                value={field.value}
                onChange={field.onChange}
                folder="client-logos"
                error={errors.logo?.url?.message}
              />
            )}
          />
          <FormField label="Name" required {...register('name')} error={errors.name?.message} />
          <FormField
            label="Website"
            type="url"
            placeholder="https://"
            {...register('website')}
            error={errors.website?.message}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Order" type="number" {...register('order', { valueAsNumber: true })} />
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
        title={`Remove "${toDelete?.name}"?`}
        description="The logo image will be removed from storage."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
