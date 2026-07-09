import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, ArrowRight, DollarSign } from 'lucide-react';
import clsx from 'clsx';

import { pricingApi } from '@/api/pricingPlan.api';
import SectionHeading from '@/components/common/SectionHeading';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import FaqsSection from '@/components/sections/FaqsSection';
import CtaBanner from '@/components/sections/CtaBanner';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function Pricing() {
  const { data, isLoading } = useQuery({
    queryKey: ['public', 'pricing'],
    queryFn: () => pricingApi.listPublic(),
  });

  const plans = data?.data || [];

  return (
    <>
      <Helmet>
        <title>Pricing — DigiSwarm</title>
        <meta
          name="description"
          content="Transparent pricing tiers and engagement models for DigiSwarm services."
        />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="container-x pt-12 pb-8 md:pt-16">
          <SectionHeading
            eyebrow="Pricing"
            title="Plans that match how you build"
            subtitle="Project, retainer, or staff augmentation — pick the model that fits where you are."
          />
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader />
            </div>
          ) : plans.length === 0 ? (
            <EmptyState
              icon={DollarSign}
              title="Pricing coming soon"
              description="We're finalizing public plans — reach out for a custom quote in the meantime."
              action={
                <Link to="/get-quote" className="btn-primary">
                  Get a custom quote <ArrowRight size={14} />
                </Link>
              }
            />
          ) : (
            <div
              className={clsx(
                'mx-auto grid max-w-6xl items-start gap-6',
                plans.length === 1 && 'max-w-md',
                plans.length === 2 && 'sm:grid-cols-2 max-w-3xl',
                plans.length >= 3 && 'md:grid-cols-3',
              )}
            >
              {plans.map((p, i) => (
                <motion.div
                  key={p._id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.3 }}
                  variants={fade}
                  custom={i}
                  className={clsx(
                    'relative flex h-full flex-col rounded-2xl border bg-white p-7 shadow-soft',
                    p.isHighlighted
                      ? 'border-brand-300 ring-2 ring-brand-200/40'
                      : 'border-ink-100',
                  )}
                >
                  {p.isHighlighted && (
                    <span className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1 rounded-full bg-brand-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-white">
                      <Sparkles size={10} /> Most popular
                    </span>
                  )}
                  <p className="text-sm font-bold uppercase tracking-widest text-brand-700">
                    {p.name}
                  </p>
                  {p.tagline && <p className="mt-2 text-sm text-ink-500">{p.tagline}</p>}
                  <p className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900">
                    {p.price}
                    {p.billingCycle && (
                      <span className="ml-1 text-base font-medium text-ink-500">
                        / {p.billingCycle}
                      </span>
                    )}
                  </p>
                  <ul className="mt-6 flex-1 space-y-2.5 text-sm text-ink-700">
                    {(p.features || []).map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-brand-600" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to={p.cta?.link || '/get-quote'}
                    className={clsx(
                      'mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition',
                      p.isHighlighted
                        ? 'bg-brand-600 text-white hover:bg-brand-700'
                        : 'border border-ink-200 text-ink-800 hover:bg-ink-50',
                    )}
                  >
                    {p.cta?.label || 'Get started'} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      <FaqsSection
        eyebrow="Pricing FAQ"
        title="The questions we hear most"
        subtitle="Still curious? The contact page is the fastest way to ask."
      />

      <CtaBanner
        title="Need a custom plan?"
        body="Tell us about the project and we'll come back with the engagement model that fits."
        primary={{ to: '/get-quote', label: 'Get a custom quote' }}
        secondary={{ to: '/contact', label: 'Talk to us' }}
      />
    </>
  );
}
