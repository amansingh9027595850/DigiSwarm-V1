import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Search, Trash2, MessageSquare, Mail, Reply, MailOpen } from 'lucide-react';
import clsx from 'clsx';

import { contactApi } from '@/api/contact.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Modal from '@/components/common/Modal';
import Loader from '@/components/common/Loader';

const FILTERS = [
  { value: '', label: 'All' },
  { value: 'false', label: 'Unread' },
  { value: 'true', label: 'Read' },
];

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function ContactMessages() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [isRead, setIsRead] = useState('');
  const q = useDebounce(search, 300);
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'contact-messages', { page, q, isRead }],
    queryFn: () =>
      contactApi.list({ page, limit: 15, q: q || undefined, isRead: isRead || undefined }),
    keepPreviousData: true,
  });

  const removeMut = useMutation({
    mutationFn: (id) => contactApi.remove(id),
    onSuccess: () => {
      toast.success('Message deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const markMut = useMutation({
    mutationFn: ({ id, isRead }) => contactApi.update(id, { isRead }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] }),
  });

  const columns = [
    {
      key: 'from',
      header: 'From',
      render: (r) => (
        <div className="flex items-center gap-3">
          {!r.isRead && <span className="h-2 w-2 rounded-full bg-brand-600" aria-label="Unread" />}
          <div>
            <p className={clsx('truncate', r.isRead ? 'text-ink-700' : 'font-semibold text-ink-900')}>
              {r.name}
            </p>
            <p className="text-xs text-ink-500 truncate">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'subject',
      header: 'Subject',
      cellClassName: 'max-w-md truncate',
      render: (r) => (
        <button
          onClick={() => setOpenId(r._id)}
          className={clsx(
            'block truncate text-left hover:text-brand-700',
            r.isRead ? 'text-ink-700' : 'font-semibold text-ink-900',
          )}
        >
          {r.subject}
        </button>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <StatusBadge tone={r.isRead ? 'gray' : 'blue'}>
          {r.isRead ? 'Read' : 'Unread'}
        </StatusBadge>
      ),
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
          <button
            onClick={() => markMut.mutate({ id: r._id, isRead: !r.isRead })}
            className="btn-ghost p-2"
            aria-label={r.isRead ? 'Mark unread' : 'Mark read'}
            title={r.isRead ? 'Mark unread' : 'Mark read'}
          >
            {r.isRead ? <Mail size={16} /> : <MailOpen size={16} />}
          </button>
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
        <title>Contact messages — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Contact messages"
          description={`${data?.meta?.unread ?? 0} unread`}
        />

        <div className="card flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search messages…"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f.value || 'all'}
                onClick={() => {
                  setIsRead(f.value);
                  setPage(1);
                }}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs font-medium transition',
                  f.value === isRead
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-ink-200 bg-white text-ink-700 hover:border-brand-300 hover:text-brand-700',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <DataTable
          columns={columns}
          rows={data?.data}
          loading={isLoading}
          empty={
            <EmptyState
              icon={MessageSquare}
              title="No messages yet"
              description="Inbox is empty — submissions to the contact form will appear here."
            />
          }
        />

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <MessageDetail
        id={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] })}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete message from ${toDelete?.name}?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}

function MessageDetail({ id, onClose, onChanged }) {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'contact-message', id],
    queryFn: () => contactApi.getById(id),
    enabled: !!id,
  });

  const [notes, setNotes] = useState('');
  const [hasMarkedRead, setHasMarkedRead] = useState(false);

  useEffect(() => {
    setHasMarkedRead(false);
  }, [id]);

  useEffect(() => {
    if (data?.data) setNotes(data.data.notes || '');
  }, [data]);

  const markReadMut = useMutation({
    mutationFn: () => contactApi.update(id, { isRead: true }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'contact-messages'] });
      onChanged?.();
    },
  });

  useEffect(() => {
    if (data?.data && !data.data.isRead && !hasMarkedRead) {
      setHasMarkedRead(true);
      markReadMut.mutate();
    }
  }, [data, hasMarkedRead, markReadMut]);

  const saveMut = useMutation({
    mutationFn: (payload) => contactApi.update(id, payload),
    onSuccess: () => {
      toast.success('Notes saved');
      onChanged?.();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const msg = data?.data;

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title={msg?.subject}
      description={`From ${msg?.name} · ${msg?.email}`}
      size="xl"
      footer={
        msg && (
          <div className="flex justify-between gap-2">
            <a
              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
              className="btn-outline"
            >
              <Reply size={14} /> Reply by email
            </a>
            <div className="flex gap-2">
              <button onClick={onClose} className="btn-outline">
                Close
              </button>
              <button
                onClick={() => saveMut.mutate({ notes })}
                className="btn-primary"
                disabled={saveMut.isPending}
              >
                {saveMut.isPending ? 'Saving…' : 'Save notes'}
              </button>
            </div>
          </div>
        )
      }
    >
      {isLoading || !msg ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Message</p>
            <p className="mt-2 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm text-ink-700 leading-relaxed">
              {msg.message}
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Internal notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder="Quick context for the team…"
            />
          </div>
        </div>
      )}
    </Modal>
  );
}
