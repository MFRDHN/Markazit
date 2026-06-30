import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import SplitText from '../common/SplitText';
import { HoverCard } from '../common/HoverCard';
import InteractiveBackground from '../common/InteractiveBackground';

const timeline = [
  { month: 'Bulan 1-3', title: 'Adaptasi & Tahsin', desc: 'Penyesuaian lingkungan, kelas bahasa Arab dasar, dan tahsin makharijul huruf.', anim: { initial: { opacity: 0, x: -100 }, enter: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -100 } } },
  { month: 'Bulan 4-6', title: 'Intensif IT & Halaqah', desc: 'Mulai kelas web development dan rutinitas halaqah tahfidz quran di Masjid Nabawi.', anim: { initial: { opacity: 0, y: 80, rotate: -5 }, enter: { opacity: 1, y: 0, rotate: 0 }, exit: { opacity: 0, y: 80, rotate: -5 } } },
  { month: 'Bulan 7-9', title: 'Dars Masyaikh & Proyek IT', desc: 'Mengikuti kajian kitab para ulama dan membangun aplikasi portofolio.', anim: { initial: { opacity: 0, scale: 0.6, filter: 'blur(4px)' }, enter: { opacity: 1, scale: 1, filter: 'blur(0px)' }, exit: { opacity: 0, scale: 0.6, filter: 'blur(4px)' } } },
  { month: 'Bulan 10-12', title: 'Persiapan Beasiswa & Sertifikasi', desc: 'Pemberkasan pendaftaran UIM, sertifikasi IT, dan ujian akhir hafalan.', anim: { initial: { opacity: 0, x: 100 }, enter: { opacity: 1, x: 0 }, exit: { opacity: 0, x: 100 } } },
];

export default function TimelineSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream-50 relative overflow-hidden">
      <InteractiveBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <SplitText
            text={t('timeline.title')}
            className="section-title mb-4 justify-center"
            tag="h2"
            splitType="chars"
            delay={0.06}
            duration={1.0}
            from={{ opacity: 0, x: -60, rotate: -15 }}
            to={{ opacity: 1, x: 0, rotate: 0 }}
          />
          <SplitText
            text={t('timeline.subtitle')}
            className="section-subtitle justify-center"
            tag="p"
            splitType="words"
            delay={0.15}
            duration={0.5}
            from={{ opacity: 0, x: 40 }}
            to={{ opacity: 1, x: 0 }}
          />
        </div>

        <div className="relative">
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-primary-500 to-gold-400 opacity-30" />
          </div>

          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-white rounded-full">
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary-500 to-gold-400 opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {timeline.map((item, index) => (
              <motion.div
                key={index}
                initial={item.anim.initial}
                whileInView={item.anim.enter}
                viewport={{ once: false, margin: '-50px' }}
                transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative flex md:flex-col items-start md:items-center gap-6 md:gap-8"
              >
                <div className="md:hidden mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-gold-500 border-4 border-gold-50/50 relative z-10" />
                
                <HoverCard delay={0} className="w-full">
                  <div className="bg-white p-6 h-full w-full md:text-center relative">
                    <div className="hidden md:block absolute -bottom-[66px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gold-500 border-4 border-gold-50/50 z-10 shadow-[0_0_15px_rgba(216,179,100,0.5)]" />
                    
                    <span className="inline-block px-3 py-1 bg-gold-500/10 text-gold-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                      {item.month}
                    </span>
                    <h3 className="text-lg font-bold text-primary-950 mb-2">{item.title}</h3>
                    <p className="text-primary-700 text-sm">{item.desc}</p>
                  </div>
                </HoverCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
