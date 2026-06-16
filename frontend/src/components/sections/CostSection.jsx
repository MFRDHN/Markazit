import { useTranslation } from 'react-i18next';
import { FaCheck, FaTimes } from 'react-icons/fa';
import { ScrollReveal } from '../common/ScrollReveal';
import IslamicOrnament from '../common/IslamicOrnament';
import { Link } from 'react-router-dom';
import { TextReveal } from '../common/TextReveal';
import { HoverCard } from '../common/HoverCard';

export default function CostSection() {
  const { t } = useTranslation();

  return (
    <section className="py-24 bg-primary-950 border-t border-primary-900/10 relative overflow-hidden">
      {/* Decorative blobs & ornaments */}
      <IslamicOrnament type="star" size={250} className="text-primary-500/5 -top-20 -right-20" />
      <IslamicOrnament type="lantern" size={120} className="text-gold-500/10 top-1/2 left-[5%]" />
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-800/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-900/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <TextReveal text={t('cost.title')} className="section-title mb-4 justify-center text-white drop-shadow-md" />
          <p className="section-subtitle text-cream-100/90">{t('cost.subtitle')}</p>
        </ScrollReveal>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Included Card */}
          <HoverCard delay={0.1}>
            <div className="p-8 h-full border-primary-500/30 relative overflow-hidden bg-white">
              <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                <FaCheck className="text-9xl text-primary-500" />
              </div>
              <h3 className="text-2xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center">
                  <FaCheck size={20} />
                </span>
                Biaya Termasuk
              </h3>
              <ul className="space-y-4 relative z-10">
                {[
                  'Visa pelajar / ziarah (1 tahun)',
                  'Asrama full AC & WiFi',
                  'Makan 3x sehari',
                  'Kitab dan modul belajar',
                  'Seragam (Gamis & Jas)',
                  'Biaya pendidikan 1 tahun',
                  'Umrah bulanan dari Madinah'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-primary-800">
                    <FaCheck className="text-primary-400 mt-1 flex-shrink-0" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </HoverCard>

          {/* Excluded Card */}
          <HoverCard delay={0.2}>
            <div className="p-8 h-full bg-cream-50/50 relative overflow-hidden">
              <h3 className="text-2xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full bg-white text-primary-600 flex items-center justify-center border border-cream-200">
                  <FaTimes size={20} />
                </span>
                Belum Termasuk
              </h3>
              <ul className="space-y-4">
                {[
                  'Tiket Pesawat PP (Indonesia - Saudi)',
                  'Pembuatan Paspor',
                  'Keperluan pribadi',
                  'Uang saku bulanan'
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3 text-primary-600">
                    <FaTimes className="mt-1 flex-shrink-0" size={14} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 p-6 bg-white rounded-xl border border-cream-200 shadow-sm relative z-10">
                <p className="text-sm text-primary-700 mb-2">Total Estimasi Biaya Awal</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-primary-950">Rp 45.000.000</span>
                </div>
                <p className="text-xs text-primary-600 mt-2">*Dapat dicicil 3x sebelum keberangkatan</p>
              </div>
            </div>
          </HoverCard>
        </div>

        <ScrollReveal className="text-center mt-12">
          <Link to="/biaya" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-medium transition-colors">
            Lihat Rincian Biaya Lengkap <span>→</span>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}
