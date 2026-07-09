import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Users, Linkedin, Github, Twitter, Globe } from 'lucide-react';

import { teamApi } from '@/api/teamMember.api';
import { teamMemberSchema } from '@/schemas/teamMember.schema';
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
  name: '',
  role: '',
  bio: '',
  photo: { url: '', publicId: '' },
  socials: { linkedin: '', github: '', twitter: '', website: '' },
  order: 0,
  isActive: true,
};

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

export default function Team() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'team'],
    queryFn: () => teamApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(teamMemberSchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? teamApi.update(editing._id, payload) : teamApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Team member updated' : 'Team member added');
      qc.invalidateQueries({ queryKey: ['admin', 'team'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => teamApi.remove(id),
    onSuccess: () => {
      toast.success('Team member removed');
      qc.invalidateQueries({ queryKey: ['admin', 'team'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (m) => {
    setEditing(m);
    reset({
      ...emptyDefaults,
      ...m,
      photo: m.photo || emptyDefaults.photo,
      socials: { ...emptyDefaults.socials, ...(m.socials || {}) },
    });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>Team — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Team"
          description="People on the public About page."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New member
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Users}
            title="No team members yet"
            description="Add your first team member to populate the About page."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New member
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {data.data.map((m) => (
              <div key={m._id} className="card overflow-hidden">
                <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-100 to-ink-100">
                  {m.photo?.url ? (
                    <img src={m.photo.url} alt={m.name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-3xl font-extrabold text-brand-700">
                      {initialsOf(m.name)}
                    </div>
                  )}
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button
                      onClick={() => openEdit(m)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/95 text-ink-700 shadow-soft"
                      aria-label="Edit"
                    >
                      <Edit size={13} />
                    </button>
                    <button
                      onClick={() => setToDelete(m)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/95 text-red-600 shadow-soft"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                  {!m.isActive && (
                    <span className="absolute left-2 top-2 rounded-full bg-ink-900/70 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                      Inactive
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="font-bold text-ink-900">{m.name}</p>
                  <p className="text-xs text-ink-500">{m.role}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit team member' : 'New team member'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add member'}
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
                label="Photo"
                value={field.value}
                onChange={field.onChange}
                folder="team"
              />
            )}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField label="Name" required {...register('name')} error={errors.name?.message} />
            <FormField label="Role" required {...register('role')} error={errors.role?.message} />
          </div>
          <TextareaField label="Bio" rows={4} {...register('bio')} error={errors.bio?.message} />

          <p className="pt-2 text-xs font-bold uppercase tracking-widest text-ink-500">Social links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="LinkedIn"
              type="url"
              placeholder="https://linkedin.com/in/…"
              {...register('socials.linkedin')}
              error={errors.socials?.linkedin?.message}
            />
            <FormField
              label="GitHub"
              type="url"
              placeholder="https://github.com/…"
              {...register('socials.github')}
              error={errors.socials?.github?.message}
            />
            <FormField
              label="Twitter"
              type="url"
              placeholder="https://twitter.com/…"
              {...register('socials.twitter')}
              error={errors.socials?.twitter?.message}
            />
            <FormField
              label="Website"
              type="url"
              placeholder="https://"
              {...register('socials.website')}
              error={errors.socials?.website?.message}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Order"
              type="number"
              {...register('order', { valueAsNumber: true })}
            />
            <Controller
              name="isActive"
              control={control}
              render={({ field }) => (
                <SwitchField
                  label="Active"
                  hint="Show on the About page"
                  checked={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Remove ${toDelete?.name}?`}
        description="Their photo will be removed from storage. This cannot be undone."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
