import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { FaCheckCircle, FaSpinner, FaWhatsapp } from 'react-icons/fa';
import api from '../../services/api';
import { TextReveal } from '../../components/common/TextReveal';
import { ScrollReveal } from '../../components/common/ScrollReveal';

const MAX_FILE_SIZE = 2 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];

export default function Pendaftaran() {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const schema = useMemo(() => z.object({
    nama: z.string().min(3, t('register.zod_nama')),
    usia: z.string().refine((val) => !isNaN(val) && parseInt(val) >= 15 && parseInt(val) <= 45, { message: t('register.zod_usia') }),
    no_hp: z.string().min(10, t('register.zod_no_hp')),
    email: z.string().email(t('register.zod_email')),
    motivasi: z.string().min(20, t('register.zod_motivasi')),
    dokumen_ktp: z.any().refine((files) => files?.length === 1, t('register.zod_ktp')),
    dokumen_kk: z.any().refine((files) => files?.length === 1, t('register.zod_kk')),
    dokumen_paspor: z.any().optional(),
    foto: z.any().refine((files) => files?.length === 1, t('register.zod_foto')),
  }), [t]);

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
      const msg = error.response?.data?.message
        || (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join('\n') : null)
        || t('register.error_submit');
      alert(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50">
        <div className="glass-card p-12 text-center max-w-lg mx-4">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-950 mb-4">{t('register.success')}</h2>
          <p className="text-primary-700 mb-6">
            {t('register.success_intro')}
          </p>

          <div className="bg-cream-100 rounded-xl p-6 mb-8 text-left space-y-4">
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">1</span>
              <p className="text-sm text-primary-700">
                <strong>{t('register.success_1')}</strong> {t('register.success_1_desc')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">2</span>
              <p className="text-sm text-primary-700">
                {t('register.success_2')}
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="w-7 h-7 rounded-full bg-primary-500 text-white flex items-center justify-center shrink-0 font-bold text-sm">3</span>
              <p className="text-sm text-primary-700" dangerouslySetInnerHTML={{ __html: t('register.success_3_desc') }} />
            </div>
          </div>

          <a
            href="https://wa.me/62817786805"
            target="_blank"
            rel="noreferrer"
            className="btn-primary w-full flex items-center justify-center gap-3 mb-4"
          >
            <FaWhatsapp className="text-xl" />
            {t('register.chat_admin')}
          </a>

          <a
            href="/lanjutkan-pembayaran"
            className="block w-full text-center text-sm text-primary-500 hover:text-primary-700 underline transition-colors"
          >
            {t('register.sudah_dihubungi')}
          </a>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="pageTitle.pendaftaran"
        description={t('register.subtitle')}
        canonicalPath="/pendaftaran"
      />

      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('register.title')}</h1>
            <TextReveal text={t('register.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('register.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-cream-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="flex justify-between items-center mb-12 relative">
            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white -translate-y-1/2 -z-10" />
            <div className={`absolute top-1/2 left-0 h-1 bg-primary-500 -translate-y-1/2 -z-10 transition-all duration-500`} style={{ width: `${((step - 1) / 3) * 100}%` }} />

            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-4 transition-colors ${
                step >= i ? 'bg-primary-500 border-primary-500 text-white' : 'bg-white border-cream-300 text-primary-500'
              }`}>
                {i}
              </div>
            ))}
          </div>

          <div className="glass-card p-8 md:p-10">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

              <div className={step === 1 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">{t('register.step1')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.nama_label')}</label>
                    <input {...register('nama')} className="input-field" placeholder={t('register.nama_placeholder')} />
                    {errors.nama && <p className="text-red-400 text-xs mt-1">{errors.nama.message}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.usia_label')}</label>
                      <input type="number" {...register('usia')} className="input-field" placeholder={t('register.usia_placeholder')} />
                      {errors.usia && <p className="text-red-400 text-xs mt-1">{errors.usia.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.no_hp_label')}</label>
                      <input {...register('no_hp')} className="input-field" placeholder={t('register.no_hp_placeholder')} />
                      {errors.no_hp && <p className="text-red-400 text-xs mt-1">{errors.no_hp.message}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.email_label')}</label>
                    <input type="email" {...register('email')} className="input-field" placeholder={t('register.email_placeholder')} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                  </div>
                </div>
              </div>

              <div className={step === 2 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">{t('register.upload_title')}</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.ktp_label')}</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_ktp')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.dokumen_ktp && <p className="text-red-400 text-xs mt-1">{errors.dokumen_ktp.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.kk_label')}</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_kk')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.dokumen_kk && <p className="text-red-400 text-xs mt-1">{errors.dokumen_kk.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.foto_label')}</label>
                    <input type="file" accept=".jpg,.jpeg,.png" {...register('foto')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                    {errors.foto && <p className="text-red-400 text-xs mt-1">{errors.foto.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('register.paspor_label')}</label>
                    <input type="file" accept=".jpg,.jpeg,.png,.pdf" {...register('dokumen_paspor')} className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600" />
                  </div>
                </div>
              </div>

              <div className={step === 3 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">{t('register.motivasi_title')}</h3>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-2">{t('register.motivasi_label')}</label>
                  <textarea {...register('motivasi')} rows="6" className="input-field resize-none" placeholder={t('register.motivasi_placeholder')}></textarea>
                  {errors.motivasi && <p className="text-red-400 text-xs mt-1">{errors.motivasi.message}</p>}
                </div>
              </div>

              <div className={step === 4 ? 'block' : 'hidden'}>
                <h3 className="text-xl font-bold text-primary-950 mb-6">{t('register.konfirmasi_title')}</h3>
                <div className="bg-white p-6 rounded-xl border border-cream-200 space-y-3 mb-6">
                  <p className="text-primary-700 text-sm">{t('register.konfirmasi_intro')}</p>
                  <ul className="list-disc pl-5 text-sm text-primary-800 space-y-2">
                    <li>{t('register.konfirmasi_1')}</li>
                    <li>{t('register.konfirmasi_2')}</li>
                    <li>{t('register.konfirmasi_3')}</li>
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-cream-200">
                {step > 1 && (
                  <button type="button" onClick={prevStep} className="btn-secondary w-full" disabled={isSubmitting}>
                    {t('register.prev')}
                  </button>
                )}

                {step < 4 ? (
                  <button type="button" onClick={nextStep} className="btn-primary w-full">
                    {t('register.next')}
                  </button>
                ) : (
                  <button type="submit" className="btn-primary w-full flex justify-center items-center gap-2" disabled={isSubmitting}>
                    {isSubmitting && <FaSpinner className="animate-spin" />}
                    {t('register.submit')}
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
