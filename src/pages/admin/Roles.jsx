import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

import { roleApi } from '@/api/role.api';
import { roleSchema } from '@/schemas/user.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import TagsInput from '@/components/forms/TagsInput';

const emptyDefaults = { name: '', description: '', permissions: [] };

export default function Roles() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => roleApi.list(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(roleSchema), defaultValues: emptyDefaults });

  useEffect(() => {
    if (open) {
      reset(
        editing
          ? {
              name: editing.name,
              description: editing.description,
              permissions: editing.permissions || [],
            }
          : emptyDefaults,
      );
    }
  }, [open, editing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? roleApi.update(editing._id, payload) : roleApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Role updated' : 'Role created');
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => roleApi.remove(id),
    onSuccess: () => {
      toast.success('Role deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'roles'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    setOpen(true);
  };
  const openEdit = (r) => {
    setEditing(r);
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>Roles — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Roles"
          description="Permissions are enforced at the API. System roles are read-mostly."
          actions={
            <>
              <Link to="/admin/users" className="btn-outline">
                Users
              </Link>
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New role
              </button>
            </>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={Shield}
            title="No roles yet"
            description="Roles control what each user can do in the admin."
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((r) => (
              <div key={r._id} className="card p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="grid h-9 w-9 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <Shield size={16} />
                    </div>
                    <p className="font-bold text-ink-900 capitalize">{r.name}</p>
                  </div>
                  {r.isSystem && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-600">
                      <Lock size={9} /> System
                    </span>
                  )}
                </div>
                {r.description && (
                  <p className="mt-3 text-sm text-ink-600">{r.description}</p>
                )}
                <div className="mt-4 flex flex-wrap gap-1">
                  {(r.permissions || []).slice(0, 6).map((p) => (
                    <span
                      key={p}
                      className="rounded-md bg-ink-50 px-2 py-0.5 font-mono text-[10px] text-ink-700"
                    >
                      {p}
                    </span>
                  ))}
                  {r.permissions?.length > 6 && (
                    <span className="text-[10px] text-ink-500">
                      +{r.permissions.length - 6} more
                    </span>
                  )}
                </div>
                <div className="mt-4 flex justify-end gap-1">
                  <button
                    onClick={() => openEdit(r)}
                    className="btn-ghost p-2"
                    aria-label="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  {!r.isSystem && (
                    <button
                      onClick={() => setToDelete(r)}
                      className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
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
        title={editing ? `Edit "${editing.name}"` : 'New role'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Create role'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <FormField
            label="Name"
            required
            hint="Lowercase letters, numbers, dashes or underscores"
            placeholder="content-editor"
            disabled={editing?.isSystem}
            {...register('name')}
            error={errors.name?.message}
          />
          <TextareaField
            label="Description"
            rows={3}
            {...register('description')}
            error={errors.description?.message}
          />
          <Controller
            name="permissions"
            control={control}
            render={({ field }) => (
              <TagsInput
                label="Permissions"
                value={field.value || []}
                onChange={field.onChange}
                placeholder="resource:action e.g. blog:create"
                hint="Free-form. Enforcement is at the API."
              />
            )}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete "${toDelete?.name}"?`}
        description="Roles in use by any user cannot be deleted."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}
