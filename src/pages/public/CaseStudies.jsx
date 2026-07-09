import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen } from 'lucide-react';

import { caseStudyApi } from '@/api/caseStudy.api';
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
    transition: { delay: i * 0.06, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function CaseStudies() {
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'case-studies', { page }],
    queryFn: () => caseStudyApi.listPublic({ page, limit: 9 }),
    keepPreviousData: true,
  });

  return (
    <>
      <Helmet>
        <title>Case studies — DigiSwarm</title>
        <meta
          name="description"
          content="Real outcomes, real numbers. Detailed case studies on the work we've shipped with our clients."
        />
      </Helmet>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/60 via-white to-white" />
        <div className="container-x pt-12 pb-8 md:pt-16">
          <SectionHeading
            eyebrow="Case studies"
            title="Stories of measurable impact"
            subtitle="Detailed breakdowns of how we partnered with teams to ship outcomes that mattered."
          />
        </div>
      </section>

      <section className="section pt-4">
        <div className="container-x space-y-10">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <EmptyState title="Couldn't load case studies" description="Please try again in a moment." />
          ) : !data?.data?.length ? (
            <EmptyState
              icon={BookOpen}
              title="No case studies yet"
              description="We're polishing the first set — check back soon."
              action={
                <Link to="/contact" className="btn-primary">
                  Talk to us
                </Link>
              }
            />
          ) : (
            <>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {data.data.map((c, i) => (
                  <motion.article
                    key={c._id}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    variants={fade}
                    custom={i}
                  >
                    <Link
                      to={`/case-studies/${c.slug}`}
                      className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
                    >
                      <div className="relative h-44 bg-gradient-to-br from-brand-500 to-indigo-500">
                        {c.cover?.url ? (
                          <img src={c.cover.url} alt={c.title} className="h-full w-full object-cover" />
                        ) : null}
                        {c.industry && (
                          <div className="absolute left-4 top-4 inline-flex rounded-full bg-white/20 px-2.5 py-0.5 text-[11px] font-semibold text-white backdrop-blur">
                            {c.industry}
                          </div>
                        )}
                      </div>
                      <div className="p-6">
                        {c.client && (
                          <p className="text-xs font-semibold text-ink-700">{c.client}</p>
                        )}
                        <h3 className="mt-1 text-lg font-bold text-ink-900 group-hover:text-brand-700 transition">
                          {c.title}
                        </h3>
                        {c.challenge && (
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
                            {c.challenge}
                          </p>
                        )}
                        <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 group-hover:gap-2.5 transition-all">
                          Read the story <ArrowRight size={14} />
                        </span>
                      </div>
                    </Link>
                  </motion.article>
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
