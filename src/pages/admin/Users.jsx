import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Users as UsersIcon, KeyRound, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { userApi } from '@/api/user.api';
import { roleApi } from '@/api/role.api';
import {
  createUserSchema,
  updateUserSchema,
  resetUserPasswordSchema,
} from '@/schemas/user.schema';
import { selectUser } from '@/features/auth/authSlice';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import StatusBadge from '@/components/common/StatusBadge';
import Pagination from '@/components/common/Pagination';
import FormField from '@/components/forms/FormField';
import SwitchField from '@/components/forms/SwitchField';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

export default function Users() {
  const me = useSelector(selectUser);
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);
  const [openCreate, setOpenCreate] = useState(false);
  const [editing, setEditing] = useState(null);
  const [resetting, setResetting] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'users', { page, q }],
    queryFn: () => userApi.list({ page, limit: 15, q: q || undefined }),
    keepPreviousData: true,
  });

  const { data: rolesRes } = useQuery({
    queryKey: ['admin', 'roles'],
    queryFn: () => roleApi.list(),
  });
  const roles = rolesRes?.data || [];

  const removeMut = useMutation({
    mutationFn: (id) => userApi.remove(id),
    onSuccess: () => {
      toast.success('User deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'users'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  return (
    <>
      <Helmet>
        <title>Users — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Users"
          description="People with access to the admin dashboard."
          actions={
            <>
              <Link to="/admin/roles" className="btn-outline">
                Roles
              </Link>
              <button onClick={() => setOpenCreate(true)} className="btn-primary">
                <Plus size={16} /> New user
              </button>
            </>
          }
        />

        <div className="card p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name or email…"
              className="input pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={UsersIcon}
            title="No users match"
            description="Try a different search, or invite a new teammate."
            action={
              <button onClick={() => setOpenCreate(true)} className="btn-primary">
                <Plus size={16} /> New user
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((u) => (
              <div key={u._id} className="card p-5">
                <div className="flex items-start gap-3">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-brand-100 text-sm font-bold text-brand-700">
                    {initialsOf(u.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold text-ink-900">
                      {u.name}
                      {u._id === me?._id && (
                        <span className="ml-2 text-[10px] uppercase tracking-widest text-brand-700">
                          you
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-ink-500">{u.email}</p>
                    <div className="mt-2 flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-brand-700">
                        {u.role?.name || '—'}
                      </span>
                      <StatusBadge tone={u.isActive ? 'green' : 'gray'}>
                        {u.isActive ? 'Active' : 'Disabled'}
                      </StatusBadge>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-1">
                  <button
                    onClick={() => setResetting(u)}
                    className="btn-ghost p-2"
                    aria-label="Reset password"
                    title="Reset password"
                  >
                    <KeyRound size={14} />
                  </button>
                  <button
                    onClick={() => setEditing(u)}
                    className="btn-ghost p-2"
                    aria-label="Edit"
                  >
                    <Edit size={14} />
                  </button>
                  {u._id !== me?._id && (
                    <button
                      onClick={() => setToDelete(u)}
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

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <CreateUserModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        roles={roles}
        onSaved={() => qc.invalidateQueries({ queryKey: ['admin', 'users'] })}
      />
      <EditUserModal
        user={editing}
        onClose={() => setEditing(null)}
        roles={roles}
        onSaved={() => qc.invalidateQueries({ queryKey: ['admin', 'users'] })}
      />
      <ResetPasswordModal user={resetting} onClose={() => setResetting(null)} />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete ${toDelete?.name}?`}
        description="They will lose all admin access. This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}

function CreateUserModal({ open, onClose, roles, onSaved }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: { name: '', email: '', password: '', role: '', isActive: true },
  });

  useEffect(() => {
    if (open) reset({ name: '', email: '', password: '', role: '', isActive: true });
  }, [open, reset]);

  const saveMut = useMutation({
    mutationFn: (v) => userApi.create(v),
    onSuccess: () => {
      toast.success('User created');
      onSaved?.();
      onClose();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Create failed'),
  });

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="New user"
      description="Add a teammate to the admin dashboard."
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSubmit((v) => saveMut.mutate(v))}
            className="btn-primary"
            disabled={isSubmitting || saveMut.isPending}
          >
            {saveMut.isPending ? 'Saving…' : 'Create user'}
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
        <FormField
          label="Email"
          type="email"
          required
          {...register('email')}
          error={errors.email?.message}
        />
        <FormField
          label="Initial password"
          type="password"
          required
          {...register('password')}
          error={errors.password?.message}
        />
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select className="input" {...register('role')} aria-invalid={!!errors.role}>
            <option value="">— Pick a role —</option>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
        </div>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <SwitchField label="Active" checked={field.value} onChange={field.onChange} />
          )}
        />
      </form>
    </Modal>
  );
}

function EditUserModal({ user, onClose, roles, onSaved }) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(updateUserSchema),
    defaultValues: { name: '', role: '', isActive: true },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        role: user.role?._id || '',
        isActive: !!user.isActive,
      });
    }
  }, [user, reset]);

  const saveMut = useMutation({
    mutationFn: (v) => userApi.update(user._id, v),
    onSuccess: () => {
      toast.success('User updated');
      onSaved?.();
      onClose();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  return (
    <Modal
      open={!!user}
      onClose={onClose}
      title="Edit user"
      description={user?.email}
      size="lg"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSubmit((v) => saveMut.mutate(v))}
            className="btn-primary"
            disabled={isSubmitting || saveMut.isPending}
          >
            {saveMut.isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit((v) => saveMut.mutate(v))}>
        <FormField label="Name" required {...register('name')} error={errors.name?.message} />
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-700">
            Role <span className="text-red-500">*</span>
          </label>
          <select className="input" {...register('role')}>
            {roles.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
          {errors.role && <p className="mt-1 text-xs text-red-600">{errors.role.message}</p>}
        </div>
        <Controller
          name="isActive"
          control={control}
          render={({ field }) => (
            <SwitchField label="Active" checked={field.value} onChange={field.onChange} />
          )}
        />
      </form>
    </Modal>
  );
}

function ResetPasswordModal({ user, onClose }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetUserPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (user) reset({ password: '', confirmPassword: '' });
  }, [user, reset]);

  const mut = useMutation({
    mutationFn: (v) => userApi.resetPassword(user._id, { password: v.password }),
    onSuccess: () => {
      toast.success('Password reset — share the new one securely');
      onClose();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Reset failed'),
  });

  return (
    <Modal
      open={!!user}
      onClose={onClose}
      title={user ? `Reset password for ${user.name}` : ''}
      description="Their refresh sessions will be revoked."
      size="md"
      footer={
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-outline">
            Cancel
          </button>
          <button
            onClick={handleSubmit((v) => mut.mutate(v))}
            className="btn-primary"
            disabled={isSubmitting || mut.isPending}
          >
            {mut.isPending ? 'Resetting…' : 'Reset password'}
          </button>
        </div>
      }
    >
      <form className="space-y-4" noValidate onSubmit={handleSubmit((v) => mut.mutate(v))}>
        <FormField
          label="New password"
          type="password"
          required
          {...register('password')}
          error={errors.password?.message}
        />
        <FormField
          label="Confirm password"
          type="password"
          required
          {...register('confirmPassword')}
          error={errors.confirmPassword?.message}
        />
      </form>
    </Modal>
  );
}
