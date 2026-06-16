import { useTranslation } from 'react-i18next';
import { FaCode, FaQuran, FaBookOpen, FaGraduationCap } from 'react-icons/fa';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';
import { Link } from 'react-router-dom';
import IslamicOrnament from '../common/IslamicOrnament';
import { TextReveal } from '../common/TextReveal';
import { HoverCard } from '../common/HoverCard';

export default function ProgramSection() {
  const { t } = useTranslation();

  const programs = [
    {
      title: 'Dars Masyaikh',
      desc: 'Program kajian intensif langsung bersama para masyaikh (ulama) di Masjid Nabawi dan masjid-masjid sekitar Madinah.',
      icon: FaBookOpen,
      color: 'from-blue-600 to-blue-400',
      bgLight: 'bg-blue-500/10',
      textColor: 'text-blue-400'
    },
    {
      title: 'Halaqah Quran',
      desc: 'Program tahfidz dan tahsin Al-Quran dengan metode talaqqi bersama muhafizh berpengalaman.',
      icon: FaQuran,
      color: 'from-gold-600 to-gold-400',
      bgLight: 'bg-gold-500/10',
      textColor: 'text-gold-400'
    },
    {
      title: 'Coding & IoT',
      desc: 'Program teknologi informasi meliputi web development, mobile app, IoT, dan artificial intelligence.',
      icon: FaCode,
      color: 'from-primary-600 to-primary-400',
      bgLight: 'bg-primary-500/10',
      textColor: 'text-primary-400'
    },
    {
      title: 'Bimbingan Beasiswa',
      desc: 'Pendampingan lengkap untuk mendaftar beasiswa di Universitas Islam Madinah dan universitas lainnya.',
      icon: FaGraduationCap,
      color: 'from-purple-600 to-purple-400',
      bgLight: 'bg-purple-500/10',
      textColor: 'text-purple-400'
    }
  ];

  return (
    <section className="py-24 bg-cream-100 relative overflow-hidden">
      {/* Background Ornaments */}
      <IslamicOrnament type="lantern" size={120} className="text-primary-500/5 top-20 right-10" />
      <IslamicOrnament type="crescent" size={200} className="text-gold-500/5 bottom-20 -left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <TextReveal text={t('programs.title')} className="section-title mb-4 justify-center" />
          <p className="section-subtitle">{t('programs.subtitle')}</p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <HoverCard key={index} delay={index * 0.1}>
              <div className="h-full bg-cream-50 p-8 sm:p-10 relative overflow-hidden group-hover:bg-white transition-colors">
                {/* Decorative Background */}
                <IslamicOrnament type="star" size={150} className={`${program.textColor} opacity-5 group-hover:opacity-10 transition-opacity -right-10 -bottom-10`} />
                <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${program.color} rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                
                <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                  <div className={`w-16 h-16 rounded-2xl ${program.bgLight} flex items-center justify-center shrink-0`}>
                    <program.icon className={`text-3xl ${program.textColor}`} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary-950 mb-3 font-display">{program.title}</h3>
                    <p className="text-primary-700 leading-relaxed mb-6">{program.desc}</p>
                    <Link to="/program" className={`inline-flex items-center gap-2 font-medium ${program.textColor} hover:opacity-80 transition-opacity`}>
                      Detail Program <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            </HoverCard>
          ))}
        </div>
      </div>
    </section>
  );
}
