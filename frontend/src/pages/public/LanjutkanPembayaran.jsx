import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { FaCheckCircle, FaSpinner, FaWhatsapp, FaSearch, FaUniversity, FaUpload } from 'react-icons/fa';
import api from '../../services/api';
import { TextReveal } from '../../components/common/TextReveal';
import { ScrollReveal } from '../../components/common/ScrollReveal';

export default function LanjutkanPembayaran() {
  const { t } = useTranslation();
  const [no_hp, setNoHp] = useState('');
  const [checking, setChecking] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState('');

  const [norekPengirim, setNorekPengirim] = useState('');
  const [bankPengirim, setBankPengirim] = useState('');
  const [bukti, setBukti] = useState(null);
  const [buktiError, setBuktiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const checkStatus = async (e) => {
    e.preventDefault();
    if (!no_hp || no_hp.length < 10) {
      setError(t('pembayaran.invalid_phone'));
      return;
    }

    setChecking(true);
    setError('');
    setPaymentData(null);

    try {
      const res = await api.post('/applicants/check-payment', { no_hp });
      const data = res.data;

      if (!data.allowed) {
        setError(data.message);
        return;
      }

      if (data.has_payment) {
        setError(t('pembayaran.error_duplicate'));
        return;
      }

      setPaymentData(data);
    } catch (err) {
      const msg = err.response?.data?.message || t('pembayaran.error_generic');
      setError(msg);
    } finally {
      setChecking(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();

    if (!norekPengirim || norekPengirim.length < 3) {
      setBuktiError(t('pembayaran.valid_norek'));
      return;
    }
    if (!bankPengirim || bankPengirim.length < 2) {
      setBuktiError(t('pembayaran.valid_bank'));
      return;
    }
    if (!bukti) {
      setBuktiError(t('pembayaran.valid_bukti'));
      return;
    }

    setIsSubmitting(true);
    setBuktiError('');

    try {
      const formData = new FormData();
      formData.append('jumlah', '47500000');
      formData.append('norek_pengirim', norekPengirim);
      formData.append('bank_pengirim', bankPengirim);
      formData.append('bukti', bukti);

      await api.post('/payments', formData);

      setIsSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join('\n') : null)
        || t('pembayaran.error_submit');
      setBuktiError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50">
        <div className="glass-card p-12 text-center max-w-lg mx-4">
          <FaCheckCircle className="text-6xl text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-primary-950 mb-4">{t('pembayaran.success_title')}</h2>
          <p className="text-primary-700 mb-4">
            {t('pembayaran.success_message')}
          </p>
          <p className="text-primary-600 text-sm mb-8">
            {t('pembayaran.success_detail')}
          </p>
          <button onClick={() => window.location.href = '/'} className="btn-primary w-full">{t('pembayaran.kembali_beranda')}</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title="pageTitle.lanjutkanPembayaran"
        description={t('pembayaran.description')}
        canonicalPath="/lanjutkan-pembayaran"
      />

      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('pembayaran.title')}</h1>
            <TextReveal text={t('pembayaran.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('pembayaran.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-cream-50 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="glass-card p-8 md:p-10">
            {!paymentData ? (
              <>
                <h3 className="text-xl font-bold text-primary-950 mb-2">{t('pembayaran.cek_title')}</h3>
                <p className="text-sm text-primary-600 mb-6">
                  {t('pembayaran.cek_instruction')}
                </p>

                <form onSubmit={checkStatus} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">{t('pembayaran.no_hp_label')}</label>
                    <div className="relative">
                      <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-400" />
                      <input
                        type="text"
                        value={no_hp}
                        onChange={(e) => setNoHp(e.target.value)}
                        className="input-field pl-11"
                        placeholder={t('pembayaran.no_hp_placeholder')}
                      />
                    </div>
                  </div>

                  {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                      <p className="text-red-500 text-sm">{error}</p>
                      {typeof error === 'string' && (error.includes('hubungi admin') || error.includes('admin') || error.includes('المشرف')) && (
                        <a
                          href="https://wa.me/62817786805"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 mt-3 text-sm text-green-600 hover:text-green-700 font-medium"
                        >
                          <FaWhatsapp /> {t('pembayaran.hubungi_admin')}
                        </a>
                      )}
                    </div>
                  )}

                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={checking}>
                    {checking && <FaSpinner className="animate-spin" />}
                    {t('pembayaran.cek_button')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-primary-950 mb-6">{t('pembayaran.form_title')}</h3>

                <div className="bg-white rounded-xl border border-gold-300 p-6 mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <FaUniversity className="text-gold-500 text-xl" />
                    <h4 className="font-bold text-primary-950">{t('pembayaran.transfer_title')}</h4>
                  </div>
                  <div className="bg-cream-100 rounded-lg p-4 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-primary-600">{t('pembayaran.bank_label')}</span>
                      <span className="font-bold text-primary-950">BANK SYARIAH INDONESIA (BSI)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">{t('pembayaran.rekening_label')}</span>
                      <span className="font-bold text-primary-950 text-base tracking-wider">7364 9901 83</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-primary-600">{t('pembayaran.atas_nama_label')}</span>
                      <span className="font-bold text-primary-950">PT MARKAZ IT INTERNATIONAL</span>
                    </div>
                    <hr className="border-cream-300 my-2" />
                    <div className="flex justify-between">
                      <span className="text-primary-600">Total Pembayaran</span>
                      <span className="font-bold text-gold-600 text-lg">Rp 47.500.000</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleSubmitPayment} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">{t('pembayaran.norek_label')}</label>
                      <input
                        type="text"
                        value={norekPengirim}
                        onChange={(e) => setNorekPengirim(e.target.value)}
                        className="input-field"
                        placeholder={t('pembayaran.norek_placeholder')}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-primary-700 mb-1">{t('pembayaran.bank_pengirim_label')}</label>
                      <input
                        type="text"
                        value={bankPengirim}
                        onChange={(e) => setBankPengirim(e.target.value)}
                        className="input-field"
                        placeholder={t('pembayaran.bank_pengirim_placeholder')}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-primary-700 mb-1">
                      <FaUpload className="inline mr-1" /> {t('pembayaran.bukti_label')}
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={(e) => setBukti(e.target.files[0])}
                      className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-primary-950 hover:file:bg-primary-600"
                    />
                    {buktiError && <p className="text-red-400 text-xs mt-1">{buktiError}</p>}
                  </div>

                  <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2" disabled={isSubmitting}>
                    {isSubmitting && <FaSpinner className="animate-spin" />}
                    {t('pembayaran.submit_button')}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
