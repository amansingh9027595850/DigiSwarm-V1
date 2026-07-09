import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagsInput({
  label,
  value = [],
  onChange,
  placeholder = 'Add and press Enter',
  hint,
  error,
}) {
  const [draft, setDraft] = useState('');

  const add = (raw) => {
    const t = raw.trim();
    if (!t) return;
    if (value.includes(t)) return;
    onChange([...value, t]);
    setDraft('');
  };

  const remove = (t) => onChange(value.filter((x) => x !== t));

  const onKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      add(draft);
    } else if (e.key === 'Backspace' && !draft && value.length) {
      onChange(value.slice(0, -1));
    }
  };

  return (
    <div>
      {label && <label className="mb-1 block text-xs font-semibold text-ink-700">{label}</label>}
      <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-ink-200 bg-white p-2 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100">
        {value.map((t) => (
          <span
            key={t}
            className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2.5 py-1 text-xs font-medium text-brand-700"
          >
            {t}
            <button
              type="button"
              onClick={() => remove(t)}
              className="text-brand-700/70 hover:text-brand-900"
              aria-label={`Remove ${t}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => draft && add(draft)}
          onKeyDown={onKeyDown}
          placeholder={value.length ? '' : placeholder}
          className="flex-1 min-w-[8rem] bg-transparent px-1.5 py-1 text-sm outline-none"
        />
      </div>
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
}
