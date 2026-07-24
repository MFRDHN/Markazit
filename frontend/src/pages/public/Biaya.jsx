import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { FaCheck, FaTimes, FaQuran } from 'react-icons/fa';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';
import CountUp from '../../components/common/CountUp';

export default function Biaya() {
  const { t } = useTranslation();
  return (
    <>
      <SEOHelmet
        title="pageTitle.biaya"
        description={t('biaya.description')}
        canonicalPath="/biaya"
      />

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('biaya.title')}</h1>
            <TextReveal text={t('biaya.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('biaya.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-cream-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Cost Breakdown */}
          <div className="max-w-4xl mx-auto mb-12 md:mb-16">
            <ScrollReveal direction="up">
              <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden">
                <div className="p-8 md:p-12 text-center bg-gold-50 border-b border-cream-200">
                  <h2 className="text-2xl text-primary-700 font-medium mb-2">{t('biaya.program_title')}</h2>
                  <div className="flex justify-center items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-primary-950">
                      <CountUp value={47500000} prefix="Rp " />
                    </span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-200">
                  {/* Included */}
                  <div className="p-8 md:p-12">
                    <h3 className="text-xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-gold-500/20 text-gold-500 flex items-center justify-center">
                        <FaCheck size={16} />
                      </span>
                      {t('biaya.termasuk')}
                    </h3>
                    <ul className="space-y-4">
                      {t('biaya.termasuk_items', { returnObjects: true }).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-primary-800">
                          <FaCheck className="text-primary-400 mt-1 flex-shrink-0" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div className="p-8 md:p-12 bg-primary-50">
                    <h3 className="text-xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center border border-cream-200">
                        <FaTimes size={16} />
                      </span>
                      {t('biaya.tidak_termasuk')}
                    </h3>
                    <ul className="space-y-4 mb-8">
                      {t('biaya.tidak_termasuk_items', { returnObjects: true }).map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-primary-600">
                          <FaTimes className="mt-1 flex-shrink-0 text-primary-400" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-white rounded-xl p-5 border border-cream-200">
                      <h4 className="font-bold text-primary-950 mb-2">{t('biaya.spp_title')}</h4>
                      <p className="text-primary-700 text-sm">
                        {t('biaya.spp_desc')} <CountUp value={2000000} prefix="Rp " suffix=" / bulan" />.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Beasiswa Hafidz 30 Juz */}
          <ScrollReveal direction="up">
            <div className="max-w-4xl mx-auto mb-12 md:mb-16 bg-gradient-to-r from-gold-600 via-gold-500 to-gold-600 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative z-10">
                <FaQuran className="text-5xl text-white/80 mx-auto mb-4" />
                <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">{t('biaya.beasiswa_title')}</h3>
                <p className="text-gold-50 text-lg mb-8 max-w-2xl mx-auto">{t('biaya.beasiswa_desc')}</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 min-w-[180px]">
                    <p className="text-gold-200 text-sm mb-1">{t('biaya.beasiswa_daftar')}</p>
                    <p className="text-white text-2xl font-bold">{t('biaya.beasiswa_daftar_value')}</p>
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 border border-white/20 min-w-[180px]">
                    <p className="text-gold-200 text-sm mb-1">{t('biaya.beasiswa_spp')}</p>
                    <p className="text-green-300 text-2xl font-bold">{t('biaya.beasiswa_spp_value')}</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* Payment Steps */}
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <TextReveal text={t('biaya.skema_title')} className="text-2xl font-bold text-primary-950 mb-4 justify-center" />
              <p className="text-primary-700">{t('biaya.skema_subtitle')}</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <HoverCard delay={0.1}>
                <div className="p-8 text-center h-full group-hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 bg-gold-50/80 rounded-full flex items-center justify-center text-xl font-bold text-gold-600 mx-auto mb-4 border border-gold-400/20 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">1</div>
                  <h3 className="font-bold text-primary-950 mb-2">{t('biaya.step1_title')}</h3>
                  <p className="text-2xl font-bold text-gold-500 mb-2"><CountUp value={2500000} prefix="Rp " /></p>
                  <p className="text-sm text-primary-600">{t('biaya.step1_desc')}</p>
                </div>
              </HoverCard>
              <HoverCard delay={0.2}>
                <div className="p-8 text-center h-full group-hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center text-xl font-bold text-gold-600 mx-auto mb-4 border border-cream-200 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">2</div>
                  <h3 className="font-bold text-primary-950 mb-2">{t('biaya.step2_title')}</h3>
                  <p className="text-2xl font-bold text-gold-500 mb-2"><CountUp value={20000000} prefix="Rp " /></p>
                  <p className="text-sm text-primary-600">{t('biaya.step2_desc')}</p>
                </div>
              </HoverCard>
              <HoverCard delay={0.3}>
                  <div className="p-8 text-center h-full bg-primary-50 group-hover:bg-primary-100 transition-colors">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center text-xl font-bold text-primary-600 mx-auto mb-4 border border-primary-500/20 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">3</div>
                  <h3 className="font-bold text-primary-950 mb-2">{t('biaya.step3_title')}</h3>
                  <p className="text-2xl font-bold text-primary-500 mb-2"><CountUp value={17500000} prefix="Rp " /></p>
                  <p className="text-sm text-primary-600">{t('biaya.step3_desc')}</p>
                </div>
              </HoverCard>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </>
  );
}
