import clsx from 'clsx';
import { forwardRef } from 'react';

const FormField = forwardRef(function FormField(
  { label, hint, error, required, className, ...props },
  ref,
) {
  return (
    <div className={className}>
      {label && (
        <label className="mb-1 block text-xs font-semibold text-ink-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={clsx('input', error && 'border-red-300 focus:border-red-400 focus:ring-red-100')}
        aria-invalid={!!error}
        {...props}
      />
      {error ? (
        <p className="mt-1 text-xs text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-xs text-ink-500">{hint}</p>
      ) : null}
    </div>
  );
});

export default FormField;
