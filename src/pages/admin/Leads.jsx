import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Search, Trash2, MessageSquare, Mail, Phone, Building2 } from 'lucide-react';
import clsx from 'clsx';

import { leadApi } from '@/api/lead.api';
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
  { value: 'contacted', label: 'Contacted', tone: 'amber' },
  { value: 'qualified', label: 'Qualified', tone: 'blue' },
  { value: 'proposal', label: 'Proposal', tone: 'amber' },
  { value: 'won', label: 'Won', tone: 'green' },
  { value: 'lost', label: 'Lost', tone: 'red' },
];

const toneOf = (s) => STATUSES.find((x) => x.value === s)?.tone || 'gray';
const labelOf = (s) => STATUSES.find((x) => x.value === s)?.label || s;

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function Leads() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const q = useDebounce(search, 300);
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'leads', { page, q, status }],
    queryFn: () =>
      leadApi.list({ page, limit: 15, q: q || undefined, status: status || undefined }),
    keepPreviousData: true,
  });

  const counts = data?.meta?.counts || {};

  const removeMut = useMutation({
    mutationFn: (id) => leadApi.remove(id),
    onSuccess: () => {
      toast.success('Lead deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'leads'] });
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
      key: 'company',
      header: 'Company',
      cellClassName: 'text-ink-600',
      render: (r) => r.company || '—',
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
        <title>Leads — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Leads"
          description="Inbound enquiries from your contact and lead forms."
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
              icon={MessageSquare}
              title="No leads yet"
              description="When someone submits the lead form, they'll show up here."
            />
          }
        />

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <LeadDetail
        id={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => qc.invalidateQueries({ queryKey: ['admin', 'leads'] })}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete lead from ${toDelete?.name}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}

function LeadDetail({ id, onClose, onChanged }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'lead', id],
    queryFn: () => leadApi.getById(id),
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
    mutationFn: (payload) => leadApi.update(id, payload),
    onSuccess: () => {
      toast.success('Lead updated');
      onChanged?.();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const lead = data?.data;

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title={lead?.name}
      description={lead?.company || lead?.email}
      size="xl"
      footer={
        lead && (
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
      {isLoading || !lead ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              icon={Mail}
              label="Email"
              value={
                <a href={`mailto:${lead.email}`} className="text-brand-700 hover:underline">
                  {lead.email}
                </a>
              }
            />
            <Field icon={Phone} label="Phone" value={lead.phone || '—'} />
            <Field icon={Building2} label="Company" value={lead.company || '—'} />
            <Field icon={MessageSquare} label="Source" value={lead.source} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Message</p>
            <p className="mt-2 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm text-ink-700 leading-relaxed">
              {lead.message}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Status</label>
            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
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
              placeholder="Conversation log, decisions, next steps…"
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
