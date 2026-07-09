export default function Loader({ label = 'Loading' }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="inline-flex items-center gap-3 text-ink-500"
    >
      <span className="block h-5 w-5 animate-spin rounded-full border-2 border-ink-200 border-t-brand-600" />
      <span className="text-sm font-medium">{label}…</span>
    </div>
  );
}
