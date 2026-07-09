import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react';

import { faqApi } from '@/api/faq.api';
import { faqSchema } from '@/schemas/faq.schema';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Loader from '@/components/common/Loader';
import Modal from '@/components/common/Modal';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';

const emptyDefaults = {
  question: '',
  answer: '',
  category: 'General',
  order: 0,
  isActive: true,
};

export default function Faqs() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'faqs'],
    queryFn: () => faqApi.listAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(faqSchema), defaultValues: emptyDefaults });

  const saveMut = useMutation({
    mutationFn: (payload) =>
      editing ? faqApi.update(editing._id, payload) : faqApi.create(payload),
    onSuccess: () => {
      toast.success(editing ? 'FAQ updated' : 'FAQ added');
      qc.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      closeModal();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => faqApi.remove(id),
    onSuccess: () => {
      toast.success('FAQ removed');
      qc.invalidateQueries({ queryKey: ['admin', 'faqs'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const openNew = () => {
    setEditing(null);
    reset(emptyDefaults);
    setOpen(true);
  };
  const openEdit = (f) => {
    setEditing(f);
    reset({ ...emptyDefaults, ...f });
    setOpen(true);
  };
  const closeModal = () => {
    setOpen(false);
    setEditing(null);
  };

  const groups = (data?.data || []).reduce((acc, f) => {
    const cat = f.category || 'General';
    acc[cat] = acc[cat] || [];
    acc[cat].push(f);
    return acc;
  }, {});

  return (
    <>
      <Helmet>
        <title>FAQs — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="FAQs"
          description="Questions and answers shown on the public site."
          actions={
            <button onClick={openNew} className="btn-primary">
              <Plus size={16} /> New FAQ
            </button>
          }
        />

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={HelpCircle}
            title="No FAQs yet"
            description="Add the first one to start helping visitors before they ask."
            action={
              <button onClick={openNew} className="btn-primary">
                <Plus size={16} /> New FAQ
              </button>
            }
          />
        ) : (
          <div className="space-y-6">
            {Object.entries(groups).map(([cat, items]) => (
              <div key={cat}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-ink-500">
                  {cat}
                </p>
                <div className="space-y-2">
                  {items.map((f) => (
                    <div key={f._id} className="card flex items-start justify-between gap-3 p-4">
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-ink-900">{f.question}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-ink-600">{f.answer}</p>
                        {!f.isActive && (
                          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-ink-500">
                            Inactive
                          </p>
                        )}
                      </div>
                      <div className="flex shrink-0 gap-1">
                        <button
                          onClick={() => openEdit(f)}
                          className="btn-ghost p-2"
                          aria-label="Edit"
                        >
                          <Edit size={14} />
                        </button>
                        <button
                          onClick={() => setToDelete(f)}
                          className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                          aria-label="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal
        open={open}
        onClose={closeModal}
        title={editing ? 'Edit FAQ' : 'New FAQ'}
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
              {saveMut.isPending ? 'Saving…' : editing ? 'Save changes' : 'Add FAQ'}
            </button>
          </div>
        }
      >
        <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-4" noValidate>
          <FormField
            label="Question"
            required
            {...register('question')}
            error={errors.question?.message}
          />
          <TextareaField
            label="Answer"
            required
            rows={5}
            {...register('answer')}
            error={errors.answer?.message}
          />
          <div className="grid gap-4 sm:grid-cols-3">
            <FormField label="Category" {...register('category')} />
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
        title="Remove this FAQ?"
        description="This cannot be undone."
        confirmLabel="Remove"
        loading={removeMut.isPending}
      />
    </>
  );
}
