import clsx from 'clsx';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => onChange(Math.max(1, Math.min(totalPages, p)));

  const pages = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i += 1) pages.push(i);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => go(page - 1)}
        disabled={page <= 1}
        className="btn-ghost p-2 disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {start > 1 && (
        <>
          <PageBtn n={1} active={page === 1} onClick={() => go(1)} />
          {start > 2 && <span className="px-1 text-ink-400">…</span>}
        </>
      )}
      {pages.map((n) => (
        <PageBtn key={n} n={n} active={n === page} onClick={() => go(n)} />
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="px-1 text-ink-400">…</span>}
          <PageBtn n={totalPages} active={page === totalPages} onClick={() => go(totalPages)} />
        </>
      )}
      <button
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
        className="btn-ghost p-2 disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

function PageBtn({ n, active, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={clsx(
        'min-w-[2rem] rounded-lg px-2.5 py-1 text-sm font-semibold transition',
        active
          ? 'bg-brand-600 text-white'
          : 'text-ink-700 hover:bg-ink-100',
      )}
    >
      {n}
    </button>
  );
}
