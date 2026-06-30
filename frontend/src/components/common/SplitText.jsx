import { motion } from 'framer-motion';

export default function SplitText({
  text,
  className = '',
  delay = 0.05,
  duration = 0.7,
  splitType = 'chars',
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  tag: Tag = 'p',
  once = true,
}) {
  const parts =
    splitType === 'chars'
      ? text.split('').map((c, i) => ({ key: `c-${i}`, content: c, isSpace: c === ' ' }))
      : text.split(/\s+/).map((w, i) => ({ key: `w-${i}`, content: w, isSpace: false }));

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: delay } },
  };

  const child = {
    hidden: { ...from },
    visible: {
      ...to,
      transition: { duration, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const isCenter = className.includes('justify-center') || className.includes('text-center');
  const innerClasses = `flex flex-wrap w-full ${isCenter ? 'justify-center' : ''}`;

  return (
    <Tag className={className.replace(/justify-center\s*/g, '')}>
      <motion.span
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: '-50px' }}
        className={innerClasses}
      >
        {parts.map((part) =>
          part.isSpace ? (
            <span key={part.key} style={{ width: '0.3em' }}>&nbsp;</span>
          ) : (
            <motion.span key={part.key} variants={child} className="inline-block">
              {part.content}
              {splitType !== 'chars' ? '\u00A0' : ''}
            </motion.span>
          )
        )}
      </motion.span>
    </Tag>
  );
}
