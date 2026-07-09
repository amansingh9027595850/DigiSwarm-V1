import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Eye,
  Users,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  CheckCircle2,
  XCircle,
  ExternalLink,
  GraduationCap,
  Download,
  Phone,
} from 'lucide-react';
import clsx from 'clsx';

import { workshopApi } from '@/api/workshop.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';
import StatusBadge from '@/components/common/StatusBadge';

const formatDate = (d, opts = { dateStyle: 'medium', timeStyle: 'short' }) =>
  d ? new Date(d).toLocaleString(undefined, opts) : '—';

const isPast = (date) => date && new Date(date) < new Date();

const REGISTRATION_STATUSES = [
  { value: 'new', label: 'New', tone: 'blue' },
  { value: 'confirmed', label: 'Confirmed', tone: 'amber' },
  { value: 'attended', label: 'Attended', tone: 'green' },
  { value: 'no-show', label: 'No-show', tone: 'gray' },
  { value: 'cancelled', label: 'Cancelled', tone: 'red' },
];

export default function Workshops() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState(null);
  const [viewItem, setViewItem] = useState(null);
  const [registrationsOf, setRegistrationsOf] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'workshops', { page, q }],
    queryFn: () => workshopApi.listAdmin({ page, limit: 12, q: q || undefined }),
    keepPreviousData: true,
  });

  const items = data?.data || [];

  const stats = useMemo(() => {
    const total = items.length;
    const upcoming = items.filter((w) => w.isActive && !isPast(w.eventDate)).length;
    const past = items.filter((w) => isPast(w.eventDate)).length;
    const totalRegistrations = items.reduce((acc, w) => acc + (w.registrationsCount || 0), 0);
    return { total, upcoming, past, totalRegistrations };
  }, [items]);

  const removeMut = useMutation({
    mutationFn: (id) => workshopApi.remove(id),
    onSuccess: () => {
      toast.success('Workshop deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  return (
    <>
      <Helmet>
        <title>Workshops — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Workshops"
          description="Create and manage workshops, view registrations, and follow up with applicants."
          actions={
            <Link to="/admin/workshops/new" className="btn-primary">
              <Plus size={16} /> New workshop
            </Link>
          }
        />

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Total" value={stats.total} icon={GraduationCap} tone="brand" />
          <StatCard label="Upcoming" value={stats.upcoming} icon={CheckCircle2} tone="emerald" />
          <StatCard label="Past" value={stats.past} icon={XCircle} tone="ink" />
          <StatCard
            label="Registrations"
            value={stats.totalRegistrations}
            icon={Users}
            tone="amber"
          />
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
              placeholder="Search workshops…"
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
            icon={GraduationCap}
            title="No workshops yet"
            description="Create a workshop to start collecting registrations."
            action={
              <Link to="/admin/workshops/new" className="btn-primary">
                <Plus size={16} /> New workshop
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((w) => (
              <WorkshopCard
                key={w._id}
                workshop={w}
                onView={() => setViewItem(w)}
                onViewRegistrations={() => setRegistrationsOf(w)}
                onDelete={() => setToDelete(w)}
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
        description="The workshop and all of its registrations will be permanently removed."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <WorkshopViewModal workshop={viewItem} onClose={() => setViewItem(null)} />
      <RegistrationsModal
        workshop={registrationsOf}
        onClose={() => setRegistrationsOf(null)}
      />
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
        <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">{label}</p>
        <p className="text-2xl font-extrabold text-ink-900">{value}</p>
      </div>
    </div>
  );
}

function WorkshopCard({ workshop: w, onView, onViewRegistrations, onDelete }) {
  const past = isPast(w.eventDate);
  const statusCls = !w.isActive
    ? 'bg-ink-200/95 text-ink-700'
    : past
      ? 'bg-red-100/95 text-red-800'
      : 'bg-emerald-100/95 text-emerald-800';
  const statusLabel = !w.isActive ? 'Inactive' : past ? 'Past' : 'Upcoming';

  const seatsLeft = w.seats > 0 ? Math.max(0, w.seats - (w.registrationsCount || 0)) : null;

  return (
    <div className="group relative flex flex-col rounded-2xl border border-ink-100 bg-white p-5 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
            <GraduationCap size={9} /> {w.mode || 'offline'}
          </span>
          {w.isFree && (
            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-800">
              Free
            </span>
          )}
          {w.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-fuchsia-100 to-rose-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-rose-800">
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

      <h3 className="mt-4 line-clamp-2 text-lg font-extrabold leading-snug text-ink-900">
        {w.title}
      </h3>
      <p className="mt-0.5 text-[11px] text-ink-500">/{w.slug}</p>

      {w.tagline && (
        <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-ink-600">{w.tagline}</p>
      )}

      <div className="mt-4 grid gap-1.5 text-xs text-ink-500">
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={11} /> {formatDate(w.eventDate)}
        </span>
        {w.location && (
          <span className="inline-flex items-center gap-1.5">
            <MapPin size={11} /> {w.location}
          </span>
        )}
        {w.durationHours && (
          <span className="inline-flex items-center gap-1.5">
            <Clock size={11} /> {w.durationHours}h
          </span>
        )}
      </div>

      {/* Registrations summary */}
      <button
        onClick={onViewRegistrations}
        className="mt-4 flex items-center justify-between gap-2 rounded-xl border border-ink-100 bg-ink-50/60 px-3 py-2.5 text-left transition hover:border-brand-200 hover:bg-brand-50"
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
            Registrations
          </p>
          <p className="mt-0.5 text-sm font-bold text-ink-900">
            {w.registrationsCount || 0}
            {w.seats > 0 && (
              <span className="ml-1 text-xs font-medium text-ink-500">
                / {w.seats} seats {seatsLeft > 0 && `· ${seatsLeft} left`}
              </span>
            )}
          </p>
        </div>
        <Users size={14} className="shrink-0 text-brand-600" />
      </button>

      {/* Actions */}
      <div className="mt-4 flex items-center justify-between gap-1 border-t border-ink-100 pt-4">
        {w.isActive && !past ? (
          <Link
            to="/workshop"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-ink-500 hover:text-brand-700"
          >
            <span className="inline-flex items-center gap-1">
              <ExternalLink size={11} /> Public page
            </span>
          </Link>
        ) : (
          <span className="text-xs font-medium text-ink-400">Not public</span>
        )}
        <div className="flex items-center gap-0.5">
          <button onClick={onView} className="btn-ghost p-1.5" aria-label="View" title="Quick view">
            <Eye size={15} />
          </button>
          <Link
            to={`/admin/workshops/${w._id}/edit`}
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

function WorkshopViewModal({ workshop: w, onClose }) {
  if (!w) {
    return <Modal open={false} onClose={onClose}>{null}</Modal>;
  }
  const past = isPast(w.eventDate);
  return (
    <Modal
      open={!!w}
      onClose={onClose}
      title={w.title}
      description={`${w.mode || 'offline'} · ${formatDate(w.eventDate)}`}
      size="2xl"
      footer={
        <div className="flex flex-wrap justify-end gap-2">
          <button onClick={onClose} className="btn-outline">
            Close
          </button>
          {w.isActive && !past && (
            <Link
              to="/workshop"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline"
            >
              <ExternalLink size={14} /> Public page
            </Link>
          )}
          <Link to={`/admin/workshops/${w._id}/edit`} className="btn-primary" onClick={onClose}>
            <Edit size={14} /> Edit
          </Link>
        </div>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              !w.isActive
                ? 'bg-ink-200 text-ink-700'
                : past
                  ? 'bg-red-100 text-red-800'
                  : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            {!w.isActive ? 'Inactive' : past ? 'Past' : 'Upcoming'}
          </span>
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-brand-700">
            {w.mode || 'offline'}
          </span>
          {w.isFree && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-amber-800">
              Free
            </span>
          )}
        </div>

        {w.tagline && <p className="text-sm leading-relaxed text-ink-700">{w.tagline}</p>}

        <div className="grid gap-3 sm:grid-cols-2">
          <Meta icon={Calendar} label="Event date" value={formatDate(w.eventDate)} />
          <Meta icon={Clock} label="Duration" value={`${w.durationHours || '—'}h`} />
          <Meta icon={MapPin} label="Location" value={w.location || '—'} />
          <Meta
            icon={Users}
            label="Seats"
            value={
              w.seats > 0
                ? `${w.registrationsCount || 0} / ${w.seats}`
                : `${w.registrationsCount || 0} registered`
            }
            highlight
          />
        </div>

        {w.address && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Address
            </p>
            <p className="mt-1 text-sm text-ink-800">{w.address}</p>
          </div>
        )}

        {!!w.perks?.length && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Perks ({w.perks.length})
            </p>
            <ul className="mt-2 space-y-1.5">
              {w.perks.map((p, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 rounded-lg bg-ink-50/40 px-3 py-2 text-sm text-ink-700"
                >
                  <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-brand-600" />
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {w.description && (
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              Description
            </p>
            <article
              className="prose prose-sm mt-2 max-w-none rounded-xl border border-ink-100 bg-ink-50/40 p-4"
              dangerouslySetInnerHTML={{ __html: w.description }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

function Meta({ icon: Icon, label, value, highlight }) {
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

function RegistrationsModal({ workshop: w, onClose }) {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'workshop-registrations', w?._id, status, q],
    queryFn: () =>
      workshopApi.listRegistrations({
        workshop: w?._id,
        status: status || undefined,
        q: q || undefined,
        limit: 100,
      }),
    enabled: !!w,
  });

  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => workshopApi.updateRegistration(id, payload),
    onSuccess: () => {
      toast.success('Updated');
      qc.invalidateQueries({ queryKey: ['admin', 'workshop-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  const removeMut = useMutation({
    mutationFn: (id) => workshopApi.removeRegistration(id),
    onSuccess: () => {
      toast.success('Deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'workshop-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  // Reset filters when modal closes
  useEffect(() => {
    if (!w) {
      setStatus('');
      setSearch('');
    }
  }, [w]);

  const rows = data?.data || [];

  const csv = useMemo(() => {
    if (!rows.length) return '';
    const headers = ['Full name', 'City', 'Education', 'Phone', 'Email', 'Status', 'Registered at'];
    const escape = (v) =>
      typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v ?? '';
    const lines = rows.map((r) =>
      [
        r.fullName,
        r.city,
        r.education,
        r.phone,
        r.email,
        r.status,
        new Date(r.createdAt).toISOString(),
      ]
        .map(escape)
        .join(','),
    );
    return [headers.join(','), ...lines].join('\n');
  }, [rows]);

  const downloadCsv = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${w?.slug || 'workshop'}-registrations.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  if (!w) {
    return <Modal open={false} onClose={onClose}>{null}</Modal>;
  }
  return (
    <Modal
      open={!!w}
      onClose={onClose}
      title={`Registrations — ${w.title}`}
      description={`${data?.data?.length || 0} of ${w.registrationsCount || 0} shown · ${formatDate(w.eventDate)}`}
      size="4xl"
      footer={
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs text-ink-500">
            Sorted by newest first. Use the search and status filter to narrow down.
          </span>
          <button
            onClick={downloadCsv}
            disabled={!rows.length}
            className="btn-outline disabled:opacity-50"
          >
            <Download size={14} /> Export CSV
          </button>
        </div>
      }
    >
      {/* Filters */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center">
        <div className="relative max-w-sm flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, city…"
            className="input pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterChip active={status === ''} onClick={() => setStatus('')}>
            All
          </FilterChip>
          {REGISTRATION_STATUSES.map((s) => (
            <FilterChip
              key={s.value}
              active={status === s.value}
              onClick={() => setStatus(s.value)}
            >
              {s.label}
            </FilterChip>
          ))}
        </div>
      </div>

      {/* Body */}
      {isLoading ? (
        <div className="flex min-h-[200px] items-center justify-center">
          <Loader />
        </div>
      ) : !rows.length ? (
        <EmptyState
          icon={Users}
          title="No registrations yet"
          description="Once people sign up through the public workshop page, they'll appear here."
        />
      ) : (
        <div className="space-y-2.5">
          {rows.map((r) => (
            <RegistrationRow
              key={r._id}
              row={r}
              onStatusChange={(newStatus) =>
                updateMut.mutate({ id: r._id, payload: { status: newStatus } })
              }
              onDelete={() => {
                if (confirm(`Delete registration from ${r.fullName}?`)) {
                  removeMut.mutate(r._id);
                }
              }}
            />
          ))}
        </div>
      )}
    </Modal>
  );
}

function FilterChip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'rounded-full border px-3 py-1 text-xs font-medium transition',
        active
          ? 'border-brand-600 bg-brand-600 text-white'
          : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
      )}
    >
      {children}
    </button>
  );
}

function RegistrationRow({ row: r, onStatusChange, onDelete }) {
  const statusMeta =
    REGISTRATION_STATUSES.find((s) => s.value === r.status) || REGISTRATION_STATUSES[0];

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-ink-100 bg-white p-4 transition hover:border-brand-200 sm:flex-row sm:items-center">
      {/* Identity */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
          {r.fullName
            .split(' ')
            .filter(Boolean)
            .slice(0, 2)
            .map((s) => s[0]?.toUpperCase())
            .join('')}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-ink-900">{r.fullName}</p>
          <p className="flex items-center gap-2 truncate text-xs text-ink-500">
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> {r.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap size={10} /> {r.education}
            </span>
          </p>
        </div>
      </div>

      {/* Phone */}
      <a
        href={`tel:${r.phone}`}
        className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
      >
        <Phone size={13} /> {r.phone}
      </a>

      {/* Status select */}
      <div className="flex items-center gap-2">
        <StatusBadge tone={statusMeta.tone}>{statusMeta.label}</StatusBadge>
        <select
          value={r.status}
          onChange={(e) => onStatusChange(e.target.value)}
          className="input h-8 max-w-[140px] py-0 text-xs"
        >
          {REGISTRATION_STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button
          onClick={onDelete}
          className="btn-ghost p-1.5 text-red-600 hover:bg-red-50"
          aria-label="Delete"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
  );
}
