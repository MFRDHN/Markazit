import { useTranslation } from 'react-i18next';
import { ScrollReveal } from '../common/ScrollReveal';
import { TextReveal } from '../common/TextReveal';
import { HoverCard } from '../common/HoverCard';

export default function TimelineSection() {
  const { t } = useTranslation();

  const timeline = [
    { month: 'Bulan 1-3', title: 'Adaptasi & Tahsin', desc: 'Penyesuaian lingkungan, kelas bahasa Arab dasar, dan tahsin makharijul huruf.' },
    { month: 'Bulan 4-6', title: 'Intensif IT & Halaqah', desc: 'Mulai kelas web development dan rutinitas halaqah tahfidz quran di Masjid Nabawi.' },
    { month: 'Bulan 7-9', title: 'Dars Masyaikh & Proyek IT', desc: 'Mengikuti kajian kitab para ulama dan membangun aplikasi portofolio.' },
    { month: 'Bulan 10-12', title: 'Persiapan Beasiswa & Sertifikasi', desc: 'Pemberkasan pendaftaran UIM, sertifikasi IT, dan ujian akhir hafalan.' }
  ];

  return (
    <section className="py-24 bg-cream-50 border-y border-primary-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ScrollReveal className="text-center mb-20">
          <TextReveal text={t('timeline.title')} className="section-title mb-4 justify-center" />
          <p className="section-subtitle">{t('timeline.subtitle')}</p>
        </ScrollReveal>

        <div className="relative">
          {/* Horizontal Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2 rounded-full overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-full bg-gradient-to-r from-primary-500 to-gold-400 opacity-30" />
          </div>

          {/* Vertical Line (Mobile) */}
          <div className="md:hidden absolute top-0 bottom-0 left-8 w-1 bg-white rounded-full">
            <div className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-primary-500 to-gold-400 opacity-30" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {timeline.map((item, index) => (
              <div key={index} className="relative flex md:flex-col items-start md:items-center gap-6 md:gap-8">
                {/* Mobile Dot */}
                <div className="md:hidden mt-1.5 flex-shrink-0 w-5 h-5 rounded-full bg-primary-500 border-4 border-cream-50 relative z-10" />
                
                <HoverCard delay={index * 0.1} className="w-full">
                  <div className="bg-white p-6 h-full w-full md:text-center relative">
                    {/* Desktop Dot */}
                    <div className="hidden md:block absolute -bottom-[66px] left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-primary-500 border-4 border-cream-50 z-10 shadow-[0_0_15px_rgba(45,138,78,0.5)]" />
                    
                    <span className="inline-block px-3 py-1 bg-primary-500/10 text-primary-600 text-xs font-bold uppercase tracking-wider rounded-lg mb-4">
                      {item.month}
                    </span>
                    <h3 className="text-lg font-bold text-primary-950 mb-2">{item.title}</h3>
                    <p className="text-primary-700 text-sm">{item.desc}</p>
                  </div>
                </HoverCard>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
