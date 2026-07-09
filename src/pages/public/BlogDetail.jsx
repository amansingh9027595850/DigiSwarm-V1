import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  User,
  Share2,
  Twitter,
  Facebook,
  Linkedin,
  Link2,
} from 'lucide-react';

import { blogApi } from '@/api/blog.api';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';
import CtaBanner from '@/components/sections/CtaBanner';
import { BLOG_COVER_IMAGE } from '@/data/placeholders';

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'long' }) : '';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

function ReadingProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrolled = h.scrollTop;
      const height = h.scrollHeight - h.clientHeight;
      setProgress(height > 0 ? Math.min(100, (scrolled / height) * 100) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1 bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function ShareButtons({ title }) {
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const enc = (s) => encodeURIComponent(s);

  const links = [
    {
      icon: Twitter,
      label: 'Twitter',
      href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(title)}`,
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}`,
    },
    {
      icon: Facebook,
      label: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}`,
    },
  ];

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-500">
        <Share2 size={12} /> Share
      </span>
      {links.map(({ icon: Icon, label, href }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${label}`}
          className="grid h-9 w-9 place-items-center rounded-lg border border-ink-100 bg-white text-ink-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
        >
          <Icon size={15} />
        </a>
      ))}
      <button
        onClick={copy}
        aria-label="Copy link"
        className="grid h-9 w-9 place-items-center rounded-lg border border-ink-100 bg-white text-ink-600 transition hover:-translate-y-0.5 hover:border-brand-200 hover:text-brand-700"
      >
        <Link2 size={15} />
      </button>
    </div>
  );
}

export default function BlogDetail() {
  const { slug } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['public', 'blog', slug],
    queryFn: () => blogApi.getBySlug(slug),
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (isError || !data?.data?.blog) {
    return (
      <section className="section">
        <div className="container-x">
          <EmptyState
            title="Article not found"
            description="The article you're looking for has moved or isn't published."
            action={
              <Link to="/blog" className="btn-primary">
                <ArrowLeft size={16} /> Back to blog
              </Link>
            }
          />
        </div>
      </section>
    );
  }

  const { blog: b, related } = data.data;

  return (
    <>
      <Helmet>
        <title>{b.seo?.title || b.title} — DigiSwarm Blog</title>
        <meta name="description" content={b.seo?.description || b.excerpt} />
      </Helmet>

      <ReadingProgress />

      {/* HEADER */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50/50 via-white to-white" />
        <div className="container-x pt-12 pb-6 md:pt-16">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-500 transition hover:text-brand-700"
          >
            <ArrowLeft size={14} /> Back to blog
          </Link>

          <div className="mx-auto mt-8 max-w-3xl text-center">
            {b.category && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold text-white"
                style={{ backgroundColor: b.category.color }}
              >
                {b.category.name}
              </span>
            )}
            <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-5xl md:text-6xl">
              {b.title}
            </h1>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-ink-600">
              {b.excerpt}
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-4 text-sm text-ink-500">
              {b.author && (
                <span className="inline-flex items-center gap-2">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-100 text-[10px] font-bold text-brand-700">
                    {initialsOf(b.author.name)}
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-ink-700">
                    <User size={13} /> {b.author.name}
                  </span>
                </span>
              )}
              <span className="text-ink-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} /> {formatDate(b.publishedAt)}
              </span>
              <span className="text-ink-300">·</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock size={13} /> {b.readTime} min read
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* COVER */}
      {b.cover?.url && (
        <section>
          <div className="container-x">
            <div className="mx-auto max-w-4xl overflow-hidden rounded-2xl bg-ink-100 shadow-card">
              <img
                src={b.cover.url}
                alt={b.title}
                className="h-auto w-full"
                loading="eager"
              />
            </div>
          </div>
        </section>
      )}

      {/* CONTENT */}
      <section className="section">
        <div className="container-x">
          <article
            className="prose mx-auto max-w-3xl"
            dangerouslySetInnerHTML={{ __html: b.content || '' }}
          />

          <div className="mx-auto mt-10 max-w-3xl space-y-6 border-t border-ink-100 pt-6">
            {!!b.tags?.length && (
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                  Tagged
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {b.tags.map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-ink-50 px-2.5 py-1 text-xs font-medium text-ink-700"
                    >
                      #{t}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <ShareButtons title={b.title} />

            {b.author && (
              <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-white p-5">
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-brand-100 text-base font-extrabold text-brand-700">
                  {initialsOf(b.author.name)}
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                    Written by
                  </p>
                  <p className="font-bold text-ink-900">{b.author.name}</p>
                  {b.author.role && (
                    <p className="text-sm text-ink-500">{b.author.role}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RELATED */}
      {!!related?.length && (
        <section className="section pt-0">
          <div className="container-x">
            <div className="flex items-end justify-between gap-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-brand-700">
                  Keep reading
                </span>
                <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:text-3xl">
                  More from the blog
                </h2>
              </div>
              <Link to="/blog" className="btn-outline shrink-0">
                All articles
              </Link>
            </div>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {related.map((r) => (
                <Link
                  key={r._id}
                  to={`/blog/${r.slug}`}
                  className="group block overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:shadow-card"
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-500 to-indigo-500">
                    <img
                      src={r.cover?.url || BLOG_COVER_IMAGE}
                      alt=""
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="line-clamp-2 text-base font-bold text-ink-900 transition group-hover:text-brand-700">
                      {r.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-ink-600">{r.excerpt}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-700 transition-all group-hover:gap-2.5">
                      Read <ArrowRight size={12} />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBanner
        title="Like what you read?"
        body="If our writing resonates, you'll probably like working with us. Get in touch."
        primary={{ to: '/contact', label: 'Contact us' }}
        secondary={{ to: '/services', label: 'View services' }}
      />
    </>
  );
}
