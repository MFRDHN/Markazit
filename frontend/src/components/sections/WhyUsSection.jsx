import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaBookOpen, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import IslamicOrnament from '../common/IslamicOrnament';
import SplitText from '../common/SplitText';
import { HoverCard } from '../common/HoverCard';
import InteractiveBackground from '../common/InteractiveBackground';

const cardAnim = [
  { initial: { opacity: 0, x: -80, scale: 0.9 }, enter: { opacity: 1, x: 0, scale: 1 }, exit: { opacity: 0, x: -80, scale: 0.9 } },
  { initial: { opacity: 0, y: 80, rotate: -5 }, enter: { opacity: 1, y: 0, rotate: 0 }, exit: { opacity: 0, y: 80, rotate: -5 } },
  { initial: { opacity: 0, scale: 0.5, filter: 'blur(6px)' }, enter: { opacity: 1, scale: 1, filter: 'blur(0px)' }, exit: { opacity: 0, scale: 0.5, filter: 'blur(6px)' } },
  { initial: { opacity: 0, x: 80, skewY: 4 }, enter: { opacity: 1, x: 0, skewY: 0 }, exit: { opacity: 0, x: 80, skewY: 4 } },
];

export default function WhyUsSection() {
  const { t } = useTranslation();

  const icons = [FaMapMarkerAlt, FaBookOpen, FaChalkboardTeacher, FaGraduationCap];
  const items = t('why_us.items', { returnObjects: true });

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream-50 relative overflow-hidden">
      <InteractiveBackground />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[120px] pointer-events-none" />

      <IslamicOrnament type="star" size={240} className="text-gold-500/10 -top-20 -left-20" />
      <IslamicOrnament type="star" size={180} className="text-primary-500/10 bottom-10 -right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SplitText
            text={t('why_us.title')}
            className="section-title mb-4 justify-center"
            tag="h2"
            splitType="chars"
            delay={0.04}
            duration={0.8}
            from={{ opacity: 0, y: 40, rotateX: -90 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />
          <SplitText
            text={t('why_us.subtitle')}
            className="section-subtitle justify-center"
            tag="p"
            splitType="words"
            delay={0.1}
            duration={0.6}
            from={{ opacity: 0, y: 30 }}
            to={{ opacity: 1, y: 0 }}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = icons[index];
            const anim = cardAnim[index];
            return (
              <motion.div
                key={index}
                initial={anim.initial}
                whileInView={anim.enter}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <HoverCard delay={0}>
                  <div className="h-full bg-white p-8 text-center group-hover:bg-cream-50 transition-colors duration-300">
                    <div className="w-16 h-16 mx-auto bg-gold-50/80 text-gold-600 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-gold-400/20">
                      <Icon className="text-2xl" />
                    </div>
                    <h3 className="text-xl font-bold text-primary-950 mb-3 font-display">{item.title}</h3>
                    <p className="text-primary-600 leading-relaxed text-sm">
                      {item.desc}
                    </p>
                  </div>
                </HoverCard>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
