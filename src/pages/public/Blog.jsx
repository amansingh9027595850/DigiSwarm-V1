import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Newspaper, Search, Sparkles, User } from 'lucide-react';
import clsx from 'clsx';

import { blogApi } from '@/api/blog.api';
import { blogCategoryApi } from '@/api/blogCategory.api';
import { useDebounce } from '@/hooks/useDebounce';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import CtaBanner from '@/components/sections/CtaBanner';
import { BLOG_COVER_IMAGE } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05, duration: 0.45, ease: 'easeOut' },
  }),
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

export default function Blog() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const { data: catRes } = useQuery({
    queryKey: ['public', 'blog-categories'],
    queryFn: () => blogCategoryApi.listPublic(),
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'blogs', { page, category, q }],
    queryFn: () =>
      blogApi.listPublic({
        page,
        limit: 9,
        category: category || undefined,
        q: q || undefined,
      }),
    keepPreviousData: true,
  });

  const categories = catRes?.data || [];
  const posts = data?.data || [];

  // Show featured post only on first page when no filters
  const showFeatured = page === 1 && !category && !q && posts.length > 0;
  const featured = showFeatured ? posts[0] : null;
  const rest = showFeatured ? posts.slice(1) : posts;

  return (
    <>
      <Helmet>
        <title>Blog — DigiSwarm</title>
        <meta
          name="description"
          content="Practical writing on digital marketing, SEO, social media, and growth — from the DigiSwarm team."
        />
      </Helmet>

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/70 via-white to-white" />
        <div className="absolute -top-32 left-1/2 -z-10 h-80 w-80 -translate-x-1/2 rounded-full bg-brand-200/40 blur-3xl" />

        <div className="container-x pt-12 pb-6 md:pt-16">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-1 text-xs font-semibold text-brand-700 shadow-soft">
              <Sparkles size={14} /> Insights
            </span>
            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
              Notes from the{' '}
              <span className="bg-gradient-to-r from-brand-600 to-indigo-500 bg-clip-text text-transparent">
                marketing desk
              </span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-ink-600 sm:text-lg">
              Tactics, experiments, and lessons from real campaigns. Practical writing — no
              fluff.
            </p>

            <div className="mx-auto mt-9 max-w-md">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
                />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Search articles…"
                  className="input pl-9"
                  aria-label="Search articles"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CATEGORY CHIPS */}
      {categories.length > 0 && (
        <section className="pb-2">
          <div className="container-x">
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                onClick={() => {
                  setCategory('');
                  setPage(1);
                }}
                className={clsx(
                  'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                  !category
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                All
              </button>
              {categories.map((c) => {
                const active = c.slug === category;
                return (
                  <button
                    key={c._id}
                    onClick={() => {
                      setCategory(c.slug);
                      setPage(1);
                    }}
                    className={clsx(
                      'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                      active
                        ? 'border-transparent text-white'
                        : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                    )}
                    style={active ? { backgroundColor: c.color } : undefined}
                  >
                    {c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <section className="section pt-8">
        <div className="container-x space-y-10">
          {isLoading ? (
            <div className="flex min-h-[200px] items-center justify-center">
              <Loader />
            </div>
          ) : isError ? (
            <EmptyState
              title="Couldn't load articles"
              description="Please try again in a moment."
            />
          ) : !posts.length ? (
            <EmptyState
              icon={Newspaper}
              title={search || category ? 'No articles match' : 'No articles yet'}
              description={
                search || category
                  ? 'Try a different search or category.'
                  : 'Our writers are warming up — check back soon.'
              }
            />
          ) : (
            <>
              {/* FEATURED */}
              {featured && (
                <motion.article
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Link
                    to={`/blog/${featured.slug}`}
                    className="group grid gap-6 overflow-hidden rounded-3xl border border-ink-100 bg-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-card lg:grid-cols-2"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600 lg:aspect-auto">
                      <img
                        src={featured.cover?.url || BLOG_COVER_IMAGE}
                        alt=""
                        className="h-full w-full object-cover transition group-hover:scale-105"
                        loading="lazy"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-tr from-ink-900/40 via-transparent to-transparent"
                      />
                      <span className="absolute left-5 top-5 inline-flex items-center gap-1 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-brand-700 shadow-soft">
                        <Sparkles size={11} /> Featured
                      </span>
                    </div>
                    <div className="flex flex-col justify-center p-6 sm:p-10">
                      {featured.category && (
                        <span
                          className="inline-flex w-fit items-center rounded-full px-3 py-1 text-[11px] font-semibold text-white"
                          style={{ backgroundColor: featured.category.color }}
                        >
                          {featured.category.name}
                        </span>
                      )}
                      <h2 className="mt-4 text-2xl font-extrabold leading-tight text-ink-900 transition group-hover:text-brand-700 sm:text-3xl md:text-4xl">
                        {featured.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-base leading-relaxed text-ink-600">
                        {featured.excerpt}
                      </p>
                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs text-ink-500">
                        {featured.author && (
                          <span className="inline-flex items-center gap-1.5">
                            <User size={12} /> {featured.author.name}
                          </span>
                        )}
                        <span>{formatDate(featured.publishedAt)}</span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={12} /> {featured.readTime} min
                        </span>
                      </div>
                      <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5">
                        Read article <ArrowRight size={14} />
                      </span>
                    </div>
                  </Link>
                </motion.article>
              )}

              {/* GRID */}
              {rest.length > 0 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {rest.map((b, i) => (
                    <motion.article
                      key={b._id}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true, amount: 0.2 }}
                      variants={fade}
                      custom={i}
                    >
                      <Link
                        to={`/blog/${b.slug}`}
                        className="group block h-full overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
                      >
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-500 to-indigo-500">
                          <img
                            src={b.cover?.url || BLOG_COVER_IMAGE}
                            alt=""
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            loading="lazy"
                          />
                          <div
                            aria-hidden
                            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-900/60 to-transparent"
                          />
                          {b.category && (
                            <span
                              className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white shadow-soft backdrop-blur"
                              style={{ backgroundColor: `${b.category.color}e6` }}
                            >
                              {b.category.name}
                            </span>
                          )}
                        </div>
                        <div className="p-6">
                          <h3 className="line-clamp-2 text-lg font-bold text-ink-900 transition group-hover:text-brand-700">
                            {b.title}
                          </h3>
                          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink-600">
                            {b.excerpt}
                          </p>
                          <div className="mt-5 flex items-center gap-3 border-t border-ink-100 pt-4">
                            {b.author && (
                              <div className="grid h-7 w-7 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                                {initialsOf(b.author.name)}
                              </div>
                            )}
                            <div className="flex-1 text-xs text-ink-500">
                              <span>{formatDate(b.publishedAt)}</span>
                              <span className="mx-1.5 text-ink-300">·</span>
                              <span className="inline-flex items-center gap-1">
                                <Clock size={11} /> {b.readTime} min
                              </span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </div>
              )}

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
