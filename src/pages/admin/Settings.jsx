import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Save, Settings as SettingsIcon, Mail, Share2, AlertTriangle, BarChart3, Globe } from 'lucide-react';
import clsx from 'clsx';

import { settingsApi } from '@/api/settings.api';
import { settingsSchema } from '@/schemas/settings.schema';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';
import SwitchField from '@/components/forms/SwitchField';
import ImageUpload from '@/components/forms/ImageUpload';

const TABS = [
  { id: 'general', label: 'General', icon: Globe },
  { id: 'contact', label: 'Contact', icon: Mail },
  { id: 'socials', label: 'Socials', icon: Share2 },
  { id: 'smtp', label: 'SMTP', icon: Mail },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'maintenance', label: 'Maintenance', icon: AlertTriangle },
];

const emptyDefaults = {
  siteName: 'DigiSwarm',
  tagline: '',
  logo: { url: '', publicId: '' },
  favicon: { url: '', publicId: '' },
  contact: { email: '', phone: '', address: '' },
  socials: { linkedin: '', github: '', twitter: '', facebook: '', instagram: '', youtube: '' },
  smtp: { host: '', port: 587, user: '', pass: '', from: '' },
  analytics: { googleAnalyticsId: '', googleTagManagerId: '' },
  maintenance: { enabled: false, message: '' },
};

export default function Settings() {
  const qc = useQueryClient();
  const [tab, setTab] = useState('general');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'settings'],
    queryFn: () => settingsApi.getAdmin(),
  });

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(settingsSchema),
    defaultValues: emptyDefaults,
  });

  useEffect(() => {
    if (data?.data) {
      reset({
        ...emptyDefaults,
        ...data.data,
        logo: data.data.logo || emptyDefaults.logo,
        favicon: data.data.favicon || emptyDefaults.favicon,
        contact: { ...emptyDefaults.contact, ...(data.data.contact || {}) },
        socials: { ...emptyDefaults.socials, ...(data.data.socials || {}) },
        smtp: { ...emptyDefaults.smtp, ...(data.data.smtp || {}) },
        analytics: { ...emptyDefaults.analytics, ...(data.data.analytics || {}) },
        maintenance: { ...emptyDefaults.maintenance, ...(data.data.maintenance || {}) },
      });
    }
  }, [data, reset]);

  const saveMut = useMutation({
    mutationFn: (payload) => settingsApi.update(payload),
    onSuccess: () => {
      toast.success('Settings saved');
      qc.invalidateQueries({ queryKey: ['admin', 'settings'] });
      qc.invalidateQueries({ queryKey: ['public', 'settings'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Settings — DigiSwarm Admin</title>
      </Helmet>

      <form onSubmit={handleSubmit((v) => saveMut.mutate(v))} className="space-y-6">
        <PageHeader
          title="Site settings"
          description="Configure your public site name, contact details, and integrations."
          actions={
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting || saveMut.isPending}
            >
              <Save size={16} /> {saveMut.isPending ? 'Saving…' : 'Save changes'}
            </button>
          }
        />

        <div className="card overflow-hidden">
          <div className="flex flex-wrap gap-1 border-b border-ink-100 bg-ink-50/40 p-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={clsx(
                  'inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition',
                  tab === t.id
                    ? 'bg-white text-brand-700 shadow-soft'
                    : 'text-ink-600 hover:bg-white/60',
                )}
              >
                <t.icon size={14} /> {t.label}
              </button>
            ))}
          </div>

          <div className="p-6 space-y-5">
            {tab === 'general' && (
              <div className="space-y-4">
                <FormField
                  label="Site name"
                  required
                  {...register('siteName')}
                  error={errors.siteName?.message}
                />
                <TextareaField
                  label="Tagline"
                  rows={2}
                  {...register('tagline')}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="logo"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload label="Logo" value={field.value} onChange={field.onChange} folder="brand" />
                    )}
                  />
                  <Controller
                    name="favicon"
                    control={control}
                    render={({ field }) => (
                      <ImageUpload label="Favicon" value={field.value} onChange={field.onChange} folder="brand" />
                    )}
                  />
                </div>
              </div>
            )}

            {tab === 'contact' && (
              <div className="space-y-4">
                <FormField
                  label="Email"
                  type="email"
                  {...register('contact.email')}
                  error={errors.contact?.email?.message}
                />
                <FormField label="Phone" {...register('contact.phone')} />
                <TextareaField label="Address" rows={3} {...register('contact.address')} />
              </div>
            )}

            {tab === 'socials' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="LinkedIn"
                  type="url"
                  placeholder="https://linkedin.com/company/…"
                  {...register('socials.linkedin')}
                  error={errors.socials?.linkedin?.message}
                />
                <FormField
                  label="GitHub"
                  type="url"
                  placeholder="https://github.com/…"
                  {...register('socials.github')}
                />
                <FormField
                  label="Twitter / X"
                  type="url"
                  placeholder="https://twitter.com/…"
                  {...register('socials.twitter')}
                />
                <FormField
                  label="Facebook"
                  type="url"
                  placeholder="https://facebook.com/…"
                  {...register('socials.facebook')}
                />
                <FormField
                  label="Instagram"
                  type="url"
                  placeholder="https://instagram.com/…"
                  {...register('socials.instagram')}
                />
                <FormField
                  label="YouTube"
                  type="url"
                  placeholder="https://youtube.com/@…"
                  {...register('socials.youtube')}
                />
              </div>
            )}

            {tab === 'smtp' && (
              <div className="space-y-4">
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                  SMTP credentials are stored on the server. Update the <code>.env</code> file for
                  production deploys — these values are used only when present.
                </p>
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField label="Host" {...register('smtp.host')} />
                  <FormField
                    label="Port"
                    type="number"
                    {...register('smtp.port', { valueAsNumber: true })}
                  />
                  <FormField label="Username" {...register('smtp.user')} />
                  <FormField label="Password" type="password" {...register('smtp.pass')} />
                  <div className="sm:col-span-2">
                    <FormField
                      label="From address"
                      placeholder='"DigiSwarm" <no-reply@digiswarm.com>'
                      {...register('smtp.from')}
                    />
                  </div>
                </div>
              </div>
            )}

            {tab === 'analytics' && (
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  label="Google Analytics ID"
                  placeholder="G-XXXXXXX"
                  {...register('analytics.googleAnalyticsId')}
                />
                <FormField
                  label="Google Tag Manager ID"
                  placeholder="GTM-XXXXXXX"
                  {...register('analytics.googleTagManagerId')}
                />
              </div>
            )}

            {tab === 'maintenance' && (
              <div className="space-y-4">
                <Controller
                  name="maintenance.enabled"
                  control={control}
                  render={({ field }) => (
                    <SwitchField
                      label="Maintenance mode"
                      hint="Show a static maintenance page to public visitors"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <TextareaField
                  label="Maintenance message"
                  rows={3}
                  {...register('maintenance.message')}
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
}
