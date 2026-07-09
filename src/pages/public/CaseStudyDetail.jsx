import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Clock, Users } from 'lucide-react';

import { caseStudyApi } from '@/api/caseStudy.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'case-study', slug],
    queryFn: () => caseStudyApi.getBySlug(slug),
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <section className="section">
        <div className="container-x">
          <EmptyState
            title="Case study not found"
            description="The case study you're looking for has moved or doesn't exist."
            action={
              <Link to="/case-studies" className="btn-primary">
                <ArrowLeft size={16} /> Back to case studies
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const c = data.data;

  return (
    <>
      <Helmet>
        <title>{c.seo?.title || c.title} — DigiSwarm Case Study</title>
        <meta name="description" content={c.seo?.description || c.challenge} />
      </Helmet>

      <section className="relative">
        <div className="container-x pt-12 pb-6 md:pt-16">
          <Link
            to="/case-studies"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft size={14} /> Case studies
          </Link>
          <div className="mt-6 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {c.industry && (
                <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
                  {c.industry}
                </span>
              )}
              {c.client && <span className="text-ink-500">· {c.client}</span>}
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
              {c.title}
            </h1>
          </div>
        </div>
      </section>

      {c.cover?.url && (
        <section>
          <div className="container-x">
            <div className="overflow-hidden rounded-2xl bg-ink-100 shadow-card">
              <img src={c.cover.url} alt={c.title} className="h-auto w-full" />
            </div>
          </div>
        </section>
      )}

      {!!c.metrics?.length && (
        <section className="section pt-10 pb-0">
          <div className="container-x">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {c.metrics.map((m, i) => (
                <div key={i} className="card p-5 text-center">
                  <p className="text-3xl font-extrabold tracking-tight text-brand-700">{m.value}</p>
                  <p className="mt-1 text-xs uppercase tracking-widest text-ink-500">{m.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_280px]">
          <div className="space-y-10">
            {c.challenge && (
              <Block title="The challenge" body={c.challenge} />
            )}
            {c.solution && (
              <Block title="Our solution" body={c.solution} />
            )}
            {c.results && (
              <Block title="The results" body={c.results} />
            )}
            {c.content && (
              <article
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: c.content }}
              />
            )}
          </div>

          <aside className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            <div className="card p-5">
              <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500">
                Project at a glance
              </h4>
              <ul className="mt-3 space-y-3 text-sm">
                {c.client && (
                  <Row label="Client" value={c.client} />
                )}
                {c.industry && <Row label="Industry" value={c.industry} />}
                {c.duration && (
                  <Row
                    label="Duration"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <Clock size={14} /> {c.duration}
                      </span>
                    }
                  />
                )}
                {c.teamSize && (
                  <Row
                    label="Team"
                    value={
                      <span className="inline-flex items-center gap-1.5">
                        <Users size={14} /> {c.teamSize}
                      </span>
                    }
                  />
                )}
              </ul>
            </div>

            {c.project && (
              <Link
                to={`/portfolio/${c.project.slug}`}
                className="block card p-5 transition hover:border-brand-200"
              >
                <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                  Linked project
                </p>
                <p className="mt-2 text-sm font-semibold text-brand-700">
                  {c.project.title} →
                </p>
              </Link>
            )}
          </aside>
        </div>
      </section>

      <CtaBanner
        title="Want results like these?"
        body="Send us your goals — we'll come back with how we'd approach it."
      />
    </>
  );
}

function Block({ title, body }) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-ink-900">{title}</h2>
      <p className="mt-3 whitespace-pre-line text-ink-700 leading-relaxed">{body}</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="text-ink-500">{label}</span>
      <span className="font-semibold text-ink-900 text-right">{value}</span>
    </li>
  );
}
