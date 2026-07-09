import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Calendar } from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { blogApi } from '@/api/blog.api';
import { BLOG_PREVIEW, BLOG_COVER_IMAGE } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 18 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.5, ease: 'easeOut' },
  }),
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '';

// Normalize API blogs and placeholder previews into one shape so the card
// markup stays the same.
const normalize = (b) => ({
  slug: b.slug,
  title: b.title,
  excerpt: b.excerpt,
  cover:
    typeof b.cover === 'string'
      ? b.cover
      : b.cover?.url || BLOG_COVER_IMAGE,
  category: b.category?.name || b.category || 'Article',
  categoryColor: b.category?.color || null,
  date: b.publishedAt ? formatDate(b.publishedAt) : b.date,
  readTime: b.readTime
    ? typeof b.readTime === 'number'
      ? `${b.readTime} min`
      : b.readTime
    : '',
  accent: b.accent || 'from-brand-500 to-indigo-500',
});

export default function BlogStrip() {
  const { data } = useQuery({
    queryKey: ['public', 'blogs', 'preview'],
    queryFn: () => blogApi.listPublic({ limit: 3 }),
    staleTime: 5 * 60 * 1000,
  });

  const apiPosts = (data?.data || []).map(normalize);
  const posts = apiPosts.length > 0 ? apiPosts : BLOG_PREVIEW.map(normalize);

  if (posts.length === 0) return null;

  return (
    <section className="section">
      <div className="container-x">
        <div className="flex flex-col items-start gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            align="left"
            eyebrow="Insights"
            title="Notes from the marketing desk"
            subtitle="Practical writing on SEO, social, ads, and growing brands online."
          />
          <Link to="/blog" className="btn-outline shrink-0">
            Visit blog
          </Link>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 md:grid-cols-3 md:gap-6">
          {posts.slice(0, 3).map((b, i) => (
            <motion.article
              key={b.slug}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fade}
              custom={i}
            >
              <Link
                to={`/blog/${b.slug}`}
                className="group block h-full overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
              >
                <div className="relative h-32 overflow-hidden sm:h-44 md:h-48">
                  <img
                    src={b.cover}
                    alt={b.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div
                    aria-hidden
                    className={`absolute inset-0 bg-gradient-to-br ${b.accent} opacity-25 mix-blend-multiply transition-opacity group-hover:opacity-10`}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-ink-900/60 to-transparent"
                  />
                  <span
                    className="absolute left-4 top-4 inline-flex rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider shadow-soft backdrop-blur"
                    style={b.categoryColor ? { color: b.categoryColor } : { color: '#1a36dd' }}
                  >
                    {b.category}
                  </span>
                  {b.readTime && (
                    <div className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-ink-700 shadow-soft backdrop-blur">
                      <Clock size={11} /> {b.readTime}
                    </div>
                  )}
                </div>

                <div className="p-3 sm:p-5 lg:p-6">
                  {b.date && (
                    <div className="hidden items-center gap-1.5 text-[11px] font-medium text-ink-500 sm:flex">
                      <Calendar size={11} /> {b.date}
                    </div>
                  )}
                  <h3 className="mt-0 text-sm font-bold leading-snug text-ink-900 transition group-hover:text-brand-700 sm:mt-2 sm:text-base lg:text-lg">
                    {b.title}
                  </h3>
                  <p className="mt-1 hidden text-sm leading-relaxed text-ink-600 sm:mt-2 sm:line-clamp-2 sm:block">
                    {b.excerpt}
                  </p>
                  <span className="mt-2 hidden items-center gap-1.5 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2.5 sm:mt-4 sm:inline-flex">
                    Read article <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
