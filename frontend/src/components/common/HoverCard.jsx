import { motion } from 'framer-motion';

// ponytail: spring physics + blur glow layer + hover scale removed — hover is
// now a cheap translate + border color shift.

export function HoverCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.45, ease: "easeOut", delay }}
      whileHover={{ y: -6, transition: { duration: 0.2, ease: "easeOut" } }}
      className={`relative group h-full ${className}`}
    >
      <div className="relative h-full bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm shadow-primary-900/5 group-hover:border-gold-400/40 transition-colors duration-300">
        {children}
      </div>
    </motion.div>
  );
}
