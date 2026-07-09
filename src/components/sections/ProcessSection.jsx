import { motion } from 'framer-motion';
import SectionHeading from '@/components/common/SectionHeading';
import { PROCESS } from '@/data/placeholders';

const fade = {
  hidden: { opacity: 0, y: 14 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: 'easeOut' },
  }),
};

export default function ProcessSection() {
  return (
    <section className="section bg-ink-50/60">
      <div className="container-x">
        <SectionHeading
          eyebrow="How we work"
          title="A predictable path from idea to impact"
          subtitle="Four phases, weekly demos, transparent metrics. No surprises — just shipped software."
        />

        <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4 md:grid-cols-4 md:gap-5 lg:gap-5">
          {PROCESS.map((p, i) => (
            <motion.div
              key={p.step}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fade}
              custom={i}
              className="relative rounded-2xl border border-ink-100 bg-white p-3 shadow-soft sm:p-5 lg:p-6"
            >
              <span className="absolute -top-2.5 left-3 inline-flex items-center rounded-full bg-brand-600 px-2 py-0.5 text-[9px] font-bold tracking-widest text-white sm:-top-3 sm:left-6 sm:px-2.5 sm:text-[10px]">
                STEP {p.step}
              </span>
              <div className="mt-2 grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-700 sm:mt-3 sm:h-11 sm:w-11 sm:rounded-xl">
                <p.icon size={16} className="sm:hidden" />
                <p.icon size={20} className="hidden sm:block" />
              </div>
              <h3 className="mt-3 text-sm font-bold text-ink-900 sm:mt-5 sm:text-base lg:text-lg">
                {p.title}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-ink-600 sm:mt-2 sm:text-sm">
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
