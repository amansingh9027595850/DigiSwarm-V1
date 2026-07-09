import { NavLink, Link } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Newspaper,
  MessageSquare,
  Settings,
  Tag,
  Inbox,
  Mail,
  ExternalLink,
  Sparkles,
  GraduationCap,
} from 'lucide-react';

const SECTIONS = [
  {
    label: null,
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Content',
    items: [
      { to: '/admin/services', label: 'Services', icon: Briefcase },
      { to: '/admin/blogs', label: 'Blogs', icon: Newspaper },
      { to: '/admin/blog-categories', label: 'Blog Categories', icon: Tag },
      { to: '/admin/team', label: 'Team', icon: Users },
    ],
  },
  {
    label: 'Career',
    items: [
      { to: '/admin/jobs', label: 'Jobs / Vacancies', icon: Briefcase },
      { to: '/admin/applications', label: 'Applications', icon: Inbox },
    ],
  },
  {
    label: 'Events',
    items: [
      { to: '/admin/workshops', label: 'Workshops', icon: GraduationCap },
      { to: '/admin/workshop-registrations', label: 'Registrations', icon: Inbox },
    ],
  },
  {
    label: 'Inbox',
    items: [
      { to: '/admin/leads', label: 'Leads / Queries', icon: MessageSquare },
      { to: '/admin/contact-messages', label: 'Contact Messages', icon: Mail },
    ],
  },
  {
    label: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

export default function AdminSidebar({ open }) {
  return (
    <aside
      className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 transform border-r border-ink-100 bg-white transition-transform duration-300 lg:translate-x-0',
        open ? 'translate-x-0' : '-translate-x-full',
      )}
    >
      {/* Brand header */}
      <Link
        to="/admin"
        className="relative flex h-16 items-center gap-2.5 overflow-hidden border-b border-ink-100 px-5"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-brand-100/60 blur-2xl"
        />
        <span className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-brand-600 to-indigo-600 text-white shadow-soft">
          <img
            src="/logo.png"
            alt=""
            className="absolute inset-1 h-[calc(100%-0.5rem)] w-[calc(100%-0.5rem)] rounded-lg bg-white object-contain p-0.5"
          />
        </span>
        <div className="relative leading-tight">
          <p className="text-sm font-extrabold tracking-tight text-ink-900">DigiSwarm</p>
          <p className="text-[10px] uppercase tracking-widest text-brand-700">
            Admin console
          </p>
        </div>
      </Link>

      {/* Nav */}
      <nav className="flex h-[calc(100vh-4rem-3.25rem)] flex-col gap-3 overflow-y-auto px-3 py-4">
        {SECTIONS.map((section, sIdx) => (
          <div key={sIdx} className="space-y-0.5">
            {section.label && (
              <p className="mb-1 px-3 text-[10px] font-bold uppercase tracking-widest text-ink-400">
                {section.label}
              </p>
            )}
            {section.items.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  clsx(
                    'group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition',
                    isActive
                      ? 'bg-gradient-to-r from-brand-50 to-brand-50/40 text-brand-700'
                      : 'text-ink-600 hover:bg-ink-50 hover:text-ink-900',
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    {/* Active indicator bar */}
                    <span
                      aria-hidden
                      className={clsx(
                        'absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-brand-500 to-indigo-500 transition-opacity',
                        isActive ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    <Icon
                      size={17}
                      className={clsx(
                        'shrink-0 transition',
                        isActive ? 'text-brand-700' : 'text-ink-400 group-hover:text-ink-700',
                      )}
                    />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}

        {/* Footer card */}
        <div className="mt-auto rounded-xl border border-brand-100 bg-gradient-to-br from-brand-50 to-indigo-50/60 p-3">
          <div className="flex items-center gap-2">
            <span className="grid h-7 w-7 place-items-center rounded-lg bg-white text-brand-700 shadow-soft">
              <Sparkles size={14} />
            </span>
            <p className="text-xs font-bold text-ink-900">View public site</p>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-ink-600">
            See your changes live on the customer-facing site.
          </p>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-brand-700 shadow-soft transition hover:bg-brand-600 hover:text-white"
          >
            Open site <ExternalLink size={11} />
          </Link>
        </div>
      </nav>
    </aside>
  );
}
