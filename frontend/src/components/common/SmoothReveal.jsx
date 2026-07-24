import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

// ponytail: replaced expensive useScroll/useTransform with simpler useInView
// useScroll attaches a scroll listener per component — 4 instances on Home.jsx
// was heavy. useInView uses IntersectionObserver (off-main-thread).

function useView() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  return { ref, isInView };
}

export function SmoothReveal({ children, className = '', delay = 0 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function ParallaxFade({ children, className = '', speed = 0.3 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 50 * speed }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function SlideIn({ children, className = '', delay = 0 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, x: -60 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function ScaleOnScroll({ children, className = '', delay = 0 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function BlurReveal({ children, className = '', delay = 0 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}

export function RotateIn({ children, className = '', delay = 0 }) {
  const { ref, isInView } = useView();
  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ opacity: 0, rotate: -3, scale: 0.95 }}
      animate={isInView ? { opacity: 1, rotate: 0, scale: 1 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
}