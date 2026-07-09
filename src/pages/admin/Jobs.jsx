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
  Users,
  Eye,
  ExternalLink,
  MapPin,
  Clock,
  IndianRupee,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Sparkles,
} from 'lucide-react';
import clsx from 'clsx';

import { jobApi } from '@/api/job.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';

const JOB_TYPES = ['', 'full-time', 'part-time', 'contract', 'internship', 'remote'];
const typeLabel = (t) => (t === '' ? 'All' : t.replace(/-/g, ' '));

const formatDate = (d) =>
  d ? new Date(d).toLocaleDateString(undefined, { dateStyle: 'medium' }) : '—';

const isClosed = (job) => job.closesAt && new Date(job.closesAt) < new Date();

export default function Jobs() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [type, setType] = useState('');
  const q = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'jobs', { page, q, type }],
    queryFn: () =>
      jobApi.listAdmin({ page, limit: 12, q: q || undefined, type: type || undefined }),
    keepPreviousData: true,
  });

  const items = data?.data || [];

  const stats = useMemo(() => {
    const total = items.length;
    const open = items.filter((j) => j.isActive && !isClosed(j)).length;
    const closed = items.filter((j) => isClosed(j)).length;
    const inactive = items.filter((j) => !j.isActive).length;
    const totalApps = items.reduce((acc, j) => acc + (j.applicationsCount || 0), 0);
    return { total, open, closed, inactive, totalApps };
  }, [items]);

  const removeMut = useMutation({
    mutationFn: (id) => jobApi.remove(id),
    onSuccess: () => {
      toast.success('Job deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'jobs'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  return (
    <>
      <Helmet>
        <title>Jobs — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Open roles"
          description="Job listings shown on the public career page. Create, view, edit, and delete here."
          actions={
            <Link to="/admin/jobs/new" className="btn-primary">
              <Plus size={16} /> New role
            </Link>
          }
        />

        {/* Stats strip */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total roles" value={stats.total} icon={Briefcase} tone="brand" />
          <StatCard label="Open" value={stats.open} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Closed / Off" value={stats.closed + stats.inactive} icon={XCircle} tone="ink" />
          <StatCard label="Applications" value={stats.totalApps} icon={Users} tone="amber" />
        </div>

        {/* Search + type filters */}
        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search roles…"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {JOB_TYPES.map((t) => (
              <button
                key={t || 'all'}
                onClick={() => {
                  setType(t);
                  setPage(1);
                }}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-medium capitalize transition',
                  t === type
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {typeLabel(t)}
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
            icon={Briefcase}
            title="No roles yet"
            description="Post a role to start collecting applications."
            action={
              <Link to="/admin/jobs/new" className="btn-primary">
                <Plus size={16} /> New role
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((j) => (
              <JobCard
                key={j._id}
                job={j}
                onView={() => setViewItem(j)}
                onDelete={() => setToDelete(j)}
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
        description="Jobs with applications cannot be deleted — set them inactive instead, or clear applications first."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <JobViewModal job={viewItem} onClose={() => setViewItem(null)} />
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

function JobCard({ job: j, onView, onDelete }) {
  const closed = isClosed(j);
  const statusCls = !j.isActive
    ? 'bg-ink-200/95 text-ink-700'
    : closed
      ? 'bg-red-100/95 text-red-800'
      : 'bg-emerald-100/95 text-emerald-800';
  const statusLabel = !j.isActive ? 'Inactive' : closed ? 'Closed' : 'Open';

  return (
    <div className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      {/* Top badges row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            <Briefcase size={9} /> {j.department}
          </span>
          <span className="rounded-full bg-ink-50 px-2 py-0.5 text-[10px] font-medium capitalize text-ink-700">
            {j.type.replace(/-/g, ' ')}
          </span>
          {j.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
              <Sparkles size={9} /> Featured
            </span>
          )}
        </div>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusCls}`}
        >
          {statusLabel}
        </span>
      </div>

      {/* Title + meta */}
      <h3 className="mt-4 line-clamp-2 text-lg font-extrabold leading-snug text-ink-900">
        {j.title}
      </h3>
      <p className="mt-0.5 text-[11px] text-ink-500">/{j.slug}</p>

      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">{j.summary}</p>

      <div className="mt-4 grid gap-1.5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <MapPin size={11} /> {j.location}
        </span>
        {j.experience && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={11} /> {j.experience}
          </span>
        )}
        {j.salaryRange && (
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-700">
            <IndianRupee size={11} /> {j.salaryRange}
          </span>
        )}
        {j.closesAt && (
          <span className="inline-flex items-center gap-1.5">
            <CalendarClock size={11} /> Closes {formatDate(j.closesAt)}
          </span>
        )}
      </div>

      {/* Applications + actions */}
      <div className="mt-5 flex items-center justify-between gap-1 border-t border-ink-100 pt-4">
        <Link
          to={`/admin/applications?job=${j._id}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-100"
        >
          <Users size={12} /> {j.applicationsCount ?? 0} applications
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
            to={`/admin/jobs/${j._id}/edit`}
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
  );
}

function JobViewModal({ job: j, onClose }) {
  if (!j) {
    return <Modal open={false} onClose={onClose}>{null}</Modal>;
  }
  const closed = isClosed(j);
  return (
    <Modal
      open={!!j}
      onClose={onClose}
      title={j.title}
      description={`${j.department} · ${j.location}`}
      size="2xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            to={`/admin/applications?job=${j._id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:underline"
            onClick={onClose}
          >
            <Users size={14} /> {j.applicationsCount ?? 0} applications
          </Link>
          <div className="flex gap-2">
            <button onClick={onClose} className="btn-outline">
              Close
            </button>
            {j.isActive && !closed && (
              <Link
                to={`/career/${j.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline"
              >
                <ExternalLink size={14} /> Public page
              </Link>
            )}
            <Link
              to={`/admin/jobs/${j._id}/edit`}
              className="btn-primary"
              onClick={onClose}
            >
              <Edit size={14} /> Edit
            </Link>
          </div>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Badges */}
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              !j.isActive
                ? 'bg-ink-200 text-ink-700'
                : closed
                  ? 'bg-red-100 text-red-800'
                  : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {!j.isActive ? 'Inactive' : closed ? 'Closed' : 'Open'}
          </span>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-700">
            {j.department}
          </span>
          <span className="rounded-full bg-ink-50 px-2.5 py-0.5 text-[11px] font-medium capitalize text-ink-700">
            {j.type.replace(/-/g, ' ')}
          </span>
          {j.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>

        {/* Summary */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Summary
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-800">{j.summary}</p>
        </div>

        {/* Meta grid */}
        <div className="grid gap-3 sm:grid-cols-2">
          <MetaRow icon={MapPin} label="Location" value={j.location} />
          <MetaRow icon={Clock} label="Experience" value={j.experience || '—'} />
          <MetaRow
            icon={IndianRupee}
            label="Salary range"
            value={j.salaryRange || '—'}
            highlight={!!j.salaryRange}
          />
          <MetaRow
            icon={CalendarClock}
            label="Closes"
            value={j.closesAt ? formatDate(j.closesAt) : 'No deadline'}
          />
        </div>

        {/* Long description */}
        {j.description && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Description
            </p>
            <article
              className="prose prose-sm mt-2 max-w-none rounded-xl border border-ink-100 bg-ink-50/40 p-4"
              dangerouslySetInnerHTML={{ __html: j.description }}
            />
          </div>
        )}

        {/* Responsibilities */}
        {!!j.responsibilities?.length && (
          <BulletList title="Responsibilities" items={j.responsibilities} />
        )}

        {/* Requirements */}
        {!!j.requirements?.length && (
          <BulletList title="Requirements" items={j.requirements} />
        )}

        {/* Benefits */}
        {!!j.benefits?.length && <BulletList title="Benefits" items={j.benefits} />}

        {/* SEO */}
        {(j.seo?.title || j.seo?.description) && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              SEO
            </p>
            <div className="mt-2 space-y-1.5 rounded-xl border border-ink-100 bg-ink-50/40 p-3 text-xs">
              {j.seo.title && (
                <p>
                  <span className="font-bold text-ink-700">Title:</span>{' '}
                  <span className="text-ink-800">{j.seo.title}</span>
                </p>
              )}
              {j.seo.description && (
                <p>
                  <span className="font-bold text-ink-700">Description:</span>{' '}
                  <span className="text-ink-800">{j.seo.description}</span>
                </p>
              )}
              {!!j.seo.keywords?.length && (
                <p>
                  <span className="font-bold text-ink-700">Keywords:</span>{' '}
                  <span className="text-ink-800">{j.seo.keywords.join(', ')}</span>
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

function MetaRow({ icon: Icon, label, value, highlight }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-500">
        <Icon size={11} /> {label}
      </p>
      <p
        className={`mt-1 text-sm font-semibold ${
          highlight ? 'text-emerald-700' : 'text-ink-800'
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function BulletList({ title, items }) {
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
        {title} ({items.length})
      </p>
      <ul className="mt-2 space-y-1.5">
        {items.map((it, i) => (
          <li
            key={i}
            className="flex items-start gap-2 rounded-lg bg-ink-50/40 px-3 py-2 text-sm text-ink-700"
          >
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-600" />
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
