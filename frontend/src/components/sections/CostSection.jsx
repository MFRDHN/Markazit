import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import IslamicOrnament from '../common/IslamicOrnament';
import { Link } from 'react-router-dom';
import SplitText from '../common/SplitText';
import { HoverCard } from '../common/HoverCard';
import InteractiveBackground from '../common/InteractiveBackground';
import CountUp from '../common/CountUp';

export default function CostSection() {
  const { t } = useTranslation();

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-primary-950 relative overflow-hidden">
      <InteractiveBackground color="rgba(216, 179, 100, 0.12)" lineColor="rgba(216, 179, 100, 0.05)" particleCount={25} />
      <IslamicOrnament type="star" size={250} className="text-primary-500/5 -top-20 -right-20" />
      <IslamicOrnament type="lantern" size={120} className="text-gold-500/10 top-1/2 left-[5%]" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-900/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SplitText
            text={t('cost.title')}
            className="section-title mb-4 justify-center text-white drop-shadow-md"
            tag="h2"
            splitType="chars"
            delay={0.06}
            duration={0.9}
            from={{ opacity: 0, y: -60, rotateX: 90 }}
            to={{ opacity: 1, y: 0, rotateX: 0 }}
          />
          <SplitText
            text={t('cost.subtitle')}
            className="section-subtitle text-cream-100/90 justify-center"
            tag="p"
            splitType="words"
            delay={0.15}
            duration={0.7}
            from={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(4px)' }}
            to={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          />
        </div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -120, rotate: -5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <HoverCard delay={0}>
              <div className="p-8 h-full border-primary-500/30 relative overflow-hidden bg-white">
                <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                  <FaCheck className="text-9xl text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center">
                    <FaCheck size={20} />
                  </span>
                  Biaya Termasuk
                </h3>
                <ul className="space-y-4 relative z-10">
                  {[
                    'Visa',
                    'Asrama full AC & WiFi',
                    'Makan 3x sehari',
                    'Kitab dan modul belajar',
                    'Tiket Pesawat Pergi (Indonesia - Saudi)',
                    'Seragam (Gamis & Jas)',
                    'Biaya pendidikan 1 tahun',
                    'Umrah bulanan dari Madinah'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-black">
                      <FaCheck className="text-gold-400 mt-1 flex-shrink-0" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </HoverCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 120, rotate: 5 }}
            whileInView={{ opacity: 1, x: 0, rotate: 0 }}
            viewport={{ once: false, margin: '-50px' }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <HoverCard delay={0}>
              <div className="p-8 h-full bg-white/5 relative overflow-hidden">
                <h3 className="text-2xl font-bold text-black mb-6 flex items-center gap-3">
                  <span className="w-10 h-10 rounded-full bg-white/10 text-black flex items-center justify-center border border-white/20">
                    <FaTimes size={20} />
                  </span>
                  Belum Termasuk
                </h3>
                <ul className="space-y-4">
                  {[
                    'Pembuatan Paspor',
                    'Keperluan pribadi',
                    'Uang saku bulanan'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-black">
                      <FaTimes className="mt-1 flex-shrink-0 text-black" size={14} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-8 p-6 bg-gold-500/20 rounded-xl border border-gold-500/40 shadow-sm relative z-10">
                  <p className="text-sm text-black mb-2">Total Estimasi Biaya Awal</p>
                  <div className="flex items-baseline gap-2">
                    <CountUp value={47500000} prefix="Rp " className="text-3xl font-bold text-black" />
                  </div>
                </div>
              </div>
            </HoverCard>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, margin: '-50px' }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link to="/biaya" className="inline-flex items-center gap-2 text-gold-400 hover:text-gold-300 font-medium transition-colors">
            Lihat Rincian Biaya Lengkap <span>→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
