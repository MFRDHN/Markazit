import { motion } from 'framer-motion';

// ponytail: was per-word/char motion spans with rotateX/blur/scale — dozens of
// animated elements per heading across 7 sections. Now a single fade-up block.
// Props splitType/from/to are kept for API compat but ignored.

export default function SplitText({
  text,
  className = '',
  delay = 0,
  duration = 0.6,
  tag: Tag = 'p',
  once = true,
}) {
  return (
    <Tag className={className}>
      <motion.span
        className="inline-block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once, margin: '-40px' }}
        transition={{ duration, delay, ease: 'easeOut' }}
      >
        {text}
      </motion.span>
    </Tag>
  );
}
