import { motion } from 'framer-motion';

// ponytail: was one motion span per word (stagger) — heavy on long headings.
// Single fade-up block now.

export function TextReveal({ text, className = "", delay = 0 }) {
  return (
    <motion.div
      className={`${className}`}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.6, delay, ease: "easeOut" }}
    >
      {text}
    </motion.div>
  );
}
