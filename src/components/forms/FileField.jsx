import { useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';

const formatBytes = (b = 0) => {
  if (!b) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.min(sizes.length - 1, Math.floor(Math.log(b) / Math.log(k)));
  return `${(b / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
};

export default function FileField({
  label,
  required,
  value,
  onChange,
  accept = '.pdf,.doc,.docx',
  hint,
  error,
}) {
  const inputRef = useRef(null);

  return (
    <div>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-ink-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {value ? (
        <div className="flex items-center justify-between gap-3 rounded-xl border border-ink-200 bg-white px-4 py-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-700">
              <FileText size={18} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink-900">{value.name}</p>
              <p className="text-xs text-ink-500">{formatBytes(value.size)}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="btn-ghost p-2 text-red-600 hover:bg-red-50"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink-200 bg-ink-50/60 px-4 py-6 text-ink-500 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700"
        >
          <Upload size={20} />
          <span className="text-sm font-medium">Click to upload</span>
          <span className="text-xs">PDF, DOC, or DOCX — up to 10MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] || null)}
      />

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
