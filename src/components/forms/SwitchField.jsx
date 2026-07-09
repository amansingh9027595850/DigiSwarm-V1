import clsx from 'clsx';

export default function SwitchField({ label, hint, checked, onChange, disabled }) {
  return (
    <label className="flex cursor-pointer items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={clsx(
          'mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full transition',
          checked ? 'bg-brand-600' : 'bg-ink-200',
          disabled && 'opacity-50 cursor-not-allowed',
        )}
      >
        <span
          className={clsx(
            'inline-block h-5 w-5 transform rounded-full bg-white shadow transition',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          )}
        />
      </button>
      <div>
        <p className="text-sm font-semibold text-ink-900">{label}</p>
        {hint && <p className="text-xs text-ink-500">{hint}</p>}
      </div>
    </label>
  );
}
