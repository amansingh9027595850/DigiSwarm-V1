import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import clsx from 'clsx';

export default function Accordion({ items, allowMultiple = false }) {
  const [openSet, setOpenSet] = useState(() => new Set([0]));

  const toggle = (idx) => {
    setOpenSet((prev) => {
      const next = new Set(allowMultiple ? prev : []);
      if (prev.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="divide-y divide-ink-100 rounded-2xl border border-ink-100 bg-white">
      {items.map((item, idx) => {
        const open = openSet.has(idx);
        return (
          <div key={item.id ?? idx}>
            <button
              type="button"
              onClick={() => toggle(idx)}
              aria-expanded={open}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-ink-50/50"
            >
              <span
                className={clsx(
                  'text-base font-semibold transition',
                  open ? 'text-brand-700' : 'text-ink-900',
                )}
              >
                {item.question}
              </span>
              <span
                className={clsx(
                  'grid h-7 w-7 shrink-0 place-items-center rounded-full transition',
                  open ? 'bg-brand-600 text-white' : 'bg-ink-100 text-ink-600',
                )}
              >
                {open ? <Minus size={14} /> : <Plus size={14} />}
              </span>
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-5 -mt-1 text-sm leading-relaxed text-ink-700 whitespace-pre-line">
                    {item.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
