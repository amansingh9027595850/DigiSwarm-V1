import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import {
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
  Users,
  ArrowRight,
  Briefcase,
} from 'lucide-react';
import SectionHeading from '@/components/common/SectionHeading';
import { teamApi } from '@/api/teamMember.api';

const fade = {
  hidden: { opacity: 0, y: 16 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: (i % 8) * 0.05, duration: 0.5, ease: 'easeOut' },
  }),
};

const initialsOf = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join('');

// Each card gets a different gradient → tile feels lively even without photos.
const AVATAR_GRADIENTS = [
  'from-brand-500 to-indigo-500',
  'from-emerald-500 to-teal-500',
  'from-amber-500 to-orange-500',
  'from-fuchsia-500 to-rose-500',
  'from-sky-500 to-cyan-500',
  'from-violet-500 to-purple-500',
  'from-rose-500 to-pink-500',
  'from-teal-500 to-emerald-500',
];

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  twitter: Twitter,
  website: Globe,
};

export default function TeamSection() {
  const { data } = useQuery({
    queryKey: ['public', 'team'],
    queryFn: () => teamApi.listPublic(),
  });
  const members = data?.data || [];

  const departments = useMemo(() => {
    const set = new Set();
    members.forEach((m) => {
      if (m.department) set.add(m.department);
    });
    return Array.from(set);
  }, [members]);

  if (members.length === 0) return null;

  return (
    <section className="section relative overflow-hidden">
      {/* Decorative background */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-1/4 -z-10 h-72 w-72 rounded-full bg-brand-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-1/4 -z-10 h-72 w-72 rounded-full bg-fuchsia-200/25 blur-3xl"
      />
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.13] [background-image:radial-gradient(rgba(31,68,245,0.4)_1px,transparent_1px)] [background-size:22px_22px]"
      />

      <div className="container-x">
        <SectionHeading
          eyebrow="The team"
          title="The people behind DigiSwarm"
          subtitle="In the ever-expanding field of digital marketing, we are led by visionaries. Strategy, design, and execution — all under one roof."
        />

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
          className="mx-auto mt-6 grid max-w-2xl grid-cols-2 gap-2.5 sm:mt-8 sm:grid-cols-3 sm:gap-3"
        >
          <StatPill
            value={members.length}
            label={members.length === 1 ? 'Specialist' : 'Specialists'}
            icon={Users}
          />
          <StatPill
            value={departments.length || 4}
            label="Disciplines"
            icon={Briefcase}
          />
          <StatPill
            value="In-house"
            label="All under one roof"
            icon={Sparkles}
            className="col-span-2 sm:col-span-1"
          />
        </motion.div>

        {/* Grid — 2 cols on phones, 3 on tablets, 4 on laptops, 5 on wide */}
        <div className="mt-7 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 lg:gap-5 2xl:grid-cols-5">
          {members.map((m, i) => (
            <TeamCard key={m._id} member={m} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-8 flex justify-center sm:mt-10"
        >
          <Link
            to="/career"
            className="group inline-flex items-center gap-2 rounded-full border border-brand-200 bg-white px-5 py-2.5 text-sm font-semibold text-brand-700 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-50"
          >
            <Sparkles size={14} className="text-brand-600" />
            Want to join the team?
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

function StatPill({ value, label, icon: Icon, className = '' }) {
  return (
    <div
      className={`flex items-center justify-center gap-2.5 rounded-2xl border border-ink-100 bg-white/80 px-3 py-3 shadow-soft backdrop-blur sm:px-4 ${className}`}
    >
      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-700">
        <Icon size={16} />
      </div>
      <div className="min-w-0 text-left leading-tight">
        <p className="text-lg font-extrabold text-ink-900 [overflow-wrap:normal]">{value}</p>
        <p className="text-[10px] font-medium uppercase tracking-widest text-ink-500">
          {label}
        </p>
      </div>
    </div>
  );
}

function TeamCard({ member: m, index }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  const hasSocials =
    m.socials && Object.values(m.socials).some((v) => v && typeof v === 'string');

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fade}
      custom={index}
      className="group relative overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-soft transition duration-300 hover:-translate-y-1 hover:border-brand-200 hover:shadow-card"
    >
      {/* Avatar tile — gradient bg with initials, or photo if available */}
      <div className="relative aspect-[4/5] overflow-hidden">
        {m.photo?.url ? (
          <img
            src={m.photo.url}
            alt={m.name}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
            loading="lazy"
          />
        ) : (
          <>
            <div
              className={`absolute inset-0 bg-gradient-to-br ${gradient}`}
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.35),transparent_60%)]"
            />
            <div className="absolute inset-0 grid place-items-center">
              <span className="text-3xl font-extrabold tracking-tight text-white drop-shadow sm:text-5xl lg:text-6xl">
                {initialsOf(m.name)}
              </span>
            </div>
          </>
        )}

        {/* Bottom dark fade for legibility */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ink-900/80 via-ink-900/35 to-transparent"
        />

        {/* Role pill — hide on tiny screens, show from sm+ */}
        {m.role && (
          <span className="absolute left-2 top-2 hidden items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-800 shadow-soft backdrop-blur sm:left-3 sm:top-3 sm:inline-flex sm:px-2.5 sm:py-1 sm:text-[10px]">
            {m.role}
          </span>
        )}

        {/* Name overlay at bottom — sizes down on mobile */}
        <div className="absolute inset-x-0 bottom-0 p-2.5 text-white sm:p-4">
          <p className="text-sm font-extrabold leading-tight drop-shadow sm:text-lg lg:text-xl">
            {m.name}
          </p>
          {m.department && (
            <p className="mt-0.5 text-[10px] font-medium text-white/85 sm:text-[11px]">
              {m.department}
            </p>
          )}
        </div>
      </div>

      {/* Body — bio hidden on phones to keep cards square-ish */}
      <div className="p-3 sm:p-4 lg:p-5">
        {m.bio && (
          <p className="hidden text-sm leading-relaxed text-ink-600 sm:line-clamp-3 sm:block">
            {m.bio}
          </p>
        )}
        {m.role && (
          <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-700 sm:hidden">
            {m.role}
          </p>
        )}
        {hasSocials && (
          <div className="mt-2 flex items-center gap-1 sm:mt-4 sm:gap-1.5">
            {Object.entries(SOCIAL_ICONS).map(([k, Icon]) => {
              const url = m.socials?.[k];
              if (!url) return null;
              return (
                <a
                  key={k}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${m.name} on ${k}`}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-ink-100 text-ink-500 transition hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50 hover:text-brand-700 sm:h-9 sm:w-9 sm:rounded-xl"
                >
                  <Icon size={13} />
                </a>
              );
            })}
          </div>
        )}
      </div>

      {/* Hover accent ring */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 ring-1 ring-brand-300/30 transition group-hover:opacity-100"
      />
    </motion.div>
  );
}
