import { Helmet } from 'react-helmet-async';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { FaUserTie, FaBuilding, FaGlobe } from 'react-icons/fa';
import { TextReveal } from '../../components/common/TextReveal';

export default function TentangKami() {

  return (
    <>
      <Helmet>
        <title>Tentang Kami - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Tentang Markaz IT" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Membangun peradaban dengan mengintegrasikan nilai-nilai keislaman dan inovasi teknologi terkini.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Visi Misi */}
          <div className="grid md:grid-cols-2 gap-12 mb-32">
            <ScrollReveal direction="right" className="glass-card p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaGlobe className="text-9xl text-primary-500" />
              </div>
              <TextReveal text="Visi Kami" className="text-2xl font-bold text-primary-950 mb-6 font-display border-b border-cream-200 pb-4" />
              <p className="text-primary-700 leading-relaxed text-lg relative z-10">
                Menjadi pusat keunggulan pendidikan terpadu di Kota Madinah yang melahirkan generasi Muslim berilmu syar'i mendalam, berakhlak mulia, dan menguasai teknologi informasi global.
              </p>
            </ScrollReveal>

            <ScrollReveal direction="left" className="glass-card p-10 relative overflow-hidden border-primary-500/30">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <FaBuilding className="text-9xl text-primary-500" />
              </div>
              <TextReveal text="Misi Kami" className="text-2xl font-bold text-primary-950 mb-6 font-display border-b border-cream-200 pb-4" />
              <ul className="space-y-4 text-primary-700 relative z-10">
                <li className="flex gap-3"><span className="text-primary-500 font-bold">1.</span> Menyelenggarakan pendidikan tahfidz Al-Quran bersanad.</li>
                <li className="flex gap-3"><span className="text-primary-500 font-bold">2.</span> Menyediakan kajian kitab turats langsung dari sumber aslinya.</li>
                <li className="flex gap-3"><span className="text-primary-500 font-bold">3.</span> Melatih keterampilan coding, web development, dan IoT terkini.</li>
                <li className="flex gap-3"><span className="text-primary-500 font-bold">4.</span> Membimbing santri untuk melanjutkan studi ke Universitas Islam Madinah.</li>
              </ul>
            </ScrollReveal>
          </div>

        </div>
      </section>
    </>
  );
}
