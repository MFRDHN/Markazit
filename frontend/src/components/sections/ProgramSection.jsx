import { useTranslation } from 'react-i18next';
import { FaBookOpen, FaQuran, FaCode, FaGraduationCap } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import IslamicOrnament from '../common/IslamicOrnament';
import SplitText from '../common/SplitText';
import { HoverCard } from '../common/HoverCard';
import InteractiveBackground from '../common/InteractiveBackground';
import darsImg from '../../assets/WhatsApp Image 2026-05-10 at 16.50.58.jpeg';
import halaqahImg from '../../assets/halaqah.jpeg';
import codingImg from '../../assets/kelas coding.jpeg';
import beasiswaImg from '../../assets/uim.jpg';

const programs = [
  {
    title: 'Dars Masyaikh',
    desc: 'Program kajian intensif langsung bersama para masyaikh (ulama) di Masjid Nabawi dan masjid-masjid sekitar Madinah.',
    icon: FaBookOpen,
    image: darsImg,
    color: 'from-primary-600 to-primary-400',
    bgLight: 'bg-primary-500/10',
    textColor: 'text-primary-400',
  },
  {
    title: 'Halaqah Quran',
    desc: 'Program tahfidz dan tahsin Al-Quran dengan metode talaqqi bersama muhafizh berpengalaman.',
    icon: FaQuran,
    image: halaqahImg,
    color: 'from-gold-600 to-gold-400',
    bgLight: 'bg-gold-500/10',
    textColor: 'text-gold-400',
  },
  {
    title: 'Coding & IoT',
    desc: 'Program teknologi informasi meliputi web development, mobile app, IoT, dan artificial intelligence.',
    icon: FaCode,
    image: codingImg,
    color: 'from-primary-700 to-primary-500',
    bgLight: 'bg-primary-500/10',
    textColor: 'text-primary-400',
  },
  {
    title: 'Bimbingan Beasiswa',
    desc: 'Pendampingan lengkap untuk mendaftar beasiswa di Universitas Islam Madinah dan universitas lainnya.',
    icon: FaGraduationCap,
    image: beasiswaImg,
    color: 'from-gold-700 to-gold-500',
    bgLight: 'bg-gold-500/10',
    textColor: 'text-gold-400',
  }
];

export default function ProgramSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream-50 relative overflow-hidden">
      <InteractiveBackground />
      <IslamicOrnament type="lantern" size={120} className="text-primary-500/5 top-20 right-10" />
      <IslamicOrnament type="crescent" size={200} className="text-gold-500/5 bottom-20 -left-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SplitText
            text={t('programs.title')}
            className="section-title mb-4 justify-center"
            tag="h2"
            splitType="chars"
            delay={0.05}
          />
          <SplitText
            text={t('programs.subtitle')}
            className="section-subtitle justify-center"
            tag="p"
            splitType="words"
            delay={0.12}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {programs.map((program, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.08 }}
            >
              <HoverCard delay={0}>
                <div className="h-full bg-cream-50 p-8 sm:p-10 relative overflow-hidden group-hover:bg-white transition-colors">
                  <IslamicOrnament type="star" size={150} className={`${program.textColor} opacity-5 group-hover:opacity-10 transition-opacity -right-10 -bottom-10`} />
                  <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${program.color} rounded-full blur-[100px] opacity-10 group-hover:opacity-20 transition-opacity duration-500`} />
                  
                  <div className="relative z-10 flex flex-col sm:flex-row gap-6 items-start">
                    <div className="w-full sm:w-32 h-24 rounded-xl overflow-hidden shrink-0">
                      <img src={program.image} alt={program.title} className="w-full h-full object-cover" loading="lazy" />
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
