import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import {
  Mail,
  MapPin,
  CheckCircle2,
  Send,
  Phone,
  Clock,
  Sparkles,
} from 'lucide-react';

import { contactApi } from '@/api/contact.api';
import { contactSchema } from '@/schemas/contact.schema';
import { useSettings } from '@/hooks/useSettings';
import FormField from '@/components/forms/FormField';
import TextareaField from '@/components/forms/TextareaField';

const sanitize = (n) => String(n || '').replace(/[^\d]/g, '');

function WhatsAppIcon({ className = 'h-5 w-5' }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden className={className}>
      <path d="M19.11 17.55c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM16.03 6C10.49 6 6 10.49 6 16.03c0 1.77.47 3.5 1.34 5.02L6 27l6.1-1.6a9.95 9.95 0 0 0 3.93.81h.01c5.53 0 10.02-4.49 10.02-10.02 0-2.68-1.04-5.2-2.93-7.09A9.95 9.95 0 0 0 16.03 6zm0 18.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.62.95.97-3.53-.2-.32A8.16 8.16 0 1 1 24.2 16.03c0 4.51-3.66 8.15-8.17 8.15z" />
    </svg>
  );
}

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const { settings } = useSettings();
  const [searchParams] = useSearchParams();

  // useSettings merges API data with FALLBACK, so these always have values
  const email = settings.contact?.email;
  const phone = settings.contact?.phone;
  const whatsapp = sanitize(settings.contact?.whatsapp || settings.contact?.phone);
  const address = settings.contact?.address;
  const mapUrl = settings.contact?.mapUrl;

  const defaultSubject = searchParams.get('subject') || '';
  const defaultMessage = searchParams.get('message') || '';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: '', email: '', subject: defaultSubject, message: defaultMessage },
  });

  const submitMut = useMutation({
    mutationFn: (vals) => contactApi.create(vals),
    onSuccess: (res) => {
      toast.success(res?.message || 'Message sent');
      setSubmitted(true);
    },
    onError: (err) =>
      toast.error(err?.response?.data?.message || 'Could not send message'),
  });

  const waHref = `https://wa.me/${whatsapp}?text=${encodeURIComponent(
    `Hi ${settings.siteName} team! I'd like to discuss a project.`,
  )}`;

  return (
    <>
      <Helmet>
        <title>Contact — DigiSwarm</title>
        <meta
          name="description"
          content="Get in touch with DigiSwarm. WhatsApp, email, phone — we reply within one business day."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute -top-24 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="container-x pt-12 pb-8 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
              <Sparkles size={14} /> Contact us
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
              Let&apos;s build something{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                great
              </span>{' '}
              together
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
              WhatsApp ya email se message karo — hum 1 business day ke andar reply karte hain.
              Bata, kya plan kar rahe ho?
            </p>
          </motion.div>
        </div>
      </section>

      {/* QUICK CONTACT CHANNELS */}
      <section className="pb-2">
        <div className="container-x grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-[#25D366] text-white">
              <WhatsAppIcon className="h-6 w-6" />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-emerald-700">
              WhatsApp · Fastest
            </p>
            <p className="mt-1 font-bold text-ink-900">Chat with us now</p>
            <p className="mt-1 text-sm text-ink-600">Typical reply in minutes</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 group-hover:gap-2 transition-all">
              Open WhatsApp →
            </span>
          </a>

          <a
            href={`mailto:${email}`}
            className="group relative overflow-hidden rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-card"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
              <Mail size={22} />
            </div>
            <p className="mt-4 text-xs font-bold uppercase tracking-widest text-brand-700">
              Email · HR
            </p>
            <p className="mt-1 truncate font-bold text-ink-900">{email}</p>
            <p className="mt-1 text-sm text-ink-600">Reply within 1 business day</p>
            <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 group-hover:gap-2 transition-all">
              Send email →
            </span>
          </a>

          {phone ? (
            <a
              href={`tel:${phone}`}
              className="group relative overflow-hidden rounded-2xl border border-amber-100 bg-gradient-to-br from-amber-50 to-white p-5 transition hover:-translate-y-0.5 hover:shadow-card"
            >
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-amber-500 text-white">
                <Phone size={22} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-amber-700">
                Call us
              </p>
              <p className="mt-1 font-bold text-ink-900">{phone}</p>
              <p className="mt-1 text-sm text-ink-600">Mon–Sat, 10am – 7pm</p>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-amber-700 group-hover:gap-2 transition-all">
                Call now →
              </span>
            </a>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-ink-100 bg-gradient-to-br from-ink-50 to-white p-5">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-ink-200 text-ink-700">
                <Clock size={22} />
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-ink-600">
                Office hours
              </p>
              <p className="mt-1 font-bold text-ink-900">Mon – Sat</p>
              <p className="mt-1 text-sm text-ink-600">10:00 AM – 7:00 PM IST</p>
            </div>
          )}
        </div>
      </section>

      {/* FORM + ADDRESS + MAP */}
      <section className="section pt-10">
        <div className="container-x grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5 }}
            className="card p-6 sm:p-8"
          >
            {submitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={24} />
                </div>
                <h2 className="mt-5 text-2xl font-extrabold text-ink-900">Message sent!</h2>
                <p className="mx-auto mt-2 max-w-md leading-relaxed text-ink-600">
                  Thanks for reaching out. We&apos;ll get back to you within one business day.
                </p>
                <div className="mt-6 flex flex-wrap justify-center gap-3">
                  <Link to="/" className="btn-primary">
                    Back to home
                  </Link>
                  <button onClick={() => setSubmitted(false)} className="btn-outline">
                    Send another
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-2xl font-extrabold text-ink-900">Send us a message</h2>
                  <p className="mt-1 text-sm text-ink-500">
                    Fill the form and we&apos;ll be in touch. Sharing project details helps us
                    respond faster.
                  </p>
                </div>
                <form
                  onSubmit={handleSubmit((v) => submitMut.mutate(v))}
                  className="mt-6 space-y-4"
                  noValidate
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      label="Name"
                      required
                      {...register('name')}
                      error={errors.name?.message}
                    />
                    <FormField
                      label="Email"
                      type="email"
                      required
                      {...register('email')}
                      error={errors.email?.message}
                    />
                  </div>
                  <FormField
                    label="Subject"
                    required
                    placeholder="What is this about?"
                    {...register('subject')}
                    error={errors.subject?.message}
                  />
                  <TextareaField
                    label="Message"
                    required
                    rows={6}
                    placeholder="Tell us about your project, goals, and timeline…"
                    {...register('message')}
                    error={errors.message?.message}
                  />
                  <button
                    type="submit"
                    className="btn-primary w-full sm:w-auto"
                    disabled={submitMut.isPending}
                  >
                    <Send size={14} />
                    {submitMut.isPending ? 'Sending…' : 'Send message'}
                  </button>
                </form>
              </>
            )}
          </motion.div>

          {/* Office card + Map */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-4"
          >
            {address && (
              <div className="card overflow-hidden">
                <div className="aspect-[16/10] w-full bg-ink-100">
                  <iframe
                    title="DigiSwarm office location"
                    src={mapUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    allowFullScreen
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                        Our office
                      </p>
                      <p className="mt-1 text-sm leading-relaxed text-ink-800">{address}</p>
                    </div>
                  </div>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      address,
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline mt-5 w-full justify-center"
                  >
                    Get directions
                  </a>
                </div>
              </div>
            )}

            <div className="card bg-ink-900 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-xl bg-white/10">
                  <Clock size={18} className="text-brand-300" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-ink-400">
                    Working hours
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">Mon – Sat · 10:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
