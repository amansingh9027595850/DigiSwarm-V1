import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import {
  Search,
  Users,
  Trash2,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Calendar,
  Eye,
  Download,
  CheckCircle2,
  XCircle,
  UserCheck,
  Clock,
  AlertCircle,
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

const STATUSES = [
  { value: 'new', label: 'New', tone: 'blue', icon: AlertCircle },
  { value: 'confirmed', label: 'Confirmed', tone: 'amber', icon: Clock },
  { value: 'attended', label: 'Attended', tone: 'green', icon: UserCheck },
  { value: 'no-show', label: 'No-show', tone: 'gray', icon: XCircle },
  { value: 'cancelled', label: 'Cancelled', tone: 'red', icon: XCircle },
];

const toneOf = (s) => STATUSES.find((x) => x.value === s)?.tone || 'gray';
const labelOf = (s) => STATUSES.find((x) => x.value === s)?.label || s;

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

export default function WorkshopRegistrations() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const q = useDebounce(search, 300);
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const workshopIdFilter = params.get('workshop') || '';

  // For the workshop filter dropdown
  const { data: workshopsRes } = useQuery({
    queryKey: ['admin', 'workshops', 'all-for-filter'],
    queryFn: () => workshopApi.listAdmin({ limit: 100 }),
    staleTime: 5 * 60 * 1000,
  });
  const workshops = workshopsRes?.data || [];

  const { data, isLoading } = useQuery({
    queryKey: [
      'admin',
      'workshop-registrations',
      { page, q, status, workshopIdFilter },
    ],
    queryFn: () =>
      workshopApi.listRegistrations({
        page,
        limit: 15,
        q: q || undefined,
        status: status || undefined,
        workshop: workshopIdFilter || undefined,
      }),
    keepPreviousData: true,
  });

  const items = data?.data || [];
  const counts = data?.meta?.counts || {};
  const total = data?.meta?.total ?? items.length;

  const removeMut = useMutation({
    mutationFn: (id) => workshopApi.removeRegistration(id),
    onSuccess: () => {
      toast.success('Registration deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'workshop-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const filteredWorkshop = workshops.find((w) => w._id === workshopIdFilter);

  const csv = useMemo(() => {
    if (!items.length) return '';
    const headers = [
      'Full name',
      'City',
      'Education',
      'Phone',
      'Email',
      'Status',
      'Workshop',
      'Registered at',
    ];
    const escape = (v) =>
      typeof v === 'string' && /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v ?? '';
    const lines = items.map((r) =>
      [
        r.fullName,
        r.city,
        r.education,
        r.phone,
        r.email,
        r.status,
        r.workshop?.title || '',
        new Date(r.createdAt).toISOString(),
      ]
        .map(escape)
        .join(','),
    );
    return [headers.join(','), ...lines].join('\n');
  }, [items]);

  const downloadCsv = () => {
    if (!csv) return;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 10);
    a.download = `workshop-registrations-${stamp}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Helmet>
        <title>Workshop registrations — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Workshop registrations"
          description={
            filteredWorkshop
              ? `Showing only registrations for "${filteredWorkshop.title}".`
              : 'Every form submission from the public Workshop page lands here.'
          }
          actions={
            <>
              {filteredWorkshop && (
                <button
                  onClick={() => {
                    params.delete('workshop');
                    setParams(params);
                  }}
                  className="btn-outline"
                >
                  Clear workshop filter
                </button>
              )}
              <button
                onClick={downloadCsv}
                disabled={!items.length}
                className="btn-primary disabled:opacity-50"
              >
                <Download size={14} /> Export CSV
              </button>
            </>
          }
        />

        {/* Stats by status */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <button
            onClick={() => {
              setStatus('');
              setPage(1);
            }}
            className={clsx(
              'rounded-2xl border bg-white px-4 py-3 text-left transition',
              status === ''
                ? 'border-brand-500 ring-2 ring-brand-100'
                : 'border-ink-100 hover:border-brand-200',
            )}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
              All
            </p>
            <p className="mt-1 text-2xl font-extrabold text-ink-900">{total}</p>
          </button>
          {STATUSES.map((s) => (
            <button
              key={s.value}
              onClick={() => {
                setStatus(status === s.value ? '' : s.value);
                setPage(1);
              }}
              className={clsx(
                'rounded-2xl border bg-white px-4 py-3 text-left transition',
                status === s.value
                  ? 'border-brand-500 ring-2 ring-brand-100'
                  : 'border-ink-100 hover:border-brand-200',
              )}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">
                {counts[s.value] || 0}
              </p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card flex flex-col gap-3 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search name, phone, or city…"
              className="input pl-9"
            />
          </div>
          <select
            value={workshopIdFilter}
            onChange={(e) => {
              const v = e.target.value;
              if (v) params.set('workshop', v);
              else params.delete('workshop');
              setParams(params);
              setPage(1);
            }}
            className="input max-w-sm"
            aria-label="Filter by workshop"
          >
            <option value="">All workshops ({workshops.length})</option>
            {workshops.map((w) => (
              <option key={w._id} value={w._id}>
                {w.title} ({w.registrationsCount || 0})
              </option>
            ))}
          </select>
        </div>

        {/* Body */}
        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !items.length ? (
          <EmptyState
            icon={Users}
            title={
              q || status || workshopIdFilter
                ? 'No registrations match'
                : 'No registrations yet'
            }
            description={
              q || status || workshopIdFilter
                ? 'Try clearing filters or a different search.'
                : 'When someone books a seat through the public Workshop page, they will appear here instantly.'
            }
          />
        ) : (
          <div className="grid gap-3">
            {items.map((r) => (
              <RegistrationRow
                key={r._id}
                row={r}
                onView={() => setOpenId(r._id)}
                onDelete={() => setToDelete(r)}
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
        title={`Delete registration from ${toDelete?.fullName}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <RegistrationDetailModal
        id={openId}
        items={items}
        onClose={() => setOpenId(null)}
      />
    </>
  );
}

function RegistrationRow({ row: r, onView, onDelete }) {
  const qc = useQueryClient();
  const updateMut = useMutation({
    mutationFn: ({ id, payload }) => workshopApi.updateRegistration(id, payload),
    onSuccess: () => {
      toast.success('Status updated');
      qc.invalidateQueries({ queryKey: ['admin', 'workshop-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Update failed'),
  });

  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-ink-100 bg-white p-4 transition hover:border-brand-200 hover:shadow-soft sm:flex-row sm:items-center sm:gap-4">
      {/* Identity */}
      <div className="flex flex-1 items-center gap-3 min-w-0">
        <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-xs font-bold text-white shadow-soft">
          {initialsOf(r.fullName)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-bold text-ink-900">{r.fullName}</p>
          <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] text-ink-500">
            <span className="inline-flex items-center gap-1">
              <MapPin size={10} /> {r.city}
            </span>
            <span className="inline-flex items-center gap-1">
              <GraduationCap size={10} /> {r.education}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={10} /> {formatDate(r.createdAt)}
            </span>
          </div>
          {r.workshop && (
            <p className="mt-1 truncate text-[11px] font-medium text-brand-700">
              For: {r.workshop.title}
            </p>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="flex flex-wrap items-center gap-2">
        <a
          href={`tel:${r.phone}`}
          className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition hover:bg-emerald-100"
        >
          <Phone size={12} /> {r.phone}
        </a>
        {r.email && (
          <a
            href={`mailto:${r.email}`}
            className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition hover:bg-brand-100"
          >
            <Mail size={12} /> Email
          </a>
        )}
      </div>

      {/* Status + actions */}
      <div className="flex items-center gap-2">
        <StatusBadge tone={toneOf(r.status)}>{labelOf(r.status)}</StatusBadge>
        <select
          value={r.status}
          onChange={(e) =>
            updateMut.mutate({ id: r._id, payload: { status: e.target.value } })
          }
          className="input h-8 max-w-[140px] py-0 text-xs"
          aria-label="Change status"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button onClick={onView} className="btn-ghost p-2" aria-label="View" title="View">
          <Eye size={15} />
        </button>
        <button
          onClick={onDelete}
          className="btn-ghost p-2 text-red-600 hover:bg-red-50"
          aria-label="Delete"
          title="Delete"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

function RegistrationDetailModal({ id, items, onClose }) {
  const qc = useQueryClient();
  const row = items.find((r) => r._id === id) || null;
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');

  useEffect(() => {
    if (row) {
      setNotes(row.notes || '');
      setStatus(row.status || 'new');
    }
  }, [row]);

  const saveMut = useMutation({
    mutationFn: (payload) => workshopApi.updateRegistration(id, payload),
    onSuccess: () => {
      toast.success('Saved');
      qc.invalidateQueries({ queryKey: ['admin', 'workshop-registrations'] });
      qc.invalidateQueries({ queryKey: ['admin', 'workshops'] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title={row?.fullName}
      description={row?.workshop?.title}
      size="2xl"
      footer={
        row && (
          <div className="flex flex-wrap items-center justify-end gap-2">
            <button onClick={onClose} className="btn-outline">
              Close
            </button>
            <button
              onClick={() => saveMut.mutate({ status, notes })}
              disabled={saveMut.isPending}
              className="btn-primary"
            >
              {saveMut.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )
      }
    >
      {!row ? null : (
        <div className="space-y-5">
          {/* Identity card */}
          <div className="flex items-center gap-4 rounded-2xl border border-ink-100 bg-gradient-to-br from-brand-50 to-white p-4">
            <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-base font-extrabold text-white shadow-card">
              {initialsOf(row.fullName)}
            </div>
            <div className="min-w-0">
              <p className="text-xl font-extrabold text-ink-900">{row.fullName}</p>
              <p className="text-xs text-ink-500">
                Registered {formatDate(row.createdAt)}
              </p>
            </div>
          </div>

          {/* Meta grid */}
          <div className="grid gap-3 sm:grid-cols-2">
            <Field icon={MapPin} label="City" value={row.city} />
            <Field icon={GraduationCap} label="Education" value={row.education} />
            <Field
              icon={Phone}
              label="Phone"
              value={
                <a
                  href={`tel:${row.phone}`}
                  className="font-semibold text-brand-700 hover:underline"
                >
                  {row.phone}
                </a>
              }
            />
            <Field
              icon={Mail}
              label="Email"
              value={
                row.email ? (
                  <a
                    href={`mailto:${row.email}`}
                    className="font-semibold text-brand-700 hover:underline"
                  >
                    {row.email}
                  </a>
                ) : (
                  <span className="text-ink-400">—</span>
                )
              }
            />
            <Field icon={Calendar} label="Workshop" value={row.workshop?.title || '—'} />
            <Field icon={Users} label="Source" value={row.source || 'website'} />
          </div>

          {/* Status + notes */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-700">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="input"
              >
                {STATUSES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">
              Internal notes
            </label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder="Follow-up details, conversation summary, etc."
            />
          </div>
        </div>
      )}
    </Modal>
  );
}

function Field({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-ink-100 bg-white p-3">
      <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-ink-500">
        <Icon size={11} /> {label}
      </p>
      <p className="mt-1 text-sm text-ink-800">{value}</p>
    </div>
  );
}

// Unused helpers — keep references quiet
// eslint-disable-next-line no-unused-vars
const _unused = { CheckCircle2 };
