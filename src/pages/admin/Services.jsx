import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit,
  Trash2,
  Briefcase,
  Search,
  Eye,
  Star,
  CheckCircle2,
  XCircle,
  Layers,
  ExternalLink,
} from 'lucide-react';

import { serviceApi } from '@/api/service.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import { SERVICES as SERVICE_IMAGES } from '@/data/placeholders';

// slug → local image, mirrors public Services list / ServiceDetail behavior
const imageBySlug = SERVICE_IMAGES.reduce((acc, s) => {
  acc[s.slug] = s.image;
  return acc;
}, {});

const resolveServiceImage = (s) => s?.banner?.url || imageBySlug[s?.slug] || null;

export default function Services() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'services', { page, q }],
    queryFn: () => serviceApi.listAdmin({ page, limit: 12, q: q || undefined }),
    keepPreviousData: true,
  });

  const items = data?.data || [];

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((s) => s.isActive).length;
    const featured = items.filter((s) => s.isFeatured).length;
    return { total, active, inactive: total - active, featured };
  }, [items]);

  const removeMut = useMutation({
    mutationFn: (id) => serviceApi.remove(id),
    onSuccess: () => {
      toast.success('Service deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'services'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  return (
    <>
      <Helmet>
        <title>Services — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Services"
          description="Capabilities shown on the public site. Create, edit, view, and delete here."
          actions={
            <Link to="/admin/services/new" className="btn-primary">
              <Plus size={16} /> New service
            </Link>
          }
        />

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} icon={Layers} tone="brand" />
          <StatCard label="Active" value={stats.active} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Inactive" value={stats.inactive} icon={XCircle} tone="ink" />
          <StatCard label="Featured" value={stats.featured} icon={Star} tone="amber" />
        </div>

        {/* Search */}
        <div className="card p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search services…"
              className="input pl-9"
            />
          </div>
        </div>

        {/* Cards grid */}
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !items.length ? (
          <EmptyState
            icon={Briefcase}
            title="No services yet"
            description="Add your first service to start showing it on the public site."
            action={
              <Link to="/admin/services/new" className="btn-primary">
                <Plus size={16} /> New service
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((s) => (
              <ServiceCard
                key={s._id}
                service={s}
                onView={() => setViewItem(s)}
                onDelete={() => setToDelete(s)}
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
        description="The service will be removed from the public site immediately. Its banner image will also be removed from storage."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <ServiceViewModal service={viewItem} onClose={() => setViewItem(null)} />
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

function ServiceCard({ service: s, onView, onDelete }) {
  const image = resolveServiceImage(s);
  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink-100 bg-white transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      {/* Banner */}
      <div className="relative h-36 overflow-hidden bg-gradient-to-br from-brand-500 via-brand-600 to-indigo-600">
        {image ? (
          <img
            src={image}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="grid h-full w-full place-items-center text-white">
            <Briefcase size={32} />
          </div>
        )}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-ink-900/40 to-transparent"
        />
        <div className="absolute right-3 top-3 flex gap-1.5">
          {s.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100/95 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800 shadow-soft backdrop-blur">
              <Star size={9} className="fill-amber-600 text-amber-600" /> Featured
            </span>
          )}
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider shadow-soft backdrop-blur ${
              s.isActive
                ? 'bg-emerald-100/95 text-emerald-800'
                : 'bg-ink-200/95 text-ink-700'
            }`}
          >
            {s.isActive ? 'Active' : 'Inactive'}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-extrabold text-ink-900">{s.title}</h3>
        <p className="mt-0.5 text-[11px] text-ink-500">/{s.slug}</p>
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">
          {s.shortDesc}
        </p>

        {!!s.technologies?.length && (
          <div className="mt-4 flex flex-wrap gap-1">
            {s.technologies.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-medium text-ink-700"
              >
                {t}
              </span>
            ))}
            {s.technologies.length > 4 && (
              <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-medium text-ink-500">
                +{s.technologies.length - 4}
              </span>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto flex items-center justify-between gap-1 border-t border-ink-100 pt-4">
          <Link
            to={`/services/${s.slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-ink-500 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-1">
              <ExternalLink size={11} /> Public page
            </span>
          </Link>
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
              to={`/admin/services/${s._id}/edit`}
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

function ServiceViewModal({ service: s, onClose }) {
  return (
    <Modal
      open={!!s}
      onClose={onClose}
      title={s?.title}
      description={s ? `/${s.slug}` : undefined}
      size="2xl"
      footer={
        s && (
          <div className="flex flex-wrap justify-end gap-2">
            <button onClick={onClose} className="btn-outline">
              Close
            </button>
            <Link
              to={`/services/${s.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <ExternalLink size={14} /> Public page
            </Link>
            <Link
              to={`/admin/services/${s._id}/edit`}
              className="btn-primary"
              onClick={onClose}
            >
              <Edit size={14} /> Edit
            </Link>
          </div>
        )
      }
    >
      {!s ? null : (
        <div className="space-y-5">
          {/* Banner — uses banner.url, else falls back to public-site image */}
          {resolveServiceImage(s) && (
            <div className="overflow-hidden rounded-xl">
              <img
                src={resolveServiceImage(s)}
                alt={s.title}
                className="h-40 w-full object-cover sm:h-52"
              />
            </div>
          )}

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
                s.isActive
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-ink-200 text-ink-700'
              }`}
            >
              {s.isActive ? 'Active' : 'Inactive'}
            </span>
            {s.isFeatured && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
                <Star size={10} /> Featured
              </span>
            )}
            <span className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium text-ink-700">
              Order: {s.order ?? 0}
            </span>
          </div>

          {/* Short description */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Short description
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{s.shortDesc}</p>
          </div>

          {/* Technologies */}
          {!!s.technologies?.length && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Technologies
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {s.technologies.map((t) => (
                  <span
                    key={t}
                    className="rounded-full bg-ink-50 px-2.5 py-0.5 text-xs font-medium text-ink-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Features */}
          {!!s.features?.length && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Features ({s.features.length})
              </p>
              <ul className="mt-2 space-y-2">
                {s.features.map((f, i) => (
                  <li
                    key={i}
                    className="rounded-xl border border-ink-100 bg-ink-50/40 p-3 text-sm"
                  >
                    <p className="font-bold text-ink-900">{f.title}</p>
                    {f.description && (
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
                        {f.description}
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Long description */}
          {s.fullDesc && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                Long description
              </p>
              <article
                className="prose prose-sm mt-2 max-w-none rounded-xl border border-ink-100 bg-ink-50/40 p-4"
                dangerouslySetInnerHTML={{ __html: s.fullDesc }}
              />
            </div>
          )}

          {/* SEO */}
          {(s.seo?.title || s.seo?.description) && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                SEO
              </p>
              <div className="mt-2 space-y-1.5 rounded-xl border border-ink-100 bg-ink-50/40 p-3 text-xs">
                {s.seo.title && (
                  <p>
                    <span className="font-bold text-ink-700">Title:</span>{' '}
                    <span className="text-ink-800">{s.seo.title}</span>
                  </p>
                )}
                {s.seo.description && (
                  <p>
                    <span className="font-bold text-ink-700">Description:</span>{' '}
                    <span className="text-ink-800">{s.seo.description}</span>
                  </p>
                )}
                {!!s.seo.keywords?.length && (
                  <p>
                    <span className="font-bold text-ink-700">Keywords:</span>{' '}
                    <span className="text-ink-800">{s.seo.keywords.join(', ')}</span>
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
