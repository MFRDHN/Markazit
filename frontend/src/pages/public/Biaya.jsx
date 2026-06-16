import { Helmet } from 'react-helmet-async';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import { FaCheck, FaTimes, FaInfoCircle } from 'react-icons/fa';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';

export default function Biaya() {
  return (
    <>
      <Helmet>
        <title>Rincian Biaya - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Investasi Pendidikan" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Biaya transparan tanpa biaya tersembunyi. Investasi terbaik untuk masa depan dunia dan akhirat Anda.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-cream-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Main Cost Breakdown */}
          <div className="max-w-4xl mx-auto mb-24">
            <ScrollReveal direction="up">
              <div className="bg-white rounded-3xl border border-cream-200 overflow-hidden">
                <div className="p-8 md:p-12 text-center bg-cream-50 border-b border-cream-200">
                  <h2 className="text-2xl text-primary-700 font-medium mb-2">Biaya Program 1 Tahun</h2>
                  <div className="flex justify-center items-baseline gap-2 mb-4">
                    <span className="text-5xl font-bold text-primary-950">Rp 45.000.000</span>
                  </div>
                  <p className="text-sm text-primary-600 flex items-center justify-center gap-2">
                    <FaInfoCircle />
                    Dapat dicicil 3x sebelum keberangkatan
                  </p>
                </div>

                <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-cream-200">
                  {/* Included */}
                  <div className="p-8 md:p-12">
                    <h3 className="text-xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-primary-500/20 text-primary-400 flex items-center justify-center">
                        <FaCheck size={16} />
                      </span>
                      Biaya Termasuk
                    </h3>
                    <ul className="space-y-4">
                      {[
                        'Visa pelajar / ziarah (1 tahun)',
                        'Asrama full AC & WiFi',
                        'Makan 3x sehari',
                        'Kitab dan modul belajar IT',
                        'Seragam (Gamis & Jas Almamater)',
                        'Biaya pendidikan 1 tahun',
                        'Umrah bulanan dari Madinah',
                        'Transportasi lokal untuk kajian',
                        'Bimbingan pendaftaran kampus'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-primary-800">
                          <FaCheck className="text-primary-400 mt-1 flex-shrink-0" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Excluded */}
                  <div className="p-8 md:p-12 bg-cream-50/30">
                    <h3 className="text-xl font-bold text-primary-950 mb-6 flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-white text-primary-600 flex items-center justify-center border border-cream-200">
                        <FaTimes size={16} />
                      </span>
                      Belum Termasuk
                    </h3>
                    <ul className="space-y-4 mb-8">
                      {[
                        'Tiket Pesawat PP (Indonesia - Saudi)',
                        'Pembuatan Paspor',
                        'Keperluan mandi dan cuci pakaian',
                        'Uang saku bulanan pribadi',
                        'Asuransi kesehatan (opsional)'
                      ].map((item, index) => (
                        <li key={index} className="flex items-start gap-3 text-primary-600">
                          <FaTimes className="mt-1 flex-shrink-0" size={14} />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="bg-white rounded-xl p-5 border border-cream-200">
                      <h4 className="font-bold text-primary-950 mb-2">Estimasi SPP Bulanan (Opsional)</h4>
                      <p className="text-primary-700 text-sm">
                        Beberapa layanan ekstra (laundry khusus, suplemen makanan) dikenakan biaya tambahan Rp 1.500.000 / bulan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Payment Steps */}
          <ScrollReveal direction="up">
            <div className="text-center mb-12">
              <TextReveal text="Skema Pembayaran" className="text-2xl font-bold text-primary-950 mb-4 justify-center" />
              <p className="text-primary-700">Tahapan pembayaran untuk kemudahan Anda</p>
            </div>
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              <HoverCard delay={0.1}>
                <div className="p-8 text-center h-full group-hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center text-xl font-bold text-primary-500 mx-auto mb-4 border border-cream-200 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">1</div>
                  <h3 className="font-bold text-primary-950 mb-2">Uang Pendaftaran</h3>
                  <p className="text-2xl font-bold text-gold-500 mb-2">Rp 2.500.000</p>
                  <p className="text-sm text-primary-600">Dibayarkan saat formulir disetujui (DP & Booking Seat)</p>
                </div>
              </HoverCard>
              <HoverCard delay={0.2}>
                <div className="p-8 text-center h-full group-hover:bg-cream-50 transition-colors">
                  <div className="w-12 h-12 bg-cream-100 rounded-full flex items-center justify-center text-xl font-bold text-primary-500 mx-auto mb-4 border border-cream-200 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">2</div>
                  <h3 className="font-bold text-primary-950 mb-2">Tahap Pengurusan Visa</h3>
                  <p className="text-2xl font-bold text-gold-500 mb-2">Rp 20.000.000</p>
                  <p className="text-sm text-primary-600">Dibayarkan 2 bulan sebelum keberangkatan</p>
                </div>
              </HoverCard>
              <HoverCard delay={0.3}>
                <div className="p-8 text-center h-full bg-primary-50/50 group-hover:bg-primary-50 transition-colors">
                  <div className="w-12 h-12 bg-primary-500/10 rounded-full flex items-center justify-center text-xl font-bold text-primary-500 mx-auto mb-4 border border-primary-500/20 shadow-sm group-hover:scale-110 group-hover:-translate-y-1 transition-all">3</div>
                  <h3 className="font-bold text-primary-950 mb-2">Pelunasan</h3>
                  <p className="text-2xl font-bold text-primary-500 mb-2">Rp 17.500.000</p>
                  <p className="text-sm text-primary-600">Maksimal 2 minggu sebelum jadwal penerbangan</p>
                </div>
              </HoverCard>
            </div>
          </ScrollReveal>

        </div>
      </section>
    </>
  );
}
