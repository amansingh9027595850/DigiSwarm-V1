import { motion } from 'framer-motion';
import { STATS } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 12 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function StatsStrip() {
  return (
    <section className="section pt-0">
      <div className="container-x">
        <div className="card overflow-hidden border-0 bg-ink-900 p-5 text-white shadow-card sm:p-8 md:p-12">
          <div className="grid grid-cols-2 gap-4 sm:gap-8 md:grid-cols-4 md:gap-6 lg:gap-8">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.4 }}
                variants={fade}
                custom={i}
                className="text-center"
              >
                <p className="text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  <span className="bg-gradient-to-r from-brand-300 to-brand-100 bg-clip-text text-transparent">
                    {s.value}
                  </span>
                </p>
                <p className="mt-1 text-xs text-ink-300 sm:mt-2 sm:text-sm">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
