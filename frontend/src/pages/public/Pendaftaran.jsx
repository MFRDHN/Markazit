import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaCheckCircle, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import { TextReveal } from '../../components/common/TextReveal';
import { ScrollReveal } from '../../components/common/ScrollReveal';

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

const schema = z.object({
  nama: z.string().min(3, 'Nama lengkap minimal 3 karakter'),
  usia: z.string().refine((val) => !isNaN(val) && parseInt(val) >= 15 && parseInt(val) <= 45, { message: 'Usia harus antara 15-45 tahun' }),
  no_hp: z.string().min(10, 'Nomor HP tidak valid'),
  email: z.string().email('Format email tidak valid'),
  motivasi: z.string().min(20, 'Ceritakan motivasi Anda minimal 20 karakter'),
  // File validation can be complex in react-hook-form, using basic required check here for simplicity in UI, strict check in backend
  dokumen_ktp: z.any().refine((files) => files?.length === 1, 'KTP wajib diunggah.'),
  dokumen_kk: z.any().refine((files) => files?.length === 1, 'KK wajib diunggah.'),
  dokumen_paspor: z.any().optional(),
  foto: z.any().refine((files) => files?.length === 1, 'Pas foto wajib diunggah.'),
});

export default function Pendaftaran() {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { register, handleSubmit, trigger, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    mode: 'onTouched',
  });

  const nextStep = async () => {
    const fieldsToValidate = step === 1 
      ? ['nama', 'usia', 'no_hp', 'email'] 
      : step === 2 
      ? ['dokumen_ktp', 'dokumen_kk', 'foto'] 
      : ['motivasi'];
      
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setStep((prev) => prev + 1);
  };

  const prevStep = () => setStep((prev) => prev - 1);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      const formData = new FormData();
      formData.append('nama', data.nama);
      formData.append('usia', data.usia);
      formData.append('no_hp', data.no_hp);
      formData.append('email', data.email);
      formData.append('motivasi', data.motivasi);
      
      if (data.dokumen_ktp[0]) formData.append('dokumen_ktp', data.dokumen_ktp[0]);
      if (data.dokumen_kk[0]) formData.append('dokumen_kk', data.dokumen_kk[0]);
      if (data.foto[0]) formData.append('foto', data.foto[0]);
      if (data.dokumen_paspor && data.dokumen_paspor[0]) {
        formData.append('dokumen_paspor', data.dokumen_paspor[0]);
      }

      await api.post('/applicants', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setIsSuccess(true);
    } catch (error) {
      alert('Terjadi kesalahan saat mengirim data. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50">
        <div className="glass-card p-12 text-center max-w-lg mx-4">
          <FaCheckCircle className="text-6xl text-primary-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-950 mb-4">Pendaftaran Berhasil!</h2>
          <p className="text-primary-700 mb-8">
            Terima kasih telah mendaftar di Markaz IT Madinah. Silakan cek email Anda untuk informasi selanjutnya mengenai tahapan seleksi.
          </p>
          <button onClick={() => window.location.href = '/'} className="btn-primary w-full">Kembali ke Beranda</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Pendaftaran - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Formulir Pendaftaran" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Lengkapi data diri Anda untuk bergabung bersama kami.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-cream-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Stepper */}
          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2 -z-10" />
            <div className={`absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }} />
            
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${
                step >= i ? 'bg-primary-500 border-dark-950 text-primary-950' : 'bg-white border-dark-950 text-primary-500'
              }`}>
                {i}
              </div>
            ))}
          </div>

          <div className="glass-card p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              {/* Step 1: Data Pribadi */}
              <div className={step === 1 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">Data Pribadi</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Nama Lengkap Sesuai KTP</label>
                    <input {...register('nama')} className="input-field" placeholder="Masukkan nama lengkap" />
                    {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">Usia (Tahun)</label>
                      <input type="number" {...register('usia')} className="input-field" placeholder="Contoh: 20" />
                      {errors.usia && <p className="text-red-400 text-xs mt-1">{errors.usia.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">Nomor WhatsApp</label>
                      <input {...register('no_hp')} className="input-field" placeholder="08xxxxxxxx" />
                      {errors.no_hp && <p className="text-red-400 text-xs mt-1">{errors.no_hp.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Email Aktif</label>
                    <input type="email" {...register('email')} className="input-field" placeholder="email@contoh.com" />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              {/* Step 2: Upload */}
              <div className={step === 2 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">Upload Dokumen (Max 2MB/file)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Scan KTP (Wajib)</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_ktp')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.dokumen_ktp && <p className="text-red-400 text-xs mt-1">{errors.dokumen_ktp.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Scan Kartu Keluarga (Wajib)</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_kk')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.dokumen_kk && <p className="text-red-400 text-xs mt-1">{errors.dokumen_kk.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Pas Foto Resmi 4x6 (Wajib)</label>
                    <input type="file" accept=".jpg,.jpeg,.png" {...register('foto')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.foto && <p className="text-red-400 text-xs mt-1">{errors.foto.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">Scan Paspor (Opsional)</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_paspor')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                  </div>
                </div>
              </div>

              {/* Step 3: Motivasi */}
              <div className={step === 3 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">Motivasi Pendaftaran</h3>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">Mengapa Anda ingin bergabung dengan Markaz IT Madinah?</label>
                  <textarea {...register('motivasi')} rows="6" className="input-field resize-none" placeholder="Ceritakan motivasi dan tujuan Anda secara singkat..."></textarea>
                  {errors.motivasi && <p className="text-red-400 text-xs mt-1">{errors.motivasi.message}</p>}
                </div>
              </div>

              {/* Step 4: Konfirmasi */}
              <div className={step === 4 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">Konfirmasi Data</h3>
                <div className="bg-white p-6 rounded-xl border border-cream-200 space-y-3 mb-6">
                  <p className="text-primary-700 text-sm">Dengan mengklik tombol submit di bawah, saya menyatakan bahwa:</p>
                  <ul className="list-disc pl-5 text-sm text-primary-800 space-y-2">
                    <li>Seluruh data dan dokumen yang diunggah adalah benar dan asli.</li>
                    <li>Saya bersedia mengikuti seluruh tahapan seleksi yang ditentukan.</li>
                    <li>Saya memahami bahwa pendaftaran ini belum final sampai saya membayarkan DP/Booking Seat (bila dinyatakan lolos seleksi berkas).</li>
                  </ul>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex gap-4 pt-6 border-t border-cream-200">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-secondary w-full" disabled={isSubmitting}>
                    Kembali
                  </button>
                )}
                
                {step < 4 ? (
                  <button type="button" onClick={nextStep} className="btn-primary w-full">
                    Selanjutnya
                  </button>
                ) : (
                  <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2" disabled={isSubmitting}>
                    {isSubmitting && <FaSpinner className="animate-spin" />}
                    Kirim Pendaftaran
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
