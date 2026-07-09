import { useEffect, useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '@/hooks/useSettings';

const DEFAULT_NUMBER = '919999999999';

const sanitizeNumber = (n) => String(n || '').replace(/[^\d]/g, '');

export default function FloatingWhatsApp() {
  const { settings } = useSettings();
  const [visible, setVisible] = useState(false);
  const [tipOpen, setTipOpen] = useState(false);

  const raw =
    settings.contact?.whatsapp || settings.contact?.phone || DEFAULT_NUMBER;
  const number = sanitizeNumber(raw);
  const siteName = settings.siteName || 'DigiSwarm';
  const message = encodeURIComponent(
    `Hi ${siteName} team! I'd like to know more about your services.`,
  );
  const href = `https://wa.me/${number}?text=${message}`;

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 120);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (visible && !tipOpen) {
      const t = setTimeout(() => setTipOpen(true), 800);
      return () => clearTimeout(t);
    }
  }, [visible, tipOpen]);

  if (!number || number.length < 10) return null;

  return (
    <div
      className={clsx(
        'fixed bottom-5 right-5 z-50 flex items-end gap-3 transition-all duration-300 sm:bottom-6 sm:right-6',
        visible
          ? 'translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
      )}
    >
      {tipOpen && (
        <div className="relative hidden max-w-[220px] rounded-2xl bg-white px-4 py-3 text-sm shadow-card ring-1 ring-ink-100 sm:block">
          <button
            onClick={() => setTipOpen(false)}
            aria-label="Dismiss"
            className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full bg-ink-900 text-white shadow-soft hover:bg-ink-700"
          >
            <X size={11} />
          </button>
          <p className="font-semibold text-ink-900">Need help?</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink-600">
            Chat with us on WhatsApp — we reply within minutes.
          </p>
          <span className="absolute -bottom-2 right-6 h-3 w-3 rotate-45 bg-white ring-1 ring-ink-100" />
        </div>
      )}

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative grid h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-card transition hover:scale-105 hover:bg-[#1ebe57]"
      >
        <span className="absolute inset-0 -z-10 animate-ping rounded-full bg-[#25D366]/60" />
        <WhatsAppIcon className="h-7 w-7" />
        <span className="sr-only">WhatsApp</span>
      </a>
    </div>
  );
}

function WhatsAppIcon({ className = 'h-6 w-6' }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path d="M19.11 17.55c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.34.22-.64.07-.3-.15-1.26-.47-2.4-1.49-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51l-.57-.01c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49 0 1.47 1.07 2.89 1.22 3.09.15.2 2.11 3.22 5.11 4.51.71.31 1.27.49 1.71.63.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35zM16.03 6C10.49 6 6 10.49 6 16.03c0 1.77.47 3.5 1.34 5.02L6 27l6.1-1.6a9.95 9.95 0 0 0 3.93.81h.01c5.53 0 10.02-4.49 10.02-10.02 0-2.68-1.04-5.2-2.93-7.09A9.95 9.95 0 0 0 16.03 6zm0 18.18h-.01a8.18 8.18 0 0 1-4.17-1.14l-.3-.18-3.62.95.97-3.53-.2-.32A8.16 8.16 0 1 1 24.2 16.03c0 4.51-3.66 8.15-8.17 8.15z" />
    </svg>
  );
}
