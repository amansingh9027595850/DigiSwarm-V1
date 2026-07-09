import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';
import { useSettings } from '@/hooks/useSettings';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/career', label: 'Career' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

export default function PublicNavbar() {
  const { settings } = useSettings();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close the mobile menu whenever the route changes
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    if (open) document.body.classList.add('no-scroll');
    else document.body.classList.remove('no-scroll');
    return () => document.body.classList.remove('no-scroll');
  }, [open]);

  return (
    <header
      className={clsx(
        'sticky top-0 z-40 w-full transition-all',
        scrolled
          ? 'border-b border-ink-100 bg-white/85 backdrop-blur'
          : 'border-b border-transparent bg-transparent',
      )}
    >
      <div className="container-x flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2">
          <img
            src={settings.logo?.url || '/logo.png'}
            alt={settings.siteName}
            className="h-9 w-auto object-contain"
          />
          <span className="hidden text-lg font-extrabold tracking-tight text-ink-900 sm:inline">
            {settings.siteName}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                clsx(
                  'rounded-lg px-3 py-2 text-sm font-medium transition',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/contact" className="btn-primary">
            Contact Us
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setOpen((v) => !v)}
            className="btn-ghost p-2"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-ink-100 bg-white lg:hidden">
          <nav className="container-x flex flex-col gap-1 py-3">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  clsx(
                    'rounded-lg px-3 py-2 text-sm font-medium',
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-ink-700 hover:bg-ink-50',
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/contact" className="btn-primary mt-2" onClick={() => setOpen(false)}>
              Contact Us
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
