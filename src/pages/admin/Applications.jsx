import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { useDebounce } from '@/hooks/useDebounce';
import {
  Search,
  FileText,
  Mail,
  Phone,
  Linkedin,
  Globe,
  ExternalLink,
  Trash2,
  Calendar,
  User,
  Download,
  Eye,
} from 'lucide-react';
import clsx from 'clsx';

import { applicationApi } from '@/api/application.api';
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
  { value: 'review', label: 'In review', tone: 'amber' },
  { value: 'shortlist', label: 'Shortlisted', tone: 'blue' },
  { value: 'interview', label: 'Interview', tone: 'blue' },
  { value: 'hired', label: 'Hired', tone: 'green' },
  { value: 'rejected', label: 'Rejected', tone: 'red' },
];

const toneOf = (status) => STATUSES.find((s) => s.value === status)?.tone || 'gray';
const labelOf = (status) => STATUSES.find((s) => s.value === status)?.label || status;

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '—';

export default function Applications() {
  const qc = useQueryClient();
  const [params, setParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const q = useDebounce(search, 300);
  const [openId, setOpenId] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [resumePreview, setResumePreview] = useState(null);

  const jobIdFilter = params.get('job') || '';

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'applications', { page, q, status, jobIdFilter }],
    queryFn: () =>
      applicationApi.list({
        page,
        limit: 15,
        q: q || undefined,
        status: status || undefined,
        job: jobIdFilter || undefined,
      }),
    keepPreviousData: true,
  });

  const counts = data?.meta?.counts || {};

  const removeMut = useMutation({
    mutationFn: (id) => applicationApi.remove(id),
    onSuccess: () => {
      toast.success('Application deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'applications'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const columns = [
    {
      key: 'candidate',
      header: 'Candidate',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full bg-brand-100 text-xs font-bold text-brand-700">
            {r.name
              .split(' ')
              .filter(Boolean)
              .slice(0, 2)
              .map((s) => s[0]?.toUpperCase())
              .join('')}
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-ink-900">{r.name}</p>
            <p className="truncate text-xs text-ink-500">{r.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'job',
      header: 'Role',
      render: (r) =>
        r.job ? (
          <div>
            <p className="text-sm font-medium text-ink-900">{r.job.title}</p>
            <p className="text-xs text-ink-500">{r.job.department}</p>
          </div>
        ) : (
          <span className="text-ink-400 text-xs">—</span>
        ),
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <StatusBadge tone={toneOf(r.status)}>{labelOf(r.status)}</StatusBadge>,
    },
    {
      key: 'date',
      header: 'Applied',
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
        <title>Applications — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Applications"
          description="Track candidates moving through your hiring pipeline."
          actions={
            jobIdFilter && (
              <button
                onClick={() => {
                  params.delete('job');
                  setParams(params);
                }}
                className="btn-outline"
              >
                Clear job filter
              </button>
            )
          }
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
              placeholder="Search by name or email…"
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
              icon={FileText}
              title="No applications yet"
              description="Once candidates apply through your open roles, they'll appear here."
            />
          }
        />

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>

      <ApplicationDetail
        id={openId}
        onClose={() => setOpenId(null)}
        onChanged={() => qc.invalidateQueries({ queryKey: ['admin', 'applications'] })}
        onPreviewResume={setResumePreview}
      />

      <ConfirmDialog
        open={!!toDelete}
        onClose={() => setToDelete(null)}
        onConfirm={() => removeMut.mutate(toDelete._id)}
        title={`Delete application from ${toDelete?.name}?`}
        description="The resume file will also be removed from storage. This cannot be undone."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />

      <ResumePreviewModal
        preview={resumePreview}
        onClose={() => setResumePreview(null)}
      />
    </>
  );
}

function ApplicationDetail({ id, onClose, onChanged, onPreviewResume }) {
  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'application', id],
    queryFn: () => applicationApi.getById(id),
    enabled: !!id,
  });

  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('new');

  useEffect(() => {
    if (data?.data) {
      setNotes(data.data.notes || '');
      setStatus(data.data.status || 'new');
    }
  }, [data]);

  const saveMut = useMutation({
    mutationFn: (payload) => applicationApi.update(id, payload),
    onSuccess: () => {
      toast.success('Application updated');
      onChanged?.();
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Save failed'),
  });

  const app = data?.data;

  return (
    <Modal
      open={!!id}
      onClose={onClose}
      title={app?.name}
      description={app?.job?.title}
      size="xl"
      footer={
        app && (
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
      {isLoading || !app ? (
        <div className="flex min-h-[120px] items-center justify-center">
          <Loader />
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field icon={Mail} label="Email" value={<a href={`mailto:${app.email}`} className="text-brand-700 hover:underline">{app.email}</a>} />
            <Field icon={Phone} label="Phone" value={app.phone || '—'} />
            <Field icon={Linkedin} label="LinkedIn" value={
              app.linkedIn ? (
                <a href={app.linkedIn} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">View profile</a>
              ) : '—'
            } />
            <Field icon={Globe} label="Portfolio" value={
              app.portfolio ? (
                <a href={app.portfolio} target="_blank" rel="noopener noreferrer" className="text-brand-700 hover:underline">Visit</a>
              ) : '—'
            } />
            <Field icon={Calendar} label="Applied" value={formatDate(app.createdAt)} />
            <Field icon={User} label="Source" value={app.source} />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Resume</p>
            <div className="mt-2 flex items-center gap-2 rounded-xl border border-ink-100 bg-ink-50/40 p-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
                <FileText size={18} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">
                  {app.resume?.originalName || 'Resume'}
                </p>
                <p className="text-xs text-ink-500">
                  {formatBytes(app.resume?.bytes)}
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  onPreviewResume?.({
                    // The resume is fetched through our authenticated proxy
                    // endpoint (no public Cloudinary URL is exposed), so all
                    // we need to pass is the application id + filename.
                    applicationId: app._id,
                    name: app.resume?.originalName,
                    candidate: app.name,
                  })
                }
                className="btn-outline px-3 py-1.5 text-xs"
              >
                <Eye size={13} /> Preview
              </button>
            </div>
          </div>

          {app.coverLetter && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-ink-500">Cover letter</p>
              <p className="mt-2 whitespace-pre-line rounded-xl bg-ink-50 p-4 text-sm text-ink-700 leading-relaxed">
                {app.coverLetter}
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
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
          </div>

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-700">Internal notes</label>
            <textarea
              rows={4}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="input"
              placeholder="Interview feedback, references, decisions…"
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

function formatBytes(b) {
  if (!b) return '';
  const k = 1024;
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(b) / Math.log(k)));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

const isImage = (name = '') => /\.(jpe?g|png|webp|gif|avif)$/i.test(name);
const isPdf = (name = '') => /\.pdf$/i.test(name);
const isOffice = (name = '') => /\.(docx?|odt|rtf)$/i.test(name);

function ResumePreviewModal({ preview, onClose }) {
  const open = !!preview;
  const applicationId = preview?.applicationId;
  const name = preview?.name || 'Resume';
  const candidate = preview?.candidate || '';
  const pdf = isPdf(name);
  const img = isImage(name);
  const office = isOffice(name);

  // Fetch the resume bytes via our authenticated proxy and turn them into a
  // local blob: URL the browser can render inline. This bypasses every
  // Cloudinary delivery restriction because the only host that ever hits
  // Cloudinary directly is our server — the browser sees a same-origin URL.
  const [blobUrl, setBlobUrl] = useState(null);
  const [loadError, setLoadError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || !applicationId) return undefined;
    let cancelled = false;
    let created = null;
    setLoading(true);
    setLoadError(null);
    applicationApi
      .fetchResume(applicationId)
      .then((blob) => {
        if (cancelled) return;
        created = URL.createObjectURL(blob);
        setBlobUrl(created);
      })
      .catch((err) => {
        if (cancelled) return;
        setLoadError(
          err?.response?.data?.message ||
            err?.message ||
            'Failed to load the resume',
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
      if (created) URL.revokeObjectURL(created);
      setBlobUrl(null);
    };
  }, [open, applicationId]);

  const handleDownload = async () => {
    if (!applicationId) return;
    try {
      const blob = await applicationApi.fetchResume(applicationId, { download: true });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = name || 'resume';
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Download failed');
    }
  };

  const handleOpenInTab = () => {
    if (!blobUrl) return;
    window.open(blobUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={name}
      description={candidate ? `From ${candidate}` : undefined}
      size="2xl"
      footer={
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <span className="text-xs text-ink-500">
            {loadError ? (
              <span className="text-red-600">{loadError}</span>
            ) : (
              'Preview is fetched securely through your admin session.'
            )}
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="btn-outline"
              disabled={!applicationId}
            >
              <Download size={14} /> Download
            </button>
            <button
              type="button"
              onClick={handleOpenInTab}
              className="btn-primary"
              disabled={!blobUrl}
            >
              <ExternalLink size={14} /> Open in new tab
            </button>
          </div>
        </div>
      }
    >
      {loading || (!blobUrl && !loadError) ? (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader label="Loading resume" />
        </div>
      ) : loadError ? (
        <div className="grid place-items-center gap-3 py-12 text-center text-ink-500">
          <FileText size={32} className="text-red-300" />
          <p className="text-sm">{loadError}</p>
        </div>
      ) : img ? (
        <div className="grid place-items-center overflow-auto rounded-xl bg-ink-50 p-4">
          <img
            src={blobUrl}
            alt={name}
            className="max-h-[70vh] w-auto rounded-lg object-contain shadow-soft"
          />
        </div>
      ) : pdf ? (
        // Native browser PDF rendering from a same-origin blob: URL — no
        // Cloudinary delivery restrictions can apply here.
        <div className="overflow-hidden rounded-xl border border-ink-100 bg-ink-50">
          <object
            data={`${blobUrl}#view=FitH&toolbar=1`}
            type="application/pdf"
            className="block h-[60vh] w-full sm:h-[75vh]"
            aria-label={name}
          >
            <iframe
              src={`${blobUrl}#view=FitH`}
              title={name}
              className="h-[60vh] w-full sm:h-[75vh]"
            />
          </object>
        </div>
      ) : office ? (
        <div className="grid place-items-center gap-3 py-12 text-center text-ink-500">
          <FileText size={32} className="text-ink-300" />
          <p className="text-sm">
            Word documents can&apos;t be previewed inline — download to view.
          </p>
          <button type="button" onClick={handleDownload} className="btn-primary">
            <Download size={14} /> Download {name}
          </button>
        </div>
      ) : (
        <div className="grid place-items-center gap-3 py-12 text-center text-ink-500">
          <FileText size={32} className="text-ink-300" />
          <p className="text-sm">This file type can&apos;t be previewed inline.</p>
          <button type="button" onClick={handleDownload} className="btn-primary">
            <Download size={14} /> Download {name}
          </button>
        </div>
      )}
    </Modal>
  );
}
