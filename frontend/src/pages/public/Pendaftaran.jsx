import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { FaSpinner, FaCheckCircle, FaEnvelope, FaLock } from 'react-icons/fa';
import api from '../../services/api';

export default function Pendaftaran() {
  const { t } = useTranslation();
  const [form, setForm] = useState({ email: '', password: '', password_confirmation: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.password_confirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post('/applicants', {
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });
      setIsSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join('\n') : null)
        || 'Gagal mendaftar. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHelmet title={t('register.title')} description={t('register.subtitle')} canonicalPath="/pendaftaran" />

      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-md">
            {t('register.title')}
          </h1>
          <p className="text-lg text-cream-100 max-w-2xl mx-auto">
            {t('register.subtitle')}
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-cream-50 min-h-screen">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          {!isSuccess ? (
            <div className="glass-card p-8 md:p-10">
              {error && (
                <div className="mb-4 rounded-xl p-4 text-sm font-medium border bg-red-500/10 text-red-600 border-red-500/20">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FaEnvelope />
                    </div>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required
                      className="input-field pl-11" placeholder="contoh@email.com" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FaLock />
                    </div>
                    <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6}
                      className="input-field pl-11" placeholder="Minimal 6 karakter" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Konfirmasi Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                      <FaLock />
                    </div>
                    <input type="password" name="password_confirmation" value={form.password_confirmation} onChange={handleChange} required minLength={6}
                      className="input-field pl-11" placeholder="Ulangi password" />
                  </div>
                </div>

                <button type="submit" disabled={isSubmitting}
                  className="btn-primary w-full flex justify-center items-center gap-2">
                  {isSubmitting ? <><FaSpinner className="animate-spin" /> Mendaftar...</> : 'Daftar Sekarang'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-primary-600">
                Sudah punya akun?{' '}
                <Link to="/login" className="text-primary-400 font-medium hover:text-primary-700 transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-primary-950 mb-2">Pendaftaran Berhasil</h3>
              <p className="text-primary-600 mb-6">Silakan login untuk melengkapi data diri Anda.</p>
              <Link to="/login" className="btn-primary">
                Masuk ke Akun
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
