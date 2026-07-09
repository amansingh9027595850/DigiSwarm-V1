import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import clsx from 'clsx';

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
  '2xl': 'max-w-4xl',
  '4xl': 'max-w-6xl',
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  size = 'md',
  children,
  footer,
}) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          // On mobile: full-height flex w/ small top padding; on sm+: centered
          className="fixed inset-0 z-50 flex items-end justify-center bg-ink-900/50 backdrop-blur-sm sm:items-center sm:p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: 16 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className={clsx(
              // Mobile: bottom sheet style, rounded top, full width, capped height
              // Desktop: centered card with size class
              'flex w-full flex-col rounded-t-2xl bg-white shadow-card sm:rounded-2xl',
              'max-h-[92vh] sm:max-h-[88vh]',
              sizes[size],
            )}
            role="dialog"
            aria-modal="true"
          >
            {(title || onClose) && (
              <div className="flex items-start justify-between gap-3 border-b border-ink-100 px-4 py-3 sm:px-6 sm:py-4">
                <div className="min-w-0 flex-1">
                  {title && (
                    <h3 className="break-words text-base font-bold leading-snug text-ink-900 sm:text-lg">
                      {title}
                    </h3>
                  )}
                  {description && (
                    <p className="mt-0.5 break-words text-xs text-ink-500 sm:text-sm">
                      {description}
                    </p>
                  )}
                </div>
                {onClose && (
                  <button
                    onClick={onClose}
                    className="-mr-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg text-ink-500 transition hover:bg-ink-100 hover:text-ink-900"
                    aria-label="Close"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-5">
              {children}
            </div>

            {footer && (
              <div className="border-t border-ink-100 bg-white px-4 py-3 sm:px-6 sm:py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
