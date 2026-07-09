import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit,
  Trash2,
  Newspaper,
  Search,
  Eye,
  Calendar,
  Clock,
  ExternalLink,
  FileText,
  CheckCircle2,
  Tag as TagIcon,
} from 'lucide-react';
import clsx from 'clsx';

import { blogApi } from '@/api/blog.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import { BLOG_COVER_IMAGE } from '@/data/placeholders';

// Same fallback used on public Blog list / BlogDetail so admin + public match
const resolveBlogCover = (b) => b?.cover?.url || BLOG_COVER_IMAGE;

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
  { value: 'draft', label: 'Drafts' },
];

const statusOf = (b) => {
  if (b.status === 'draft') return { tone: 'gray', label: 'Draft' };
  if (b.publishedAt && new Date(b.publishedAt) > new Date()) {
    return { tone: 'amber', label: 'Scheduled' };
  }
  return { tone: 'green', label: 'Published' };
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

export default function Blogs() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const q = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'blogs', { page, q, status }],
    queryFn: () =>
      blogApi.listAdmin({
        page,
        limit: 12,
        q: q || undefined,
        status: status || undefined,
      }),
    keepPreviousData: true,
  });

  const items = data?.data || [];

  const stats = useMemo(() => {
    const total = items.length;
    const published = items.filter((b) => {
      const s = statusOf(b);
      return s.label === 'Published';
    }).length;
    const scheduled = items.filter((b) => statusOf(b).label === 'Scheduled').length;
    const drafts = items.filter((b) => statusOf(b).label === 'Draft').length;
    return { total, published, scheduled, drafts };
  }, [items]);

  const removeMut = useMutation({
    mutationFn: (id) => blogApi.remove(id),
    onSuccess: () => {
      toast.success('Article deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'blogs'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  return (
    <>
      <Helmet>
        <title>Blogs — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Blog articles"
          description="Long-form posts published on the public blog. Create, view, edit, and delete here."
          actions={
            <>
              <Link to="/admin/blog-categories" className="btn-outline">
                Categories
              </Link>
              <Link to="/admin/blogs/new" className="btn-primary">
                <Plus size={16} /> New article
              </Link>
            </>
          }
        />

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} icon={FileText} tone="brand" />
          <StatCard label="Published" value={stats.published} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Scheduled" value={stats.scheduled} icon={Calendar} tone="amber" />
          <StatCard label="Drafts" value={stats.drafts} icon={Edit} tone="ink" />
        </div>

        {/* Search + filters */}
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search articles…"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.value || 'all'}
                onClick={() => {
                  setStatus(f.value);
                  setPage(1);
                }}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-medium transition',
                  f.value === status
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !items.length ? (
          <EmptyState
            icon={Newspaper}
            title="No articles yet"
            description="Write your first article to launch your blog."
            action={
              <Link to="/admin/blogs/new" className="btn-primary">
                <Plus size={16} /> New article
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((b) => (
              <BlogCard
                key={b._id}
                blog={b}
                onView={() => setViewItem(b)}
                onDelete={() => setToDelete(b)}
              />
            ))}
          </div>
        )}

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete "${toDelete?.title}"?`}
        description="The article and its cover image will be permanently removed."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <BlogViewModal blog={viewItem} onClose={() => setViewItem(null)} />
    </>
  );
}

const TONE_CLS = {
  brand: 'bg-brand-50 text-brand-700',
  emerald: 'bg-emerald-50 text-emerald-700',
  amber: 'bg-amber-50 text-amber-700',
  ink: 'bg-ink-100 text-ink-700',
};

function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-ink-100 bg-white p-4 shadow-soft">
      <div className={`grid h-11 w-11 place-items-center rounded-xl ${TONE_CLS[tone]}`}>
        <Icon size={18} />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
          {label}
        </p>
        <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function BlogCard({ blog: b, onView, onDelete }) {
  const s = statusOf(b);
  const statusToneCls = {
    green: 'bg-emerald-100/95 text-emerald-800',
    amber: 'bg-amber-100/95 text-amber-800',
    gray: 'bg-ink-200/95 text-ink-700',
  }[s.tone];

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-brand-500 to-indigo-600">
        <img
          src={resolveBlogCover(b)}
          alt=""
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/50 to-transparent"
        />
        <div className="absolute right-3 top-3 flex gap-1.5">
          {b.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 shadow-soft backdrop-blur">
              Featured
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft backdrop-blur ${statusToneCls}`}
          >
            {s.label}
          </span>
        </div>
        {b.category && (
          <span
            className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-soft backdrop-blur"
            style={{ backgroundColor: `${b.category.color}d9` }}
          >
            <TagIcon size={9} /> {b.category.name}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="line-clamp-2 font-extrabold leading-snug text-ink-900">{b.title}</h3>
        <p className="mt-0.5 text-[11px] text-ink-500">/{b.slug}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {b.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 text-[11px] text-ink-500">
          <span className="inline-flex items-center gap-1">
            <Calendar size={11} /> {formatDate(b.publishedAt || b.updatedAt)}
          </span>
          {b.readTime && (
            <span className="inline-flex items-center gap-1">
              <Clock size={11} /> {b.readTime} min
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-1 border-t border-ink-100 pt-4">
          {b.status === 'draft' ? (
            <span className="text-xs font-medium text-ink-400">Not published yet</span>
          ) : (
            <Link
              to={`/blog/${b.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-ink-500 hover:text-brand-700"
            >
              <span className="inline-flex items-center gap-1">
                <ExternalLink size={11} /> Public page
              </span>
            </Link>
          )}
          <div className="flex items-center gap-0.5">
            <button
              onClick={onView}
              className="btn-ghost p-1.5"
              aria-label="View"
              title="Quick view"
            >
              <Eye size={15} />
            </button>
            <Link
              to={`/admin/blogs/${b._id}/edit`}
              className="btn-ghost p-1.5"
              aria-label="Edit"
              title="Edit"
            >
              <Edit size={15} />
            </Link>
            <button
              onClick={onDelete}
              className="btn-ghost p-1.5 text-red-600 hover:bg-red-50"
              aria-label="Delete"
              title="Delete"
            >
              <Trash2 size={15} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BlogViewModal({ blog: b, onClose }) {
  const s = b ? statusOf(b) : null;
  return (
    <Modal
      open={!!b}
      onClose={onClose}
      title={b?.title}
      description={b ? `/${b.slug}` : undefined}
      size="2xl"
      footer={
        b && (
          <div className="flex flex-wrap justify-end gap-2">
            <button onClick={onClose} className="btn-outline">
              Close
            </button>
            {b.status !== 'draft' && (
              <Link
                to={`/blog/${b.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <ExternalLink size={14} /> Public page
              </Link>
            )}
            <Link
              to={`/admin/blogs/${b._id}/edit`}
              className="btn-primary"
              onClick={onClose}
            >
              <Edit size={14} /> Edit
            </Link>
          </div>
        )
      }
    >
      {!b ? null : (
        <div className="space-y-5">
          <div className="overflow-hidden rounded-xl">
            <img
              src={resolveBlogCover(b)}
              alt={b.title}
              className="h-44 w-full object-cover sm:h-56"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                s.tone === 'green'
                  ? 'bg-emerald-100 text-emerald-800'
                  : s.tone === 'amber'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-ink-200 text-ink-700'
              }`}
            >
              {s.label}
            </span>
            {b.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                Featured
              </span>
            )}
            {b.category && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold text-white"
                style={{ backgroundColor: b.category.color }}
              >
                {b.category.name}
              </span>
            )}
            <span className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700">
              {b.readTime} min read
            </span>
          </div>

          {/* Excerpt */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Excerpt
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{b.excerpt}</p>
          </div>

          {/* Meta */}
          <div className="grid gap-3 sm:grid-cols-2">
            <MetaRow label="Author" value={b.author?.name || '—'} />
            <MetaRow label="Published" value={formatDate(b.publishedAt)} />
            <MetaRow label="Updated" value={formatDate(b.updatedAt)} />
            <MetaRow
              label="Tags"
              value={b.tags?.length ? b.tags.map((t) => `#${t}`).join(' ') : '—'}
            />
          </div>

          {/* Content preview */}
          {b.content && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Content preview
              </p>
              <article
                className="prose prose-sm mt-2 max-w-none rounded-xl border border-ink-100 bg-ink-50/40 p-4"
                dangerouslySetInnerHTML={{ __html: b.content }}
              />
            </div>
          )}

          {/* SEO */}
          {(b.seo?.title || b.seo?.description) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                SEO
              </p>
              <div className="mt-2 space-y-1.5 rounded-xl border border-ink-100 bg-ink-50/40 p-3 text-xs">
                {b.seo.title && (
                  <p>
                    <span className="font-bold text-ink-700">Title:</span>{' '}
                    <span className="text-ink-800">{b.seo.title}</span>
                  </p>
                )}
                {b.seo.description && (
                  <p>
                    <span className="font-bold text-ink-700">Description:</span>{' '}
                    <span className="text-ink-800">{b.seo.description}</span>
                  </p>
                )}
                {!!b.seo.keywords?.length && (
                  <p>
                    <span className="font-bold text-ink-700">Keywords:</span>{' '}
                    <span className="text-ink-800">{b.seo.keywords.join(', ')}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}

function MetaRow({ label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3">
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
        {label}
      </p>
      <p className="mt-1 truncate text-sm text-ink-800">{value}</p>
    </div>
  );
}
