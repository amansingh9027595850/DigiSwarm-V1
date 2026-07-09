import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react';

import { caseStudyApi } from '@/api/caseStudy.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import DataTable from '@/components/common/DataTable';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import StatusBadge from '@/components/common/StatusBadge';
import ConfirmDialog from '@/components/common/ConfirmDialog';

export default function CaseStudies() {
  const qc = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'case-studies', { page, q }],
    queryFn: () => caseStudyApi.listAdmin({ page, limit: 12, q: q || undefined }),
    keepPreviousData: true,
  });

  const removeMut = useMutation({
    mutationFn: (id) => caseStudyApi.remove(id),
    onSuccess: () => {
      toast.success('Case study deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'case-studies'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const columns = [
    {
      key: 'title',
      header: 'Case study',
      render: (r) => (
        <div className="flex items-center gap-3">
          {r.cover?.url ? (
            <img src={r.cover.url} alt="" className="h-12 w-16 rounded-lg object-cover" />
          ) : (
            <div className="grid h-12 w-16 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <BookOpen size={16} />
            </div>
          )}
          <div>
            <p className="font-semibold text-ink-900">{r.title}</p>
            <p className="text-xs text-ink-500">{r.client || '—'} · {r.industry || '—'}</p>
          </div>
        </div>
      ),
    },
    { key: 'duration', header: 'Duration', cellClassName: 'text-ink-600', render: (r) => r.duration || '—' },
    {
      key: 'status',
      header: 'Status',
      render: (r) => (
        <div className="flex flex-wrap items-center gap-1.5">
          <StatusBadge tone={r.isActive ? 'green' : 'gray'}>
            {r.isActive ? 'Active' : 'Inactive'}
          </StatusBadge>
          {r.isFeatured && <StatusBadge tone="blue">Featured</StatusBadge>}
        </div>
      ),
    },
    {
      key: 'actions',
      header: '',
      width: '120px',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Link to={`/admin/case-studies/${r._id}/edit`} className="btn-ghost p-2" aria-label="Edit">
            <Edit size={16} />
          </Link>
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
        <title>Case studies — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Case studies"
          description="Long-form stories about the impact of our work."
          actions={
            <Link to="/admin/case-studies/new" className="btn-primary">
              <Plus size={16} /> New case study
            </Link>
          }
        />

        <div className="card p-4">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search case studies…"
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
              icon={BookOpen}
              title="No case studies yet"
              description="Add detailed stories about your best work to win more trust."
              action={
                <Link to="/admin/case-studies/new" className="btn-primary">
                  <Plus size={16} /> New case study
                </Link>
              }
            />
          }
        />

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
        description="The case study will be permanently removed."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}
