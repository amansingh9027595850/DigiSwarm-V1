import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { clientLogoApi } from '@/api/clientLogo.api';

export default function TrustStrip() {
  const { data } = useQuery({
    queryKey: ['public', 'client-logos'],
    queryFn: () => clientLogoApi.listPublic(),
  });

  const logos = data?.data || [];
  if (logos.length === 0) return null;

  return (
    <section className="border-y border-ink-100 bg-white">
      <div className="container-x py-10">
        <p className="text-center text-xs font-semibold uppercase tracking-widest text-ink-500">
          Trusted by teams shipping at scale
        </p>
        <motion.ul
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="mt-6 grid grid-cols-2 items-center justify-items-center gap-x-8 gap-y-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6"
        >
          {logos.map((c) => {
            const inner = (
              <img
                src={c.logo.url}
                alt={c.name}
                className="max-h-9 max-w-[140px] object-contain opacity-70 transition hover:opacity-100"
                loading="lazy"
              />
            );
            return (
              <li key={c._id}>
                {c.website ? (
                  <a href={c.website} target="_blank" rel="noopener noreferrer">
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </motion.ul>
      </div>
    </section>
  );
}
