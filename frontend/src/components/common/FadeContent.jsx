import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function FadeContent({
  children,
  className = '',
  duration = 0.7,
  delay = 0,
  threshold = 0.15,
  once = false,
  initial = { opacity: 0, y: 40, filter: 'blur(4px)' },
  enter = { opacity: 1, y: 0, filter: 'blur(0px)' },
  exit,
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once, margin: `-${(1 - threshold) * 100}px` });

  const exitVariants = exit !== undefined ? exit : initial;

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={initial}
      animate={isInView ? enter : exitVariants}
      transition={{ duration, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {children}
    </motion.div>
  );
}
