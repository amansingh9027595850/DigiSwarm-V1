import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Sparkles, DollarSign } from 'lucide-react';

import { pricingApi } from '@/api/pricingPlan.api';
import { pricingPlanSchema } from '@/schemas/pricingPlan.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';
import ArrayInput from '@/components/forms/ArrayInput';

const emptyDefaults = {
  name: '',
  tagline: '',
  price: '',
  billingCycle: '',
  features: [],
  cta: { label: 'Get started', link: '/get-quote' },
  isHighlighted: false,
  isActive: true,
  order: 0,
};

export default function PricingPlans() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'pricing'],
    queryFn: () => pricingApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(pricingPlanSchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? pricingApi.update(editing._id, payload) : pricingApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'Plan updated' : 'Plan added');
      qc.invalidateQueries({ queryKey: ['admin', 'pricing'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => pricingApi.remove(id),
    onSuccess: () => {
      toast.success('Plan removed');
      qc.invalidateQueries({ queryKey: ['admin', 'pricing'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (p) => {
    setEditing(p);
    reset({ ...emptyDefaults, ...p, cta: { ...emptyDefaults.cta, ...(p.cta || {}) } });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  return (
    <>
      <Helmet>
        <title>Pricing plans — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Pricing plans"
          description="Plans shown on the public Pricing page."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New plan
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={DollarSign}
            title="No plans yet"
            description="Add your first plan to populate the Pricing page."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New plan
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((p) => (
              <div
                key={p._id}
                className={`card relative p-6 ${p.isHighlighted ? 'border-brand-300 ring-2 ring-brand-100' : ''}`}
              >
                <div className="absolute right-3 top-3 flex gap-1">
                  <button
                    onClick={() => openEdit(p)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-ink-700 shadow-soft hover:bg-ink-50"
                    aria-label="Edit"
                  >
                    <Edit size={13} />
                  </button>
                  <button
                    onClick={() => setToDelete(p)}
                    className="grid h-7 w-7 place-items-center rounded-md bg-white text-red-600 shadow-soft hover:bg-red-50"
                    aria-label="Delete"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
                {p.isHighlighted && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-white">
                    <Sparkles size={10} /> Popular
                  </span>
                )}
                <h3 className="mt-3 text-lg font-extrabold text-ink-900">{p.name}</h3>
                <p className="text-xs text-ink-500">{p.tagline}</p>
                <p className="mt-4 text-3xl font-extrabold text-ink-900">
                  {p.price}
                  {p.billingCycle && (
                    <span className="ml-1 text-sm font-medium text-ink-500">/ {p.billingCycle}</span>
                  )}
                </p>
                <ul className="mt-4 space-y-1 text-sm text-ink-700">
                  {(p.features || []).slice(0, 5).map((f, i) => (
                    <li key={i}>• {f}</li>
                  ))}
                  {p.features?.length > 5 && (
                    <li className="text-xs text-ink-500">+{p.features.length - 5} more</li>
                  )}
                </ul>
                {!p.isActive && (
                  <p className="mt-3 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
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
        title={editing ? 'Edit plan' : 'New pricing plan'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add plan'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              label="Name"
              required
              {...register('name')}
              error={errors.name?.message}
            />
            <FormField label="Tagline" {...register('tagline')} />
            <FormField
              label="Price"
              required
              placeholder="$2,500 or Contact us"
              {...register('price')}
              error={errors.price?.message}
            />
            <FormField label="Billing cycle" placeholder="month / project / etc." {...register('billingCycle')} />
            <FormField label="CTA label" {...register('cta.label')} />
            <FormField label="CTA link" {...register('cta.link')} />
          </div>

          <Controller
            name="features"
            control={control}
            render={({ field }) => (
              <ArrayInput
                label="Features"
                value={field.value || []}
                onChange={field.onChange}
                placeholder="Unlimited revisions"
                addLabel="Add feature"
              />
            )}
          />

          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Order" type="number" {...register('order', { valueAsNumber: true })} />
            <Controller
              name="isHighlighted"
              control={control}
              render={({ field }) => (
                <SwitchField label="Highlighted" hint="Mark as the popular plan" checked={field.value} onChange={field.onChange} />
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
        title={`Remove "${toDelete?.name}"?`}
        description="This cannot be undone."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
