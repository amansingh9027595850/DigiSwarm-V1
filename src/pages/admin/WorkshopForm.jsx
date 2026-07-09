import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { ArrowLeft, Save } from 'lucide-react';

import { workshopApi } from '@/api/workshop.api';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';
import ArrayInput from '@/components/forms/ArrayInput';
import RichTextEditor from '@/components/forms/RichTextEditor';
import TagsInput from '@/components/forms/TagsInput';

const workshopFormSchema = z.object({
  title: z.string().min(2, 'Title is required').max(200),
  slug: z.string().max(200).optional().or(z.literal('')),
  tagline: z.string().max(320).optional().or(z.literal('')),
  description: z.string().optional().or(z.literal('')),
  eventDate: z.string().min(1, 'Event date is required'),
  durationHours: z.coerce.number().min(0.5).max(24),
  mode: z.enum(['offline', 'online', 'hybrid']),
  location: z.string().optional().or(z.literal('')),
  address: z.string().optional().or(z.literal('')),
  seats: z.coerce.number().int().min(0),
  isFree: z.boolean(),
  price: z.string().optional().or(z.literal('')),
  perks: z.array(z.string()).default([]),
  speakers: z
    .array(
      z.object({
        name: z.string().min(1, 'Name is required'),
        role: z.string().optional().or(z.literal('')),
        bio: z.string().optional().or(z.literal('')),
      }),
    )
    .default([]),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  coverImage: z.string().optional().or(z.literal('')),
  seo: z
    .object({
      title: z.string().optional().or(z.literal('')),
      description: z.string().optional().or(z.literal('')),
      keywords: z.array(z.string()).default([]),
    })
    .default({}),
});

const emptyDefaults = {
  title: '',
  slug: '',
  tagline: '',
  description: '',
  eventDate: '',
  durationHours: 2,
  mode: 'offline',
  location: '',
  address: '',
  seats: 0,
  isFree: true,
  price: '',
  perks: [],
  speakers: [],
  isActive: true,
  isFeatured: true,
  coverImage: '',
  seo: { title: '', description: '', keywords: [] },
};

const toLocalInput = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 16);
};

export default function WorkshopForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();
  const qc = useQueryClient();

  const { data: existing, isLoading } = useQuery({
    queryKey: ['admin', 'workshop', id],
    queryFn: () => workshopApi.getById(id),
    enabled: isEdit,
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(workshopFormSchema),
    defaultValues: emptyDefaults,
  });

  const isFree = watch('isFree');

  useEffect(() => {
    if (existing?.data) {
      const w = existing.data;
      reset({
        ...emptyDefaults,
        ...w,
        eventDate: toLocalInput(w.eventDate),
        seo: { ...emptyDefaults.seo, ...(w.seo || {}) },
      });
    }
  }, [existing, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) => {
      const cleaned = { ...payload };
      // Convert local datetime to ISO for the API
      if (cleaned.eventDate) cleaned.eventDate = new Date(cleaned.eventDate).toISOString();
      return isEdit ? workshopApi.update(id, cleaned) : workshopApi.create(cleaned);
    },
    onSuccess: (res) => {
      toast.success(isEdit ? 'Workshop saved' : 'Workshop created');
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
      if (!isEdit) navigate(`/admin/workshops/${res.data._id}/edit`, { replace: true });
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
        <title>{isEdit ? 'Edit workshop' : 'New workshop'} — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((vals) => saveMut.mutate(vals))} className="space-y-6">
        <PageHeader
          title={isEdit ? 'Edit workshop' : 'New workshop'}
          description={
            isEdit
              ? 'Update details, perks, speakers, and visibility.'
              : 'Create a new workshop event.'
          }
          actions={
            <>
              <Link to="/admin/workshops" className="btn-outline">
                <ArrowLeft size={16} /> Back
              </Link>
              <button
                type="submit"
                disabled={isSubmitting || saveMut.isPending}
                className="btn-primary"
              >
                <Save size={16} />
                {saveMut.isPending ? 'Saving…' : isEdit ? 'Save changes' : 'Create workshop'}
              </button>
            </>
          }
        />

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <div className="card space-y-4 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">Basics</h3>
              <FormField
                label="Title"
                required
                {...register('title')}
                error={errors.title?.message}
              />
              <FormField label="Slug" hint="Auto from title if blank" {...register('slug')} />
              <TextareaField
                label="Tagline"
                rows={2}
                hint="Short one-liner shown under the heading"
                {...register('tagline')}
                error={errors.tagline?.message}
              />
            </div>

            <div className="card space-y-4 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Long description
              </h3>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <RichTextEditor value={field.value} onChange={field.onChange} folder="workshops" />
                )}
              />
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-500">
                Perks
              </h3>
              <Controller
                name="perks"
                control={control}
                render={({ field }) => (
                  <ArrayInput
                    value={field.value || []}
                    onChange={field.onChange}
                    placeholder="Certificate of participation"
                    addLabel="Add perk"
                  />
                )}
              />
            </div>

            <div className="card p-6">
              <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-ink-500">
                Speakers
              </h3>
              <Controller
                name="speakers"
                control={control}
                render={({ field }) => (
                  <SpeakerArray value={field.value || []} onChange={field.onChange} />
                )}
              />
            </div>

            <div className="card space-y-4 p-6">
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
            <div className="card space-y-4 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Date &amp; place
              </h3>
              <FormField
                label="Event date &amp; time"
                required
                type="datetime-local"
                {...register('eventDate')}
                error={errors.eventDate?.message}
              />
              <FormField
                label="Duration (hours)"
                type="number"
                step="0.5"
                min={0.5}
                max={24}
                {...register('durationHours', { valueAsNumber: true })}
                error={errors.durationHours?.message}
              />
              <div>
                <label className="mb-1 block text-xs font-semibold text-ink-700">Mode</label>
                <select className="input capitalize" {...register('mode')}>
                  <option value="offline">Offline</option>
                  <option value="online">Online</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
              <FormField
                label="Location"
                placeholder="e.g. DigiSwarm Office, Dehradun"
                {...register('location')}
              />
              <TextareaField
                label="Address"
                rows={3}
                {...register('address')}
              />
            </div>

            <div className="card space-y-4 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Pricing &amp; seats
              </h3>
              <Controller
                name="isFree"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Free entry"
                    hint="Toggle off if you charge for this workshop"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              {!isFree && (
                <FormField
                  label="Price"
                  placeholder="e.g. ₹499"
                  {...register('price')}
                />
              )}
              <FormField
                label="Seats (0 = unlimited)"
                type="number"
                min={0}
                {...register('seats', { valueAsNumber: true })}
                error={errors.seats?.message}
              />
            </div>

            <div className="card space-y-4 p-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-ink-500">
                Visibility
              </h3>
              <Controller
                name="isActive"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Active"
                    hint="Inactive workshops are hidden from the public page"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
              <Controller
                name="isFeatured"
                control={control}
                render={({ field }) => (
                  <SwitchField
                    label="Featured in navbar"
                    hint="Showcased in the public top nav and Hero call-out"
                    checked={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

function SpeakerArray({ value, onChange }) {
  const add = () => onChange([...(value || []), { name: '', role: '', bio: '' }]);
  const remove = (i) => onChange(value.filter((_, k) => k !== i));
  const update = (i, field, v) =>
    onChange(value.map((s, k) => (k === i ? { ...s, [field]: v } : s)));

  return (
    <div className="space-y-3">
      {(value || []).map((sp, i) => (
        <div
          key={i}
          className="space-y-2 rounded-xl border border-ink-100 bg-ink-50/40 p-3"
        >
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
              Speaker #{i + 1}
            </p>
            <button
              type="button"
              onClick={() => remove(i)}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              Remove
            </button>
          </div>
          <input
            placeholder="Name"
            className="input"
            value={sp.name}
            onChange={(e) => update(i, 'name', e.target.value)}
          />
          <input
            placeholder="Role / Title"
            className="input"
            value={sp.role}
            onChange={(e) => update(i, 'role', e.target.value)}
          />
          <textarea
            placeholder="Short bio"
            rows={2}
            className="input"
            value={sp.bio}
            onChange={(e) => update(i, 'bio', e.target.value)}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="btn-outline w-full justify-center text-sm"
      >
        Add speaker
      </button>
    </div>
  );
}
