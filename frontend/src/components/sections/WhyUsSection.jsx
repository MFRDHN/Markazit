import { useTranslation } from 'react-i18next';
import { FaMapMarkerAlt, FaBookOpen, FaChalkboardTeacher, FaGraduationCap } from 'react-icons/fa';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';
import IslamicOrnament from '../common/IslamicOrnament';
import { TextReveal } from '../common/TextReveal';
import { HoverCard } from '../common/HoverCard';

export default function WhyUsSection() {
  const { t } = useTranslation();

  const icons = [FaMapMarkerAlt, FaBookOpen, FaChalkboardTeacher, FaGraduationCap];
  const items = t('why_us.items', { returnObjects: true });

  return (
    <section className="py-24 bg-cream-50 relative overflow-hidden">
      {/* Background glow-light */}
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-multiply pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Ornaments */}
      <IslamicOrnament type="star" size={240} className="text-gold-500/10 -top-20 -left-20" />
      <IslamicOrnament type="star" size={180} className="text-primary-500/10 bottom-10 -right-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <TextReveal text={t('why_us.title')} className="section-title mb-4 justify-center" />
          <p className="section-subtitle">{t('why_us.subtitle')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((item, index) => {
            const Icon = icons[index];
            return (
              <HoverCard key={index} delay={index * 0.1}>
                <div className="h-full bg-white p-8 text-center group-hover:bg-cream-50 transition-colors duration-300">
                  <div className="w-16 h-16 mx-auto bg-cream-100 text-primary-500 rounded-2xl flex items-center justify-center mb-6 transform group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-cream-200">
                    <Icon className="text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-950 mb-3 font-display">{item.title}</h3>
                  <p className="text-primary-700 leading-relaxed text-sm">
                    {item.desc}
                  </p>
                </div>
              </HoverCard>
            );
          })}
        </div>
      </div>
    </section>
  );
}
