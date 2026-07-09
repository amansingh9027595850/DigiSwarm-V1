import { useQuery } from '@tanstack/react-query';
import { Star, Quote } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import { testimonialApi } from '@/api/testimonial.api';
import { TESTIMONIALS as FALLBACK_TESTIMONIALS } from '@/data/placeholders';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

const AVATAR_TINTS = [
  'bg-brand-100 text-brand-700',
  'bg-emerald-100 text-emerald-700',
  'bg-amber-100 text-amber-700',
  'bg-fuchsia-100 text-fuchsia-700',
  'bg-sky-100 text-sky-700',
  'bg-rose-100 text-rose-700',
];

const normalize = (t, i) => ({
  id: t._id || `${t.name || t.clientName || 'anon'}-${i}`,
  content: t.content,
  rating: t.rating ?? 5,
  name: t.clientName || t.name,
  role: [t.clientRole || t.role, t.company].filter(Boolean).join(', '),
  photo: t.photo?.url || null,
});

const card = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i % 6) * 0.06, duration: 0.5, ease: 'easeOut' },
  }),
};

function TestimonialCard({ t, tintIndex, i }) {
  const tint = AVATAR_TINTS[tintIndex % AVATAR_TINTS.length];
  return (
    <motion.figure
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={card}
      custom={i}
      className="group relative flex h-full flex-col rounded-2xl border border-ink-100 bg-white p-3.5 shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card sm:p-6 lg:p-7"
    >
      {/* Decorative quote — smaller on mobile so it doesn't dominate */}
      <Quote
        aria-hidden
        className="absolute right-3 top-3 text-brand-100 transition group-hover:text-brand-200 sm:right-5 sm:top-5"
        size={28}
        fill="currentColor"
      />

      {/* Rating */}
      <div className="relative flex items-center gap-0.5">
        {[...Array(5)].map((_, k) => (
          <Star
            key={k}
            size={13}
            className={
              k < (t.rating || 5)
                ? 'fill-amber-400 text-amber-400'
                : 'text-ink-200'
            }
          />
        ))}
      </div>

      {/* Quote — clamped on mobile to keep cards compact */}
      <blockquote className="relative mt-2.5 flex-1 text-[13px] leading-relaxed text-ink-700 sm:mt-4 sm:text-[15px]">
        <span className="line-clamp-5 md:line-clamp-6 lg:line-clamp-none">
          <span className="select-none text-brand-300">“</span>
          {t.content}
          <span className="select-none text-brand-300">”</span>
        </span>
      </blockquote>

      {/* Author */}
      <figcaption className="relative mt-3 flex items-center gap-2.5 border-t border-ink-100 pt-3 sm:mt-6 sm:gap-3 sm:pt-4">
        {t.photo ? (
          <div className="grid h-9 w-9 shrink-0 place-items-center overflow-hidden rounded-lg border border-ink-100 bg-white p-1 sm:h-12 sm:w-12 sm:rounded-xl sm:p-1.5">
            <img
              src={t.photo}
              alt={t.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          </div>
        ) : (
          <div
            className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg text-[11px] font-bold sm:h-12 sm:w-12 sm:rounded-xl sm:text-xs ${tint}`}
          >
            {initialsOf(t.name)}
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-xs font-bold text-ink-900 sm:text-sm">{t.name}</p>
          {t.role && (
            <p className="truncate text-[10px] text-ink-500 sm:text-xs">{t.role}</p>
          )}
        </div>
      </figcaption>

      {/* Hover accent ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-brand-300/30 transition group-hover:opacity-100"
      />
    </motion.figure>
  );
}

export default function TestimonialsSection() {
  const { data } = useQuery({
    queryKey: ['public', 'testimonials'],
    queryFn: () => testimonialApi.listPublic(),
  });

  const apiItems = (data?.data || []).map(normalize);
  const fallbackItems = FALLBACK_TESTIMONIALS.map(normalize);
  const items = apiItems.length > 0 ? apiItems : fallbackItems;

  if (items.length === 0) return null;

  return (
    <section className="section relative overflow-hidden bg-gradient-to-b from-white via-brand-50/30 to-white">
      {/* Background flourishes */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 h-72 w-72 rounded-full bg-fuchsia-200/25 blur-3xl"
      />

      <div className="container-x">
        <SectionHeading
          eyebrow="Testimonials"
          title="What our clients are saying"
          subtitle="Real outcomes from teams we have partnered with — strategy, design, content, and ads, all under one roof."
        />

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs sm:mt-7 sm:gap-x-6 sm:text-sm"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className="fill-amber-400 text-amber-400" />
              ))}
            </span>
            <span className="font-bold text-ink-900">4.9 / 5</span>
            <span className="text-ink-500">average rating</span>
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-ink-300 sm:inline-block" />
          <span className="text-ink-600">
            <span className="font-bold text-ink-900">60+</span> happy clients
          </span>
          <span className="hidden h-1 w-1 rounded-full bg-ink-300 sm:inline-block" />
          <span className="text-ink-600">
            <span className="font-bold text-ink-900">200+</span> projects delivered
          </span>
        </motion.div>

        {/* Responsive grid — 2 cols on phones, 3 on tablets, 3 on laptops, 4 on wide */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-10 sm:gap-5 md:grid-cols-3 md:gap-6 lg:gap-6 2xl:grid-cols-4">
          {items.map((t, i) => (
            <TestimonialCard key={t.id} t={t} tintIndex={i} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
