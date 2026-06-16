import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

import { ScrollReveal } from '../common/ScrollReveal';
import { TextReveal } from '../common/TextReveal';
import masjidNabawiVideo from '../../assets/masjid_nabawi.mp4';

export default function HeroSection() {
  const { t } = useTranslation();

  return (
    <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full bg-black overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src={masjidNabawiVideo} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-islamic-pattern opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
        <ScrollReveal direction="up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/20 text-green-600 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Pendaftaran Gelombang 1 Dibuka
          </div>
        </ScrollReveal>

        <div className="mb-6">
          <TextReveal 
            text={t('hero.tagline')} 
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight text-balance justify-center drop-shadow-md" 
          />
        </div>

        <ScrollReveal direction="up" delay={0.4}>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto text-balance leading-relaxed drop-shadow-sm">
            {t('hero.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pendaftaran" className="btn-primary w-full sm:w-auto text-lg group">
              <span className="flex items-center justify-center gap-2">
                {t('hero.cta_register')}
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  →
                </motion.span>
              </span>
            </Link>

          </div>
        </ScrollReveal>
      </div>

      {/* Decorative Elements Removed */}

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 border-2 border-primary-900/30 rounded-full flex justify-center p-1">
          <div className="w-1.5 h-1.5 bg-primary-900 rounded-full" />
        </div>
      </motion.div>
    </section>
  );
}
