import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowUpRight, FileText } from 'lucide-react';
import clsx from 'clsx';

import { projectApi } from '@/api/project.api';
import SectionHeading from '@/components/common/SectionHeading';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import CtaBanner from '@/components/sections/CtaBanner';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function Portfolio() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'projects', { page, category }],
    queryFn: () =>
      projectApi.listPublic({ page, limit: 12, category: category || undefined }),
    keepPreviousData: true,
  });

  const categories = useMemo(() => {
    const all = new Set(data?.data?.map((p) => p.category).filter(Boolean));
    return ['', ...Array.from(all)];
  }, [data]);

  return (
    <>
      <Helmet>
        <title>Portfolio — DigiSwarm</title>
        <meta
          name="description"
          content="Selected projects from the DigiSwarm team — across web, mobile, fintech, healthcare, and more."
        />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="container-x pt-12 pb-8 md:pt-16">
          <SectionHeading
            eyebrow="Portfolio"
            title="Recent work we're proud of"
            subtitle="A few of the products we&apos;ve helped design, build, and grow."
          />
        </div>
      </section>

      {categories.length > 1 && (
        <section className="pb-2">
          <div className="container-x">
            <div className="flex flex-wrap items-center justify-center gap-2">
              {categories.map((c) => (
                <button
                  key={c || 'all'}
                  onClick={() => {
                    setCategory(c);
                    setPage(1);
                  }}
                  className={clsx(
                    'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                    c === category
                      ? 'border-brand-600 bg-brand-600 text-white'
                      : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                  )}
                >
                  {c || 'All'}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section pt-8">
        <div className="container-x space-y-10">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <EmptyState title="Couldn't load projects" description="Please try again in a moment." />
          ) : !data?.data?.length ? (
            <EmptyState
              icon={FileText}
              title="No projects yet"
              description="Our team is curating case studies — check back soon."
              action={
                <Link to="/contact" className="btn-primary">
                  Talk to us
                </Link>
              }
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2">
                {data.data.map((p, i) => (
                  <motion.div
                    key={p._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fade}
                    custom={i}
                  >
                    <Link
                      to={`/portfolio/${p.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="relative h-52 bg-gradient-to-br from-brand-500 to-indigo-500">
                        {p.cover?.url ? (
                          <img src={p.cover.url} alt={p.title} className="h-full w-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_50%)]" />
                        )}
                        {p.category && (
                          <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                            {p.category}
                          </div>
                        )}
                        <div className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/20 text-white opacity-0 transition group-hover:opacity-100">
                          <ArrowUpRight size={16} />
                        </div>
                      </div>
                      <div className="p-6">
                        {p.client && (
                          <p className="text-xs font-semibold text-ink-700">{p.client}</p>
                        )}
                        <h3 className="mt-1 text-xl font-extrabold text-ink-900">{p.title}</h3>
                        <p className="mt-2 text-sm leading-relaxed text-ink-600">{p.summary}</p>
                        {!!p.tags?.length && (
                          <div className="mt-4 flex flex-wrap gap-1.5">
                            {p.tags.slice(0, 4).map((t) => (
                              <span
                                key={t}
                                className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>

              <Pagination
                page={data?.meta?.page || 1}
                totalPages={data?.meta?.totalPages || 1}
                onChange={setPage}
              />
            </>
          )}
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
