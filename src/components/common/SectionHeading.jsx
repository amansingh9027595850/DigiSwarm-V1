import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={clsx(
        'max-w-2xl',
        align === 'center' && 'mx-auto text-center',
        align === 'left' && 'text-left',
        className,
      )}
    >
      {eyebrow && (
        <span className="inline-block text-xs font-semibold uppercase tracking-widest text-brand-700">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-ink-900 sm:mt-3 sm:text-3xl md:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2.5 text-sm leading-relaxed text-ink-600 sm:mt-3 sm:text-base lg:text-lg">
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
