import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';
import { FaBed, FaMosque, FaUtensils, FaUserShield, FaBus } from 'react-icons/fa';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';
import kehidupanMadinahImg from '../../assets/kehidupan madinah.jpg';

export default function KehidupanMadinah() {
  const { t } = useTranslation();
  const [imageLoaded, setImageLoaded] = useState(false);
  const facilityData = t('kehidupan.fasilitas', { returnObjects: true });
  const facilityIcons = [FaBed, FaMosque, FaUtensils, FaUserShield, FaBus];
  const facilities = facilityData.map((item, i) => ({ ...item, icon: facilityIcons[i] || FaBed }));

  return (
    <>
      <SEOHelmet
        title="pageTitle.kehidupanMadinah"
        description={t('kehidupan.description')}
        canonicalPath="/kehidupan-madinah"
      />

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('kehidupan.title')}</h1>
            <TextReveal text={t('kehidupan.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('kehidupan.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Daily Life Image Text */}
      <section className="py-16 md:py-20 lg:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="right">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden relative">
                <div className={`absolute inset-0 bg-white animate-pulse ${imageLoaded ? 'opacity-0' : ''}`} />
                <img 
                  src={kehidupanMadinahImg}
                  alt={t('kehidupan.alt_image')} 
                  className="w-full h-full object-cover relative z-10" 
                  loading="lazy"
                  onLoad={() => setImageLoaded(true)}
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <TextReveal text={t('kehidupan.rutinitas_title')} className="text-3xl font-bold text-primary-950 mb-6 font-display" />
              <p className="text-primary-700 leading-relaxed mb-4">
                {t('kehidupan.paragraf_1')}
              </p>
              <p className="text-primary-700 leading-relaxed mb-6">
                {t('kehidupan.paragraf_2')}
              </p>
              <div className="bg-white p-6 rounded-2xl border border-cream-200">
                <h3 className="font-bold text-gold-400 mb-2">{t('kehidupan.umrah_title')}</h3>
                <p className="text-sm text-primary-700">{t('kehidupan.umrah_desc')}</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Facilities */}
          <ScrollReveal className="text-center mb-16">
            <TextReveal text={t('kehidupan.fasilitas_title')} className="text-3xl font-bold text-primary-950 mb-4 font-display justify-center" />
            <p className="text-primary-700">{t('kehidupan.fasilitas_subtitle')}</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <HoverCard key={index} delay={index * 0.1}>
                <div className="p-8 h-full bg-white text-center flex flex-col items-center group-hover:bg-cream-50 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-gold-50/80 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-gold-400/20">
                    <facility.icon className="text-2xl text-gold-600" />
                  </div>
                  <h3 className="text-xl font-bold text-primary-950 mb-3">{facility.title}</h3>
                  <p className="text-primary-700 text-sm leading-relaxed">{facility.desc}</p>
                </div>
              </HoverCard>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
