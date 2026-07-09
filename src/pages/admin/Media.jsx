import { useRef, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { Upload, Trash2, Search, Image as ImageIcon, Loader2, Copy } from 'lucide-react';

import { mediaApi } from '@/api/media.api';
import { useDebounce } from '@/hooks/useDebounce';
import PageHeader from '@/components/common/PageHeader';
import EmptyState from '@/components/common/EmptyState';
import Pagination from '@/components/common/Pagination';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import Loader from '@/components/common/Loader';

const formatBytes = (b = 0) => {
  if (!b) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(b) / Math.log(k)));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export default function Media() {
  const qc = useQueryClient();
  const fileRef = useRef(null);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const q = useDebounce(search, 300);
  const [uploading, setUploading] = useState(false);
  const [toDelete, setToDelete] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'media', { page, q }],
    queryFn: () => mediaApi.list({ page, limit: 24, q: q || undefined }),
    keepPreviousData: true,
  });

  const removeMut = useMutation({
    mutationFn: (id) => mediaApi.remove(id),
    onSuccess: () => {
      toast.success('Asset deleted');
      qc.invalidateQueries({ queryKey: ['admin', 'media'] });
      setToDelete(null);
    },
    onError: (err) => toast.error(err?.response?.data?.message || 'Delete failed'),
  });

  const handleUpload = async (files) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      await mediaApi.uploadMultiple(Array.from(files), 'library');
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
      qc.invalidateQueries({ queryKey: ['admin', 'media'] });
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const copy = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('URL copied');
    } catch {
      toast.error('Copy failed');
    }
  };

  return (
    <>
      <Helmet>
        <title>Media library — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Media library"
          description="All images and assets uploaded across the site."
          actions={
            <button
              onClick={() => fileRef.current?.click()}
              className="btn-primary"
              disabled={uploading}
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
              {uploading ? 'Uploading…' : 'Upload files'}
            </button>
          }
        />

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => handleUpload(e.target.files)}
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
              placeholder="Search by filename or alt text…"
              className="input pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <Loader />
          </div>
        ) : !data?.data?.length ? (
          <EmptyState
            icon={ImageIcon}
            title="No assets yet"
            description="Upload images you'd like to reuse across services, projects, and articles."
            action={
              <button onClick={() => fileRef.current?.click()} className="btn-primary">
                <Upload size={16} /> Upload files
              </button>
            }
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {data.data.map((m) => (
              <div key={m._id} className="group overflow-hidden rounded-xl border border-ink-100 bg-white">
                <div className="relative aspect-square overflow-hidden bg-ink-50">
                  <img src={m.url} alt={m.alt} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-ink-900/0 transition group-hover:bg-ink-900/40" />
                  <div className="absolute inset-x-2 bottom-2 flex justify-between gap-1 opacity-0 transition group-hover:opacity-100">
                    <button
                      onClick={() => copy(m.url)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/95 text-ink-700 shadow-soft"
                      title="Copy URL"
                      aria-label="Copy URL"
                    >
                      <Copy size={13} />
                    </button>
                    <button
                      onClick={() => setToDelete(m)}
                      className="grid h-7 w-7 place-items-center rounded-md bg-white/95 text-red-600 shadow-soft"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <div className="p-2.5 text-xs text-ink-600">
                  <p className="truncate font-medium text-ink-800">{m.publicId.split('/').pop()}</p>
                  <p className="flex items-center justify-between text-ink-400">
                    <span>{m.width}×{m.height}</span>
                    <span>{formatBytes(m.bytes)}</span>
                  </p>
                </div>
              </div>
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
        title="Delete this asset?"
        description="The image will be removed from Cloudinary and the library. Any references in content will break."
        confirmLabel="Delete"
        loading={removeMut.isPending}
      />
    </>
  );
}
