import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import { Search, ShieldCheck, ChevronDown } from 'lucide-react';
import clsx from 'clsx';


import { auditLogApi } from '@/api/auditLog.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';

const METHODS = ['', 'POST', 'PATCH', 'PUT', 'DELETE'];

const METHOD_TONE = {
  POST: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  PATCH: 'bg-amber-50 text-amber-700 border-amber-100',
  PUT: 'bg-amber-50 text-amber-700 border-amber-100',
  DELETE: 'bg-red-50 text-red-700 border-red-100',
};

const formatDate = (d) =>
  d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'medium' }) : '—';

export default function AuditLogs() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [method, setMethod] = useState('');
  const [resource, setResource] = useState('');
  const [expanded, setExpanded] = useState(new Set());
  const q = useDebounce(search, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', { page, q, method, resource }],
    queryFn: () =>
      auditLogApi.list({
        page,
        limit: 25,
        q: q || undefined,
        method: method || undefined,
        resource: resource || undefined,
      }),
    keepPreviousData: true,
  });

  const toggleExpand = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const resources = data?.meta?.resources || [];

  const columns = [
    {
      key: 'when',
      header: 'When',
      cellClassName: 'text-ink-600 text-xs whitespace-nowrap',
      render: (r) => formatDate(r.at),
    },
    {
      key: 'who',
      header: 'Who',
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink-900">{r.userName || '—'}</p>
          <p className="truncate text-xs text-ink-500">
            {r.userEmail}
            {r.userRole && <span className="ml-1 text-ink-400">· {r.userRole}</span>}
          </p>
        </div>
      ),
    },
    {
      key: 'action',
      header: 'Action',
      render: (r) => (
        <span
          className={clsx(
            'inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-bold',
            METHOD_TONE[r.method] || 'bg-ink-50 text-ink-700 border-ink-100',
          )}
        >
          {r.method}
        </span>
      ),
    },
    {
      key: 'resource',
      header: 'Resource',
      cellClassName: 'text-ink-700 text-xs',
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium capitalize">{r.resource || '—'}</p>
          {r.resourceId && (
            <p className="truncate font-mono text-[10px] text-ink-400">{r.resourceId}</p>
          )}
        </div>
      ),
    },
    {
      key: 'path',
      header: 'Path',
      cellClassName: 'max-w-xs truncate font-mono text-[11px] text-ink-600',
      render: (r) => r.path,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <span className="inline-flex rounded-md bg-emerald-50 px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
          {r.statusCode}
        </span>
      ),
    },
    {
      key: 'details',
      header: '',
      width: '80px',
      render: (r) => {
        const has = r.metadata && Object.keys(r.metadata).length > 0;
        if (!has) return null;
        return (
          <button onClick={() => toggleExpand(r._id)} className="btn-ghost px-2 py-1 text-xs">
            <ChevronDown
              size={14}
              className={clsx('transition', expanded.has(r._id) && 'rotate-180')}
            />
          </button>
        );
      },
    },
  ];

  const expandedRow = (r) =>
    expanded.has(r._id) ? (
      <pre className="mt-2 overflow-x-auto rounded-lg bg-ink-50 p-3 text-[11px] leading-relaxed text-ink-700">
        {JSON.stringify(r.metadata, null, 2)}
      </pre>
    ) : null;

  return (
    <>
      <Helmet>
        <title>Audit logs — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Audit logs"
          description="Every change made through the admin API is recorded here."
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
              placeholder="Search user or path…"
              className="input pl-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={method}
              onChange={(e) => {
                setMethod(e.target.value);
                setPage(1);
              }}
              className="input w-auto text-sm"
            >
              {METHODS.map((m) => (
                <option key={m || 'all-m'} value={m}>
                  {m || 'All methods'}
                </option>
              ))}
            </select>
            <select
              value={resource}
              onChange={(e) => {
                setResource(e.target.value);
                setPage(1);
              }}
              className="input w-auto text-sm"
            >
              <option value="">All resources</option>
              {resources.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? null : !data?.data?.length ? (
          <EmptyState
            icon={ShieldCheck}
            title="No audit entries yet"
            description="Once you (or other admins) make changes, they'll appear here with full context."
          />
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={data.data}
              loading={isLoading}
            />

            {data.data.some((r) => expanded.has(r._id)) && (
              <div className="space-y-2">
                {data.data
                  .filter((r) => expanded.has(r._id))
                  .map((r) => (
                    <div key={`exp-${r._id}`} className="card p-4">
                      <p className="text-xs font-bold uppercase tracking-widest text-ink-500">
                        Payload — {r.method} {r.path}
                      </p>
                      {expandedRow(r)}
                      <p className="mt-2 text-[10px] text-ink-400">
                        IP {r.ip || '—'} · {r.ua?.slice(0, 80) || '—'}
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        <Pagination
          page={data?.meta?.page || 1}
          totalPages={data?.meta?.totalPages || 1}
          onChange={setPage}
        />
      </div>
    </>
  );
}
