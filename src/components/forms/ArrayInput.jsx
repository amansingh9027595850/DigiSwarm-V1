import { Plus, Trash2, GripVertical } from 'lucide-react';

export default function ArrayInput({
  label,
  value = [],
  onChange,
  placeholder = 'Item',
  hint,
  error,
  addLabel = 'Add item',
}) {
  const update = (idx, val) =>
    onChange(value.map((item, i) => (i === idx ? val : item)));

  const remove = (idx) => onChange(value.filter((_, i) => i !== idx));

  const add = () => onChange([...value, '']);

  return (
    <div>
      {label && <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>}

      {value.length === 0 ? (
        <button
          type="button"
          onClick={add}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 px-3 py-3 text-sm font-medium text-ink-500 transition hover:border-brand-300 hover:bg-brand-50/40 hover:text-brand-700"
        >
          <Plus size={14} /> {addLabel}
        </button>
      ) : (
        <div className="space-y-2">
          {value.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <GripVertical size={14} className="text-ink-300" />
              <input
                value={item}
                onChange={(e) => update(idx, e.target.value)}
                placeholder={placeholder}
                className="input"
              />
              <button
                type="button"
                onClick={() => remove(idx)}
                className="btn-ghost p-2 text-red-600 hover:bg-red-50"
                aria-label="Remove item"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={add}
            className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-semibold text-brand-700 hover:bg-brand-50"
          >
            <Plus size={12} /> {addLabel}
          </button>
        </div>
      )}

      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
