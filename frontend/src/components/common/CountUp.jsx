import { useRef, useEffect, useState } from 'react';
import { useInView } from 'framer-motion';

// ponytail: replaced useMotionValue+useSpring+useTransform with a simple
// requestAnimationFrame counter. Spring physics on every counter tick is
// overkill for a number that just counts up once.

export default function CountUp({ value, prefix = '', suffix = '', className = '', duration = 2, delay = 0, decimals = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [display, setDisplay] = useState(decimals > 0 ? '0' : '0');

  useEffect(() => {
    if (!isInView) return;
    const timeout = setTimeout(() => {
      const steps = 30;
      let step = 0;
      const increment = value / steps;
      let current = 0;

      const tick = () => {
        step++;
        current += increment;
        if (step >= steps) {
          setDisplay(decimals > 0 ? value.toFixed(decimals) : Math.floor(value).toLocaleString('id-ID'));
          return;
        }
        setDisplay(decimals > 0 ? current.toFixed(decimals) : Math.floor(current).toLocaleString('id-ID'));
        requestAnimationFrame(tick);
      };

      requestAnimationFrame(tick);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [isInView, value, delay, decimals]);

  return (
    <span ref={ref} className={className}>
      {prefix}{display}{suffix}
    </span>
  );
}