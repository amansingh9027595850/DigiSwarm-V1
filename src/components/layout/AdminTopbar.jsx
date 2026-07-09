import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Search,
  LogOut,
  User as UserIcon,
  ChevronDown,
  Settings,
  ExternalLink,
} from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/hooks/useAuth';

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('') || '?';

const PATH_TITLE = [
  [/^\/admin$/, 'Dashboard'],
  [/^\/admin\/services\/new/, 'New Service'],
  [/^\/admin\/services\/.+\/edit/, 'Edit Service'],
  [/^\/admin\/services/, 'Services'],
  [/^\/admin\/blogs\/new/, 'New Article'],
  [/^\/admin\/blogs\/.+\/edit/, 'Edit Article'],
  [/^\/admin\/blogs/, 'Blogs'],
  [/^\/admin\/blog-categories/, 'Blog Categories'],
  [/^\/admin\/team/, 'Team'],
  [/^\/admin\/jobs\/new/, 'New Role'],
  [/^\/admin\/jobs\/.+\/edit/, 'Edit Role'],
  [/^\/admin\/jobs/, 'Jobs / Vacancies'],
  [/^\/admin\/applications/, 'Applications'],
  [/^\/admin\/leads/, 'Leads / Queries'],
  [/^\/admin\/contact-messages/, 'Contact Messages'],
  [/^\/admin\/settings/, 'Settings'],
];

const titleFor = (pathname) => {
  for (const [re, title] of PATH_TITLE) {
    if (re.test(pathname)) return title;
  }
  return 'Admin';
};

export default function AdminTopbar({ onToggleSidebar }) {
  const { user, role, logout } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const menuRef = useRef(null);
  const notifRef = useRef(null);

  const title = useMemo(() => titleFor(pathname), [pathname]);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMenuOpen(false);
    setNotifOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-20 border-b border-ink-100 bg-white/85 px-4 backdrop-blur-md lg:px-6">
      <div className="flex h-16 items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="btn-ghost p-2 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Page title */}
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-widest text-ink-400">
              Admin
            </p>
            <h1 className="truncate text-base font-extrabold leading-tight text-ink-900 sm:text-lg">
              {title}
            </h1>
          </div>
        </div>

        {/* Desktop search */}
        <div className="relative hidden flex-1 md:block md:max-w-sm lg:max-w-md">
          <Search
            size={16}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-400"
          />
          <input
            placeholder="Search admin…"
            className="w-full rounded-xl border border-ink-200 bg-white/70 py-2 pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-100"
            aria-label="Search admin"
          />
          <kbd className="pointer-events-none absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-md border border-ink-200 bg-ink-50 px-1.5 py-0.5 text-[10px] font-medium text-ink-500 lg:block">
            ⌘K
          </kbd>
        </div>

        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          {/* Public site link */}
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden items-center gap-1.5 rounded-xl border border-ink-200 bg-white px-3 py-1.5 text-xs font-semibold text-ink-700 transition hover:border-brand-300 hover:text-brand-700 sm:inline-flex"
            title="Open public site"
          >
            <ExternalLink size={13} /> View site
          </Link>

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((v) => !v)}
              className="relative grid h-9 w-9 place-items-center rounded-xl text-ink-700 transition hover:bg-ink-100"
              aria-label="Notifications"
            >
              <Bell size={17} />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-brand-600 ring-2 ring-white" />
            </button>
            {notifOpen && (
              <div className="absolute right-0 mt-2 w-72 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card">
                <div className="border-b border-ink-100 px-4 py-3">
                  <p className="text-sm font-bold text-ink-900">Notifications</p>
                  <p className="text-[11px] text-ink-500">
                    New applications and leads will appear here.
                  </p>
                </div>
                <div className="px-4 py-8 text-center">
                  <p className="text-xs text-ink-500">All caught up — no new notifications.</p>
                </div>
                <Link
                  to="/admin/applications"
                  className="block border-t border-ink-100 px-4 py-2.5 text-center text-xs font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  View applications →
                </Link>
              </div>
            )}
          </div>

          {/* User menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className={clsx(
                'flex items-center gap-2 rounded-xl border border-transparent px-1.5 py-1 transition sm:px-2 sm:py-1.5',
                menuOpen ? 'bg-ink-50' : 'hover:bg-ink-50',
              )}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
            >
              <div className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-brand-500 to-indigo-500 text-[11px] font-bold text-white shadow-soft">
                {user?.avatar?.url ? (
                  <img
                    src={user.avatar.url}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  initialsOf(user?.name)
                )}
              </div>
              <div className="hidden text-left leading-tight sm:block">
                <p className="text-xs font-bold text-ink-900">{user?.name || 'Account'}</p>
                <p className="text-[10px] uppercase tracking-widest text-brand-700">
                  {role || '—'}
                </p>
              </div>
              <ChevronDown
                size={14}
                className={clsx('hidden text-ink-500 transition sm:block', menuOpen && 'rotate-180')}
              />
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 mt-2 w-60 overflow-hidden rounded-xl border border-ink-100 bg-white shadow-card"
              >
                <div className="border-b border-ink-100 p-3">
                  <p className="truncate text-sm font-bold text-ink-900">{user?.name}</p>
                  <p className="truncate text-xs text-ink-500">{user?.email}</p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-700">
                    <UserIcon size={9} /> {role || '—'}
                  </span>
                </div>
                <Link
                  to="/admin"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50"
                >
                  <UserIcon size={15} /> Dashboard
                </Link>
                <Link
                  to="/admin/settings"
                  className="flex items-center gap-2 px-3 py-2.5 text-sm text-ink-700 transition hover:bg-ink-50"
                >
                  <Settings size={15} /> Settings
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    logout();
                  }}
                  className="flex w-full items-center gap-2 border-t border-ink-100 px-3 py-2.5 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={15} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
