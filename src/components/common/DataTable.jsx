import clsx from 'clsx';
import Loader from './Loader';
import EmptyState from './EmptyState';

export default function DataTable({
  columns,
  rows,
  loading,
  empty,
  rowKey = (r) => r._id,
}) {
  if (loading) {
    return (
      <div className="flex min-h-[200px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!rows?.length) {
    return empty ?? <EmptyState title="Nothing here yet" description="Create your first item." />;
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-ink-100 bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-100 bg-ink-50/60 text-left text-[11px] font-bold uppercase tracking-widest text-ink-500">
            <tr>
              {columns.map((c) => (
                <th
                  key={c.key}
                  className={clsx('px-4 py-3 first:pl-5 last:pr-5', c.headerClassName)}
                  style={c.width ? { width: c.width } : undefined}
                >
                  {c.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {rows.map((row) => (
              <tr key={rowKey(row)} className="transition hover:bg-ink-50/50">
                {columns.map((c) => (
                  <td
                    key={c.key}
                    className={clsx(
                      'px-4 py-3 first:pl-5 last:pr-5 align-middle text-ink-700',
                      c.cellClassName,
                    )}
                  >
                    {c.render ? c.render(row) : row[c.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
