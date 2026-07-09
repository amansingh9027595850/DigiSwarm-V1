import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { SERVICES } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' },
  }),
};

// Bento layout for first 5 services (hero card + 4 secondary).
// Mobile (2 cols): first card = full width, rest = 1 col each.
const BENTO_SPANS = [
  'col-span-2 sm:col-span-2 lg:col-span-2 lg:row-span-2', // big feature
  'col-span-2 sm:col-span-1 lg:col-span-2',               // wide
  'col-span-1 sm:col-span-1',                             // square
  'col-span-1 sm:col-span-1',                             // square
  'col-span-2 sm:col-span-2 lg:col-span-2',               // wide bottom
];

export default function ServicesPreview() {
  const featured = SERVICES.slice(0, 5);
  const rest = SERVICES.slice(5);

  return (
    <section className="section relative overflow-hidden">
      {/* Background flourishes */}
      <div
        aria-hidden
        className="absolute -top-32 right-[-10%] -z-10 h-80 w-80 rounded-full bg-brand-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute bottom-[-10%] left-[-10%] -z-10 h-80 w-80 rounded-full bg-indigo-200/30 blur-3xl"
      />

      <div className="container-x">
        <SectionHeading
          eyebrow="What we do"
          title="Services that move the needle"
          subtitle="From SEO to social, websites to ads — every layer of your digital presence, handled in-house."
        />

        {/* Bento grid for featured */}
        <div className="mt-6 grid grid-cols-2 auto-rows-[140px] gap-3 sm:mt-8 sm:auto-rows-[200px] sm:gap-4 md:auto-rows-[220px] md:gap-5 lg:grid-cols-4 lg:auto-rows-[210px]">
          {featured.map((svc, i) => {
            const isFirst = i === 0;
            const Icon = svc.icon;
            return (
              <motion.div
                key={svc.slug}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fade}
                custom={i}
                className={BENTO_SPANS[i]}
              >
                <Link
                  to={`/services/${svc.slug}`}
                  className={`group relative flex h-full flex-col justify-end overflow-hidden rounded-2xl transition duration-300 hover:-translate-y-1 ${
                    isFirst
                      ? 'shadow-card hover:shadow-xl'
                      : 'border border-ink-100 bg-white hover:border-brand-200 hover:shadow-card'
                  }`}
                >
                  {/* Image background */}
                  <div className="absolute inset-0">
                    <img
                      src={svc.image}
                      alt={svc.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    {/* Gradient overlay for legibility */}
                    <div
                      aria-hidden
                      className={`absolute inset-0 ${
                        isFirst
                          ? 'bg-gradient-to-tr from-ink-900/85 via-ink-900/55 to-ink-900/20'
                          : 'bg-gradient-to-t from-ink-900/85 via-ink-900/40 to-transparent'
                      }`}
                    />
                    {/* Subtle accent wash */}
                    <div
                      aria-hidden
                      className={`absolute inset-0 bg-gradient-to-br ${svc.accent} opacity-20 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-40`}
                    />
                  </div>

                  {/* Top-right arrow */}
                  <div className="absolute right-2.5 top-2.5 z-10 sm:right-4 sm:top-4">
                    <span className="grid h-7 w-7 place-items-center rounded-full bg-white/15 text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-ink-900 sm:h-9 sm:w-9">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>

                  {/* Content */}
                  <div className="relative z-10 p-3 sm:p-5 lg:p-6">
                    <div
                      className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 text-white backdrop-blur-md transition group-hover:bg-white group-hover:text-brand-700 sm:h-11 sm:w-11 sm:rounded-xl"
                    >
                      <Icon size={16} className="sm:hidden" />
                      <Icon size={20} className="hidden sm:block" />
                    </div>
                    <h3
                      className={`mt-2 font-extrabold text-white sm:mt-4 ${
                        isFirst ? 'text-base sm:text-2xl lg:text-3xl' : 'text-sm sm:text-lg'
                      }`}
                    >
                      {svc.title}
                    </h3>
                    <p
                      className={`mt-1 hidden text-sm leading-relaxed text-white/85 sm:block ${
                        isFirst ? '' : 'line-clamp-2 md:line-clamp-3'
                      }`}
                    >
                      {svc.tagline}
                    </p>

                    {isFirst && (
                      <span className="mt-3 hidden items-center gap-1.5 text-sm font-semibold text-white transition-all group-hover:gap-2.5 sm:mt-5 sm:inline-flex">
                        Learn more <ArrowRight size={14} />
                      </span>
                    )}
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Remaining services as compact image cards */}
        {rest.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-3 sm:mt-4 sm:gap-4 md:grid-cols-3 md:gap-5 lg:grid-cols-4">
            {rest.map((svc, i) => {
              const Icon = svc.icon;
              return (
                <motion.div
                  key={svc.slug}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, amount: 0.2 }}
                  variants={fade}
                  custom={i}
                >
                  <Link
                    to={`/services/${svc.slug}`}
                    className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card sm:flex-row sm:items-start sm:gap-3 sm:p-4 sm:min-h-[140px] md:min-h-[148px]"
                  >
                    {/* Background image preview, dimmed */}
                    <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      <img
                        src={svc.image}
                        alt=""
                        className="h-full w-full object-cover"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/60" />
                    </div>

                    {/* Top row on mobile: icon + arrow. On sm+, this becomes just the icon column. */}
                    <div className="relative flex items-start justify-between sm:block">
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700 transition group-hover:bg-brand-600 group-hover:text-white sm:h-12 sm:w-12 sm:rounded-xl">
                        <Icon size={16} className="sm:hidden" />
                        <Icon size={20} className="hidden sm:block" />
                      </div>
                      {/* Mobile-only arrow (top-right) */}
                      <ArrowUpRight
                        size={14}
                        className="shrink-0 text-ink-300 transition group-hover:text-brand-700 sm:hidden"
                      />
                    </div>

                    <div className="relative mt-2.5 min-w-0 flex-1 sm:mt-0">
                      <p className="text-[15px] font-bold leading-tight text-ink-900 [overflow-wrap:normal] sm:text-base">
                        {svc.title}
                      </p>
                      <p className="mt-1 text-[12px] leading-snug text-ink-500 sm:mt-1.5 sm:text-xs sm:leading-relaxed">
                        {svc.tagline}
                      </p>
                    </div>

                    {/* sm+ arrow on the right side */}
                    <ArrowUpRight
                      size={16}
                      className="relative mt-0.5 hidden shrink-0 text-ink-300 transition group-hover:text-brand-700 sm:block"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        )}

        <div className="mt-6 text-center sm:mt-8">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all hover:gap-2.5"
          >
            See all services <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
