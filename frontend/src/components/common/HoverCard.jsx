import { motion } from 'framer-motion';

export function HoverCard({ children, className = "", delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 100, damping: 20, delay }}
      whileHover={{ 
        y: -8, 
        scale: 1.01,
        transition: { type: "spring", stiffness: 400, damping: 25 }
      }}
      className={`relative group h-full ${className}`}
    >
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-primary-500 to-gold-400 rounded-3xl opacity-0 group-hover:opacity-20 blur transition duration-500 pointer-events-none"></div>
      
      {/* Content wrapper */}
      <div className="relative h-full bg-white rounded-3xl border border-cream-200 overflow-hidden shadow-sm shadow-primary-900/5 group-hover:border-primary-500/30 transition-colors duration-300">
        {children}
      </div>
    </motion.div>
  );
}
