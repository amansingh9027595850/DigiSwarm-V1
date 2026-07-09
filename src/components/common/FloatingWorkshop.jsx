import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';

const REAPPEAR_MS = 5000;

export default function FloatingWorkshop() {
  const { pathname } = useLocation();
  const [hidden, setHidden] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setHidden(false), 700);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hidden) return undefined;
    const t = setTimeout(() => setHidden(false), REAPPEAR_MS);
    return () => clearTimeout(t);
  }, [hidden]);

  const handleClose = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setHidden(true);
  };

  if (pathname === '/workshop') return null;

  return (
    <div
      className={clsx(
        'fixed bottom-4 left-4 z-50 transition-all duration-500 sm:bottom-6 sm:left-6',
        hidden
          ? 'pointer-events-none translate-y-8 scale-90 opacity-0'
          : 'translate-y-0 scale-100 opacity-100',
      )}
    >
      <div className="relative origin-bottom-left animate-attention-bounce">
        <span className="pointer-events-none absolute inset-0 -z-10 animate-ping rounded-2xl bg-amber-400/40" />

        <span className="absolute -left-1.5 -top-1.5 z-10 flex h-3.5 w-3.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-red-500 ring-2 ring-white" />
        </span>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Close workshop banner"
          className="absolute -right-2 -top-2 z-20 grid h-6 w-6 place-items-center rounded-full bg-ink-900 text-white shadow-soft ring-2 ring-white transition hover:scale-110 hover:bg-ink-700 sm:h-7 sm:w-7"
        >
          <X size={12} strokeWidth={3} />
        </button>

        <Link
          to="/workshop"
          aria-label="Join Free Digital Marketing Workshop on 23 May"
          className="group relative block w-[210px] overflow-hidden rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 p-3 text-white shadow-card ring-1 ring-amber-300/70 transition hover:shadow-2xl xs:w-[240px] sm:w-[300px] sm:p-4"
        >
          <Sparkles
            size={120}
            className="pointer-events-none absolute -right-6 -bottom-6 text-white/10"
          />
          <Sparkles
            size={48}
            className="pointer-events-none absolute -left-3 -top-3 rotate-12 text-white/10"
          />

          <div className="relative flex items-center gap-1.5 sm:gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/25 ring-1 ring-white/40 backdrop-blur sm:h-7 sm:w-7">
              <Sparkles size={12} className="animate-wiggle sm:hidden" />
              <Sparkles size={14} className="hidden animate-wiggle sm:block" />
            </span>
            <span className="text-[9px] font-extrabold uppercase tracking-[0.12em] opacity-95 sm:text-[10px] sm:tracking-[0.15em]">
              Free Workshop
            </span>
            <span className="ml-auto mr-5 rounded-full bg-red-600/90 px-1.5 py-0.5 text-[8px] font-extrabold uppercase tracking-wider ring-1 ring-white/40 sm:mr-6 sm:text-[9px]">
              Live Soon
            </span>
          </div>

          <h3 className="relative mt-2 text-sm font-extrabold leading-tight tracking-tight sm:text-lg">
            Digital Marketing
            <br />
            Masterclass
          </h3>

          <div className="relative mt-2.5 flex items-center gap-2.5 sm:mt-3 sm:gap-3">
            <div className="flex flex-col items-center overflow-hidden rounded-lg bg-white text-center shadow-soft ring-1 ring-white/60 sm:rounded-xl">
              <div className="w-full bg-rose-600 px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-wider text-white sm:px-3 sm:text-[9px]">
                May
              </div>
              <div className="px-2 py-1 text-xl font-black leading-none text-ink-900 sm:px-3 sm:text-3xl">
                23
              </div>
              <div className="w-full bg-ink-100 px-2 py-0.5 text-[7px] font-bold uppercase tracking-wider text-ink-700 sm:px-3 sm:text-[8px]">
                2026
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[9px] font-bold uppercase tracking-[0.1em] text-white/90 sm:text-[10px] sm:tracking-[0.12em]">
                Starts on
              </span>
              <span className="text-xs font-extrabold sm:text-base">
                Friday, 23 May
              </span>
              <span className="mt-0.5 text-[9px] font-semibold text-white/90 sm:text-[10px]">
                Limited seats • Free entry
              </span>
            </div>
          </div>

          <div className="relative mt-2.5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider text-orange-600 shadow-soft transition group-hover:gap-2.5 group-hover:bg-amber-50 sm:mt-3 sm:px-3.5 sm:py-1.5 sm:text-xs">
            Register Now
            <ArrowRight
              size={12}
              strokeWidth={3}
              className="transition group-hover:translate-x-0.5 sm:hidden"
            />
            <ArrowRight
              size={14}
              strokeWidth={3}
              className="hidden transition group-hover:translate-x-0.5 sm:block"
            />
          </div>
        </Link>
      </div>
    </div>
  );
}
