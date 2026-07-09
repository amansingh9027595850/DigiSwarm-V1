import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Linkedin,
  Twitter,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  MapPin,
  ArrowUpRight,
  Phone,
} from 'lucide-react';
import { useSettings } from '@/hooks/useSettings';

const EXPLORE = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/services', label: 'Services' },
  { to: '/blog', label: 'Blog' },
  { to: '/career', label: 'Career' },
  { to: '/courses', label: 'Courses' },
  { to: '/contact', label: 'Contact' },
];

const SERVICES_LINKS = [
  { to: '/services/social-media-marketing', label: 'Social Media Marketing' },
  { to: '/services/website-design', label: 'Website Development' },
  { to: '/services/pay-per-click', label: 'Online Advertising' },
  { to: '/services/influencer-marketing', label: 'Influencer Marketing' },
  { to: '/services/search-engine-optimisation', label: 'Search Engine Optimisation' },
  { to: '/services/content-writing', label: 'Content Writing' },
  { to: '/services/graphic-design', label: 'Graphic Design' },
];

const LEGAL = [
  { to: '/privacy-policy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms & Conditions' },
];

const SOCIAL_ICONS = {
  linkedin: Linkedin,
  instagram: Instagram,
  facebook: Facebook,
  twitter: Twitter,
  youtube: Youtube,
};

export default function PublicFooter() {
  const { settings } = useSettings();
  const socials = settings.socials || {};
  // useSettings merges API data with FALLBACK, so these always resolve
  const contactEmail = settings.contact?.email;
  const address = settings.contact?.address;
  const phone = settings.contact?.phone;

  return (
    <footer className="relative mt-10 overflow-hidden bg-ink-950 text-ink-200 sm:mt-12">
      <div className="pointer-events-none absolute inset-x-0 -top-32 h-64 bg-[radial-gradient(circle_at_50%_0%,rgba(53,99,255,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute -right-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-brand-600/10 blur-3xl" />

      <div className="relative container-x py-8 sm:py-10 lg:py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-12 lg:gap-10">
          <div className="sm:col-span-2 lg:col-span-4">
            <Link to="/" className="flex items-center gap-2.5">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-white p-1.5 shadow-soft">
                <img
                  src={settings.logo?.url || '/logo.png'}
                  alt={settings.siteName}
                  className="h-full w-full object-contain"
                />
              </span>
              <span className="text-2xl font-extrabold tracking-tight text-white">
                {settings.siteName}
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-ink-400">
              With {settings.siteName}, you can attract, impress, and convert more leads online and
              get results.
            </p>

            <div className="mt-6">
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-ink-500"
              >
                <span>Follow us</span>
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500 animate-ping" />
              </motion.p>
              <motion.div
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08,
                    },
                  },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-20px' }}
                className="mt-3 flex flex-wrap gap-2"
              >
                {Object.entries(SOCIAL_ICONS).map(([k, Icon]) => {
                  const url =
                    k === 'instagram'
                      ? (socials[k] || 'https://www.instagram.com/digiswarm')
                      : k === 'linkedin'
                        ? (socials[k] || 'https://www.linkedin.com/company/digiswarm?_l=en_US')
                        : k === 'facebook'
                          ? (socials[k] || 'https://www.facebook.com/DigiSwarm/')
                          : k === 'twitter'
                            ? (socials[k] || 'https://x.com/digiswarm')
                            : k === 'youtube'
                              ? (socials[k] || 'https://www.youtube.com/@digiswarm')
                              : socials[k];
                  const baseStyles =
                    'group grid h-10 w-10 place-items-center rounded-xl border text-white transition duration-300 ease-out';
                  const activeStyles =
                    'border-white/20 bg-white/10 shadow-[0_0_25px_rgba(59,130,246,0.18)] hover:border-brand-400/50 hover:bg-brand-500/20 hover:text-white';
                  const inactiveStyles =
                    'border-white/10 bg-white/5 text-ink-400 opacity-50 cursor-not-allowed';

                  const itemVariants = {
                    hidden: { opacity: 0, y: 15 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: 'spring', stiffness: 350, damping: 18 },
                    },
                  };

                  return url ? (
                    <motion.a
                      key={k}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={k}
                      variants={itemVariants}
                      whileHover={{
                        scale: 1.15,
                        y: -5,
                        rotate: [0, -6, 6, 0],
                        transition: { duration: 0.3 },
                      }}
                      whileTap={{ scale: 0.95 }}
                      className={`${baseStyles} ${activeStyles}`}
                    >
                      <Icon size={16} className="transition duration-300 group-hover:scale-110" />
                    </motion.a>
                  ) : (
                    <motion.span
                      key={k}
                      variants={itemVariants}
                      className={`${baseStyles} ${inactiveStyles}`}
                      aria-label={`${k} not available`}
                      title="Coming soon"
                    >
                      <Icon size={16} />
                    </motion.span>
                  );
                })}
              </motion.div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Explore</h4>
            <ul className="mt-4 space-y-2">
              {EXPLORE.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1 text-sm text-ink-400 transition hover:text-white"
                  >
                    <span>{l.label}</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">Services</h4>
            <ul className="mt-4 space-y-2">
              {SERVICES_LINKS.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="group inline-flex items-center gap-1 text-sm text-ink-400 transition hover:text-white"
                  >
                    <span>{l.label}</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-x-1 transition group-hover:opacity-100 group-hover:translate-x-0"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-white">
              Get in touch
            </h4>

            <a
              href={`mailto:${contactEmail}`}
              className="group mt-4 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-brand-400/30 hover:bg-brand-500/5"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                <Mail size={16} />
              </span>
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                  Email
                </p>
                <p className="mt-0.5 truncate text-sm font-semibold text-white group-hover:text-brand-200">
                  {contactEmail}
                </p>
              </div>
            </a>

            {phone && (
              <a
                href={`tel:${phone}`}
                className="group mt-2.5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 transition hover:border-brand-400/30 hover:bg-brand-500/5"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                  <Phone size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                    Phone
                  </p>
                  <p className="mt-0.5 truncate text-sm font-semibold text-white group-hover:text-brand-200">
                    {phone}
                  </p>
                </div>
              </a>
            )}

            {address && (
              <div className="mt-2.5 flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-500/15 text-brand-300">
                  <MapPin size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-ink-500">
                    Office
                  </p>
                  <p className="mt-0.5 text-sm leading-relaxed text-white/90">{address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-white/5">
        <div className="container-x flex flex-col gap-3 py-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {settings.siteName}. All rights reserved.
          </p>
          <p className="flex flex-wrap items-center gap-4">
            {LEGAL.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className="transition hover:text-white"
              >
                {l.label}
              </Link>
            ))}
          </p>
        </div>
      </div>
    </footer>
  );
}
