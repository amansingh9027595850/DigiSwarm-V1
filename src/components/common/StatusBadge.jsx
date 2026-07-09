import clsx from 'clsx';

const TONES = {
  green: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  amber: 'bg-amber-50 text-amber-700 border-amber-100',
  red: 'bg-red-50 text-red-700 border-red-100',
  blue: 'bg-brand-50 text-brand-700 border-brand-100',
  gray: 'bg-ink-50 text-ink-700 border-ink-100',
};

export default function StatusBadge({ tone = 'gray', children, dot = true }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold',
        TONES[tone] ?? TONES.gray,
      )}
    >
      {dot && (
        <span
          className={clsx(
            'h-1.5 w-1.5 rounded-full',
            tone === 'green' && 'bg-emerald-500',
            tone === 'amber' && 'bg-amber-500',
            tone === 'red' && 'bg-red-500',
            tone === 'blue' && 'bg-brand-500',
            tone === 'gray' && 'bg-ink-400',
          )}
        />
      )}
      {children}
    </span>
  );
}
