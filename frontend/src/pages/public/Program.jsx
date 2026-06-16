import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaBookOpen, FaQuran, FaCode, FaGraduationCap, FaCheck } from 'react-icons/fa';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { TextReveal } from '../../components/common/TextReveal';

export default function Program() {
  const { t } = useTranslation();

  const programs = [
    {
      id: 'dars-masyaikh',
      title: 'Dars Masyaikh',
      desc: 'Program kajian intensif langsung bersama para masyaikh (ulama) di Masjid Nabawi dan masjid-masjid sekitar Madinah. Pelajari ilmu syar\'i dari sumber terpercaya dengan metode tradisional yang telah teruji.',
      icon: FaBookOpen,
      features: ['Kajian Kitab Tauhid', 'Fiqih Sunnah', 'Siroh Nabawiyah', 'Tafsir Al-Quran'],
      color: 'from-blue-600 to-blue-400',
    },
    {
      id: 'halaqah tahfidz-quran',
      title: 'Halaqah Tahfidz',
      desc: 'Program tahfidz dan tahsin Al-Quran dengan metode talaqqi bersama muhafizh berpengalaman. Target hafalan minimal 5 juz per tahun dengan sanad yang bersambung.',
      icon: FaQuran,
      features: ['Tahsin Makharijul Huruf', 'Tahfidz 5 Juz / Tahun', 'Sertifikasi Sanad', 'Tajwid Aplikatif'],
      color: 'from-gold-600 to-gold-400',
    },
    {
      id: 'coding-iot',
      title: 'Coding & IoT',
      desc: 'Program teknologi informasi meliputi web development, mobile app, IoT (Internet of Things), dan artificial intelligence. Belajar coding sambil mendalami ilmu agama di kota Nabi ﷺ.',
      icon: FaCode,
      features: ['Fullstack Web (React/Laravel)', 'Mobile App (Flutter)', 'IoT & Robotika Dasar', 'Persiapan Portofolio'],
      color: 'from-primary-600 to-primary-400',
    },
    {
      id: 'bimbingan-beasiswa',
      title: 'Bimbingan Beasiswa',
      desc: 'Pendampingan lengkap untuk mendaftar beasiswa di Universitas Islam Madinah dan universitas lainnya di Arab Saudi. Termasuk persiapan bahasa Arab, berkas, dan wawancara.',
      icon: FaGraduationCap,
      features: ['Persiapan Bahasa Arab (TOAFL)', 'Pemberkasan Terjemah Tersumpah', 'Simulasi Wawancara', 'Info Kampus Saudi'],
      color: 'from-purple-600 to-purple-400',
    }
  ];

  return (
    <>
      <Helmet>
        <title>Program Studi - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Program Pembelajaran" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Kurikulum terpadu yang menggabungkan kemuliaan ilmu syar'i dan keunggulan teknologi informasi.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Program Details */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">
          {programs.map((program, index) => (
            <ScrollReveal key={program.id} direction={index % 2 === 0 ? 'left' : 'right'}>
              <div id={program.id} className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${program.color} flex items-center justify-center mb-6 shadow-lg`}>
                    <program.icon className="text-3xl text-primary-950" />
                  </div>
                  <h2 className="text-3xl font-bold text-primary-950 mb-4 font-display">{program.title}</h2>
                  <p className="text-primary-700 leading-relaxed mb-8">
                    {program.desc}
                  </p>
                  
                  <h3 className="text-lg font-bold text-primary-950 mb-4">Fokus Materi:</h3>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {program.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-white flex items-center justify-center mt-0.5 shrink-0">
                          <FaCheck className="text-primary-400" size={10} />
                        </div>
                        <span className="text-primary-800 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`relative ${index % 2 === 1 ? 'md:order-1' : ''}`}>
                  <div className="aspect-square rounded-3xl bg-white border border-cream-200 overflow-hidden relative">
                    <div className="absolute inset-0 bg-cream-100 animate-pulse" />
                    {/* Placeholder image representation */}
                    <div className={`absolute inset-0 opacity-20 bg-gradient-to-br ${program.color}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <program.icon className="text-9xl text-primary-950/10" />
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  );
}
