import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Search, Trash2, FileQuestion, Mail, Phone, Building2, DollarSign, Clock } from 'lucide-react';
import clsx from 'clsx';

import { quoteApi } from '@/api/quote.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';

const STATUSES = [
  { value: '', label: 'All', tone: 'gray' },
  { value: 'new', label: 'New', tone: 'blue' },
  { value: 'reviewing', label: 'Reviewing', tone: 'amber' },
  { value: 'quoted', label: 'Quoted', tone: 'blue' },
  { value: 'accepted', label: 'Accepted', tone: 'green' },
  { value: 'rejected', label: 'Rejected', tone: 'red' },
];

const toneOf = (s) => STATUSES.find((x) => x.value === s)?.tone || 'gray';
const labelOf = (s) => STATUSES.find((x) => x.value === s)?.label || s;

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function Quotes() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const q = useDebounce(search, 300);
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'quotes', { page, q, status }],
    queryFn: () =>
      quoteApi.list({ page, limit: 15, q: q || undefined, status: status || undefined }),
    keepPreviousData: true,
  });

  const counts = data?.meta?.counts || {};

  const removeMut = useMutation({
    mutationFn: (id) => quoteApi.remove(id),
    onSuccess: () => {
      toast.success('Quote deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'quotes'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const columns = [
    {
      key: 'contact',
      header: 'Contact',
      render: (r) => (
        <div>
          <p className="font-semibold text-ink-900">{r.name}</p>
          <p className="text-xs text-ink-500 truncate">{r.email}</p>
        </div>
      ),
    },
    {
      key: 'services',
      header: 'Services',
      render: (r) =>
        r.services?.length ? (
          <div className="flex flex-wrap gap-1">
            {r.services.slice(0, 2).map((s) => (
              <span key={s._id} className="rounded-full bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                {s.title}
              </span>
            ))}
            {r.services.length > 2 && (
              <span className="text-[11px] text-ink-500">+{r.services.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-ink-400 text-xs">—</span>
        ),
    },
    {
      key: 'budget',
      header: 'Budget',
      cellClassName: 'text-ink-600 text-xs',
      render: (r) => r.budget || '—',
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge tone={toneOf(r.status)}>{labelOf(r.status)}</StatusBadge>,
    },
    {
      key: 'date',
      header: 'Received',
      cellClassName: 'text-ink-600 text-xs',
      render: (r) => formatDate(r.createdAt),
    },
    {
      key: 'actions',
      header: '',
      width: '160px',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => setOpenId(r._id)} className="btn-outline px-3 py-1.5 text-xs">
            View
          </button>
          <button
            onClick={() => setToDelete(r)}
            className="btn-ghost p-2 text-red-600 hover:bg-red-50"
            aria-label="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <Helmet>
        <title>Quote requests — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Quote requests"
          description="Project requests submitted through the Get-a-Quote wizard."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {STATUSES.slice(1).map((s) => (
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
              <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">
                {s.label}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-ink-900">{counts[s.value] || 0}</p>
            </button>
          ))}
        </div>

        <div className="card p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by name, email, company…"
              className="input pl-9"
            />
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={data?.data}
          loading={isLoading}
          empty={
            <EmptyState
              icon={FileQuestion}
              title="No quote requests yet"
              description="Submissions from the Get-a-Quote wizard will appear here."
            />
          }
        />

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <QuoteDetail
        id={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => qc.invalidateQueries({ queryKey: ['admin', 'quotes'] })}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete quote from ${toDelete?.name}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}

function QuoteDetail({ id, onClose, onChanged }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'quote', id],
    queryFn: () => quoteApi.getById(id),
    enabled: !!id,
  });

  const [status, setStatus] = useState('new');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (data?.data) {
      setStatus(data.data.status);
      setNotes(data.data.notes || '');
    }
  }, [data]);

  const saveMut = useMutation({
    mutationFn: (payload) => quoteApi.update(id, payload),
    onSuccess: () => {
      toast.success('Quote updated');
      onChanged?.();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const quote = data?.data;

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title={quote?.name}
      description={quote?.company || quote?.email}
      size="xl"
      footer={
        quote && (
          <div className="flex justify-end gap-2">
            <button onClick={onClose} className="btn-outline">
              Close
            </button>
            <button
              onClick={() => saveMut.mutate({ status, notes })}
              className="btn-primary"
              disabled={saveMut.isPending}
            >
              {saveMut.isPending ? 'Saving…' : 'Save changes'}
            </button>
          </div>
        )
      }
    >
      {isLoading || !quote ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field icon={Mail} label="Email" value={
              <a href={`mailto:${quote.email}`} className="text-brand-700 hover:underline">{quote.email}</a>
            } />
            <Field icon={Phone} label="Phone" value={quote.phone || '—'} />
            <Field icon={Building2} label="Company" value={quote.company || '—'} />
            <Field icon={DollarSign} label="Budget" value={quote.budget || '—'} />
            <Field icon={Clock} label="Timeline" value={quote.timeline || '—'} />
          </div>

          {!!quote.services?.length && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Services</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {quote.services.map((s) => (
                  <span
                    key={s._id}
                    className="rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
                  >
                    {s.title}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Requirements</p>
            <p className="mt-2 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm text-ink-700 leading-relaxed">
              {quote.requirements}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Status</label>
            <select className="input" value={status} onChange={(e) => setStatus(e.target.value)}>
              {STATUSES.slice(1).map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Internal notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder="Estimate, scope decisions, follow-ups…"
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
      <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-ink-500">
        <Icon size={12} /> {label}
      </p>
      <p className="mt-1 text-sm text-ink-800">{value}</p>
    </div>
  );
}
