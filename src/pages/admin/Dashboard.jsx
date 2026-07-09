import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  BarChart,
  Bar,
} from 'recharts';
import {
  MessageSquare,
  Inbox,
  Mail,
  TrendingUp,
  TrendingDown,
  Newspaper,
  Briefcase,
  Users,
  ArrowRight,
} from 'lucide-react';
import clsx from 'clsx';

import { dashboardApi } from '@/api/dashboard.api';
import { api } from '@/api/axios';
import { endpoints } from '@/api/endpoints';
import PageHeader from '@/components/common/PageHeader';
import Loader from '@/components/common/Loader';
import EmptyState from '@/components/common/EmptyState';

const formatRel = (date) => {
  const d = new Date(date);
  const diff = Date.now() - d.getTime();
  const m = Math.round(diff / 60_000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  const days = Math.round(h / 24);
  if (days < 7) return `${days}d ago`;
  return d.toLocaleDateString(undefined, { dateStyle: 'medium' });
};

const TYPE_META = {
  lead: { icon: MessageSquare, color: 'bg-brand-50 text-brand-700' },
  application: { icon: Inbox, color: 'bg-emerald-50 text-emerald-700' },
  message: { icon: Mail, color: 'bg-amber-50 text-amber-700' },
  blog: { icon: Newspaper, color: 'bg-indigo-50 text-indigo-700' },
};

const LEAD_STATUS_LABEL = {
  new: 'New',
  contacted: 'Contacted',
  qualified: 'Qualified',
  proposal: 'Proposal',
  won: 'Won',
  lost: 'Lost',
};

export default function Dashboard() {
  const stats = useQuery({
    queryKey: ['admin', 'dashboard', 'stats'],
    queryFn: () => dashboardApi.stats(),
  });
  const activity = useQuery({
    queryKey: ['admin', 'dashboard', 'activity'],
    queryFn: () => dashboardApi.recentActivity(),
  });
  const health = useQuery({
    queryKey: ['health'],
    queryFn: async () => (await api.get(endpoints.health)).data,
    retry: 0,
  });

  if (stats.isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader />
      </div>
    );
  }

  const s = stats.data?.data;
  if (!s) {
    return (
      <EmptyState
        title="Could not load dashboard"
        description="The stats endpoint failed. Check the server console."
      />
    );
  }

  const c = s.counts;
  const series = s.timeseries;

  const chartData = series.days.map((d, i) => ({
    date: d.slice(5),
    leads: series.leads[i],
    applications: series.applications[i],
    messages: series.contactMessages[i],
  }));

  const leadsByStatus = Object.entries(LEAD_STATUS_LABEL).map(([k, label]) => ({
    name: label,
    count: c.leads.byStatus[k] || 0,
  }));

  return (
    <>
      <Helmet>
        <title>Dashboard — DigiSwarm Admin</title>
      </Helmet>

      <div className="space-y-6">
        <PageHeader
          title="Dashboard"
          description="What changed across leads, content, hiring, and the site."
          actions={
            <ApiStatus
              isLoading={health.isLoading}
              isError={health.isError}
              data={health.data?.data}
            />
          }
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <KpiCard
            label="Leads"
            value={c.leads.total}
            delta={c.leads.delta}
            sub={`${c.leads.last7} new this week`}
            icon={MessageSquare}
            tone="brand"
            to="/admin/leads"
          />
          <KpiCard
            label="Applications"
            value={c.applications.total}
            delta={c.applications.delta}
            sub={`${c.applications.last7} new this week`}
            icon={Inbox}
            tone="emerald"
            to="/admin/applications"
          />
          <KpiCard
            label="Unread messages"
            value={c.contactMessages.unread}
            delta={c.contactMessages.delta}
            sub={`${c.contactMessages.total} all time`}
            icon={Mail}
            tone="amber"
            to="/admin/contact-messages"
          />
          <KpiCard
            label="Blog posts"
            value={c.blogs.total}
            sub={`${c.blogs.published} published · ${c.blogs.drafts} drafts`}
            icon={Newspaper}
            tone="purple"
            to="/admin/blogs"
          />
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-ink-900">Last 30 days</h2>
              <p className="text-sm text-ink-500">Daily volume across submissions.</p>
            </div>
          </div>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eef0f5" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: '#9aa3b6' }}
                  tickLine={false}
                  axisLine={false}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9aa3b6' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: 12,
                    border: '1px solid #eef0f5',
                    fontSize: 12,
                    boxShadow: '0 8px 30px -8px rgba(15,23,42,0.12)',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="leads"
                  stroke="#1f44f5"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="messages"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-ink-900">Recent activity</h2>
              <span className="text-xs text-ink-500">Latest 15 events</span>
            </div>
            <div className="mt-4">
              <ActivityList items={activity.data?.data} loading={activity.isLoading} />
            </div>
          </div>

          <div className="card p-6">
            <h2 className="text-lg font-bold text-ink-900">Leads by status</h2>
            <p className="text-xs text-ink-500">Pipeline distribution</p>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={leadsByStatus} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eef0f5" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 10, fill: '#9aa3b6' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9aa3b6' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: '1px solid #eef0f5',
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#1f44f5" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SmallCard
            label="Services"
            value={c.services.total}
            sub={`${c.services.active} active`}
            icon={Briefcase}
            to="/admin/services"
            tone="brand"
          />
          <SmallCard
            label="Open jobs"
            value={c.jobs.open}
            sub={`${c.jobs.total} total`}
            icon={Briefcase}
            to="/admin/jobs"
            tone="emerald"
          />
          <SmallCard
            label="Team"
            value={c.team.active}
            sub="active on About"
            icon={Users}
            to="/admin/team"
            tone="amber"
          />
        </div>
      </div>
    </>
  );
}

const TONE_GRADIENT = {
  brand: 'from-brand-500 to-indigo-500',
  purple: 'from-purple-500 to-fuchsia-500',
  emerald: 'from-emerald-500 to-teal-500',
  amber: 'from-amber-500 to-orange-500',
};

function KpiCard({ label, value, delta, sub, icon: Icon, tone = 'brand', to }) {
  const up = (delta ?? 0) >= 0;
  const body = (
    <>
      <div
        aria-hidden
        className={clsx(
          'pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br opacity-0 blur-2xl transition-opacity group-hover:opacity-30',
          TONE_GRADIENT[tone] || TONE_GRADIENT.brand,
        )}
      />
      <div className="relative flex items-start justify-between">
        <div
          className={clsx(
            'grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft',
            TONE_GRADIENT[tone] || TONE_GRADIENT.brand,
          )}
        >
          <Icon size={18} />
        </div>
        {typeof delta === 'number' && (
          <span
            className={clsx(
              'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold',
              up ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700',
            )}
          >
            {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
            {Math.abs(delta)}%
          </span>
        )}
      </div>
      <p className="relative mt-4 text-xs font-semibold uppercase tracking-widest text-ink-500">
        {label}
      </p>
      <p className="relative mt-1 text-3xl font-extrabold text-ink-900">{value}</p>
      <p className="relative mt-1 text-xs text-ink-500">{sub}</p>
    </>
  );
  return to ? (
    <Link
      to={to}
      className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      {body}
    </Link>
  ) : (
    <div className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-soft">
      {body}
    </div>
  );
}

function SmallCard({ label, value, sub, icon: Icon, to, tone = 'brand' }) {
  return (
    <Link
      to={to}
      className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-ink-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-card"
    >
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-ink-500">{label}</p>
        <p className="mt-1 text-2xl font-extrabold text-ink-900">{value}</p>
        <p className="mt-0.5 truncate text-xs text-ink-500">{sub}</p>
      </div>
      <div
        className={clsx(
          'grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br text-white shadow-soft',
          TONE_GRADIENT[tone] || TONE_GRADIENT.brand,
        )}
      >
        <Icon size={18} />
      </div>
    </Link>
  );
}

function ActivityList({ items, loading }) {
  if (loading) {
    return (
      <div className="flex min-h-[120px] items-center justify-center">
        <Loader />
      </div>
    );
  }
  if (!items?.length) {
    return (
      <p className="py-10 text-center text-sm text-ink-500">
        No activity yet — submissions will appear here as they come in.
      </p>
    );
  }
  return (
    <ul className="divide-y divide-ink-100">
      {items.map((it) => {
        const meta = TYPE_META[it.type] || TYPE_META.message;
        const Icon = meta.icon;
        return (
          <li key={`${it.type}-${it.id}`}>
            <Link
              to={it.link}
              className="flex items-start gap-3 py-3 transition hover:bg-ink-50/40 -mx-2 px-2 rounded-lg"
            >
              <div className={clsx('grid h-9 w-9 shrink-0 place-items-center rounded-xl', meta.color)}>
                <Icon size={16} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink-900">{it.title}</p>
                <p className="truncate text-xs text-ink-500">
                  <span className="capitalize">{it.type}</span> · {it.subtitle}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-ink-500">{formatRel(it.at)}</p>
                {it.status && (
                  <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-widest text-ink-400">
                    {it.status}
                  </p>
                )}
              </div>
              <ArrowRight size={14} className="mt-1.5 shrink-0 text-ink-300" />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ApiStatus({ isLoading, isError, data }) {
  if (isLoading) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1 text-xs font-medium text-ink-600">
        <span className="h-2 w-2 animate-pulse rounded-full bg-ink-400" />
        Checking API…
      </span>
    );
  }
  if (isError || !data) {
    return (
      <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-700">
        <span className="h-2 w-2 rounded-full bg-red-500" />
        API offline
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
      <span className="h-2 w-2 rounded-full bg-emerald-500" />
      API live · db: {data.db}
    </span>
  );
}
