import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { ScrollReveal } from '../common/ScrollReveal';
import SplitText from '../common/SplitText';
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
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mt-16">
        <ScrollReveal direction="up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border-white/20 text-primary-950 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-gold-400 animate-pulse" />
            Pendaftaran Gelombang 1 Dibuka
          </div>
        </ScrollReveal>

        <div className="mb-6">
          <SplitText
            text={t('hero.tagline')}
            className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white leading-tight text-balance drop-shadow-md justify-center"
            tag="h1"
            splitType="words"
            delay={0.08}
          />
        </div>

        <ScrollReveal direction="up" delay={0.4}>
          <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-3xl mx-auto text-balance leading-relaxed drop-shadow-sm">
            {t('hero.subtitle')}
          </p>
        </ScrollReveal>

        <ScrollReveal direction="up" delay={0.6}>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/pendaftaran" className="btn-primary w-full sm:w-auto text-lg">
              {t('hero.cta_register')}
            </Link>

          </div>
        </ScrollReveal>
      </div>

    </section>
  );
}
