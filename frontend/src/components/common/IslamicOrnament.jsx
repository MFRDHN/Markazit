import { motion } from 'framer-motion';

export default function IslamicOrnament({ className = "", size = 64, color = "currentColor", type = "star" }) {
  // 8-point Islamic star path (Rub el Hizb style)
  const starPath = "M32 2 L40 14 L54 10 L50 24 L62 32 L50 40 L54 54 L40 50 L32 62 L24 50 L10 54 L14 40 L2 32 L14 24 L10 10 L24 14 Z";
  
  // Lantern path
  const lanternPath = "M32 2 L36 10 L36 12 L42 12 L42 16 L38 20 L38 48 L44 52 L44 56 L20 56 L20 52 L26 48 L26 20 L22 16 L22 12 L28 12 L28 10 Z";

  // Crescent path
  const crescentPath = "M32 4 A24 24 0 1 0 56 28 A20 20 0 1 1 32 4 Z";

  const getPath = () => {
    switch (type) {
      case 'lantern': return lanternPath;
      case 'crescent': return crescentPath;
      default: return starPath;
    }
  };

  const getAnimation = () => {
    switch (type) {
      case 'lantern': return { y: [0, -10, 0] };
      case 'crescent': return { rotate: [-5, 5, -5] };
      default: return { rotate: [0, 90, 180, 270, 360] };
    }
  };

  const getTransition = () => {
    switch (type) {
      case 'lantern': return { repeat: Infinity, duration: 4, ease: "easeInOut" };
      case 'crescent': return { repeat: Infinity, duration: 6, ease: "easeInOut" };
      default: return { repeat: Infinity, duration: 40, ease: "linear" };
    }
  };

  return (
    <motion.div
      className={`absolute pointer-events-none ${className}`}
      animate={getAnimation()}
      transition={getTransition()}
      aria-hidden="true"
    >
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={getPath()} stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        {type === 'star' && (
          <path d="M32 16 L43 21 L48 32 L43 43 L32 48 L21 43 L16 32 L21 21 Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
        )}
        {type === 'lantern' && (
          <>
            <circle cx="32" cy="34" r="6" stroke={color} strokeWidth="1.5"/>
            <path d="M32 28 L32 40 M26 34 L38 34" stroke={color} strokeWidth="1.5"/>
          </>
        )}
      </svg>
    </motion.div>
  );
}
