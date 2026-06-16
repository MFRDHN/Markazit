import { Helmet } from 'react-helmet-async';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';
import { FaBed, FaMosque, FaUtensils, FaUserShield, FaBus } from 'react-icons/fa';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';

export default function KehidupanMadinah() {
  const facilities = [
    {
      title: 'Akomodasi Nyaman',
      desc: 'Asrama santri yang bersih, ber-AC, dan dilengkapi WiFi berkecepatan tinggi untuk mendukung belajar IT.',
      icon: FaBed,
    },
    {
      title: 'Dekat Masjid Nabawi',
      desc: 'Lokasi asrama mudah diakses menuju Masjid Nabawi, memudahkan ibadah harian dan kegiatan halaqah tahfidz.',
      icon: FaMosque,
    },
    {
      title: 'Konsumsi Terjamin',
      desc: 'Makan 3 kali sehari dengan menu makanan bergizi dan sesuai dengan selera Nusantara.',
      icon: FaUtensils,
    },
    {
      title: 'Musyrif Pendamping',
      desc: 'Didampingi oleh musyrif (pembimbing) yang merupakan mahasiswa Universitas Islam Madinah selama 24 jam.',
      icon: FaUserShield,
    },
    {
      title: 'Transportasi & Umrah',
      desc: 'Tersedia transportasi untuk kegiatan belajar dan jadwal umrah rutin bulanan dari Madinah ke Makkah.',
      icon: FaBus,
    }
  ];

  return (
    <>
      <Helmet>
        <title>Kehidupan di Madinah - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Kehidupan di Kota Nabi" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Merasakan nikmatnya ibadah, ketenangan belajar, dan ukhuwah Islamiyah di lingkungan yang penuh berkah.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Daily Life Image Text */}
      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
            <ScrollReveal direction="right">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden relative">
                <div className="absolute inset-0 bg-white animate-pulse" />
                <img 
                  src="https://images.unsplash.com/photo-1565552643983-6592233f21ed?w=800&q=80" 
                  alt="Suasana Madinah" 
                  className="w-full h-full object-cover relative z-10" 
                />
              </div>
            </ScrollReveal>
            <ScrollReveal direction="left">
              <TextReveal text="Rutinitas Harian Santri" className="text-3xl font-bold text-primary-950 mb-6 font-display" />
              <p className="text-primary-700 leading-relaxed mb-4">
                Kehidupan santri Markaz IT dirancang untuk menyeimbangkan kebutuhan spiritual, intelektual, dan sosial. Hari dimulai sebelum subuh dengan persiapan shalat berjamaah di Masjid Nabawi.
              </p>
              <p className="text-primary-700 leading-relaxed mb-6">
                Setelah subuh, santri mengikuti halaqah tahfidz Al-Quran. Pagi hingga siang diisi dengan kelas intensif Bahasa Arab dan IT. Sore hari dimanfaatkan untuk muraja'ah, Dars Masyaikh, dan istirahat.
              </p>
              <div className="bg-white p-6 rounded-2xl border border-cream-200">
                <h3 className="font-bold text-gold-400 mb-2">Jadwal Umrah Rutin</h3>
                <p className="text-sm text-primary-700">Setiap bulan, santri akan difasilitasi untuk melaksanakan ibadah Umrah ke Makkah menggunakan bus ber-AC (perjalanan darat sekitar 4-5 jam dari Madinah).</p>
              </div>
            </ScrollReveal>
          </div>

          {/* Facilities */}
          <ScrollReveal className="text-center mb-16">
            <TextReveal text="Fasilitas Pendukung" className="text-3xl font-bold text-primary-950 mb-4 font-display justify-center" />
            <p className="text-primary-700">Kenyamanan yang menunjang keberhasilan belajar Anda</p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <HoverCard key={index} delay={index * 0.1}>
                <div className="p-8 h-full bg-white text-center flex flex-col items-center group-hover:bg-cream-50 transition-colors duration-300">
                  <div className="w-16 h-16 rounded-2xl bg-cream-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:-translate-y-2 transition-all duration-300 shadow-sm border border-cream-200">
                    <facility.icon className="text-2xl text-primary-500" />
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
