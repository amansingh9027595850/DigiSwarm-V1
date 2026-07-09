import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ExternalLink } from 'lucide-react';

import { projectApi } from '@/api/project.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'project', slug],
    queryFn: () => projectApi.getBySlug(slug),
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
            title="Project not found"
            description="The project you're looking for has moved or doesn't exist."
            action={
              <Link to="/portfolio" className="btn-primary">
                <ArrowLeft size={16} /> Back to portfolio
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const p = data.data;

  return (
    <>
      <Helmet>
        <title>{p.seo?.title || p.title} — DigiSwarm</title>
        <meta name="description" content={p.seo?.description || p.summary} />
      </Helmet>

      <section className="relative">
        <div className="container-x pt-12 pb-8 md:pt-16">
          <Link
            to="/portfolio"
            className="inline-flex items-center gap-1.5 text-sm text-ink-500 hover:text-brand-700"
          >
            <ArrowLeft size={14} /> Portfolio
          </Link>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {p.category && (
                  <span className="rounded-full bg-brand-50 px-2.5 py-0.5 font-semibold text-brand-700">
                    {p.category}
                  </span>
                )}
                {p.year && <span className="text-ink-500">{p.year}</span>}
                {p.client && <span className="text-ink-500">· {p.client}</span>}
              </div>
              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl">
                {p.title}
              </h1>
              <p className="mt-4 text-lg leading-relaxed text-ink-600">{p.summary}</p>
            </div>
            {p.liveUrl && (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary"
              >
                Visit site <ExternalLink size={14} />
              </a>
            )}
          </div>
        </div>
      </section>

      {p.cover?.url && (
        <section>
          <div className="container-x">
            <div className="overflow-hidden rounded-2xl bg-ink-100 shadow-card">
              <img src={p.cover.url} alt={p.title} className="h-auto w-full" />
            </div>
          </div>
        </section>
      )}

      <section className="section pt-12">
        <div className="container-x grid gap-10 lg:grid-cols-[1fr_280px]">
          <article className="prose max-w-none" dangerouslySetInnerHTML={{ __html: p.content || '' }} />

          <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
            {!!p.stack?.length && (
              <div className="card p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500">
                  Tech stack
                </h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.stack.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {!!p.tags?.length && (
              <div className="card p-5">
                <h4 className="text-xs font-bold uppercase tracking-widest text-ink-500">Tags</h4>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {p.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </aside>
        </div>
      </section>

      {!!p.gallery?.length && (
        <section className="section pt-0">
          <div className="container-x">
            <h2 className="text-2xl font-extrabold text-ink-900">Gallery</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {p.gallery.map((g, i) => (
                <a
                  key={i}
                  href={g.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="overflow-hidden rounded-xl bg-ink-100"
                >
                  <img src={g.url} alt={g.alt || `Image ${i + 1}`} className="h-full w-full object-cover" />
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Working on something similar?"
        body="We'd love to learn about your project — share a brief and let's see how we can help."
      />
    </>
  );
}
