import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaSpinner } from 'react-icons/fa';
import SEOHelmet from '../../components/common/SEOHelmet';
import api from '../../services/api';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/login', form);
      localStorage.setItem('user_token', res.data.token);
      localStorage.setItem('user_data', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.errors?.email?.[0] || 'Login gagal. Silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SEOHelmet title="Login" />
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6 drop-shadow-md">
            {t('nav.login')}
          </h1>
          <p className="text-lg text-cream-100 max-w-2xl mx-auto">
            Masuk ke dashboard pendaftaran Anda
          </p>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-cream-50 min-h-[60vh]">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="admin-card">
            {error && (
              <div className="mb-4 rounded-xl p-4 text-sm font-medium border bg-red-500/10 text-red-600 border-red-500/20">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Email</label>
                <input type="email" required className="input-field"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Password</label>
                <input type="password" required minLength={6} className="input-field"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>

              <button type="submit" disabled={loading}
                className="btn-primary w-full flex justify-center items-center gap-2">
                {loading ? <><FaSpinner className="animate-spin" /> Memproses...</> : 'Masuk Dashboard'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-primary-600">
              Belum daftar?{' '}
              <Link to="/pendaftaran" className="text-primary-400 font-medium hover:text-primary-700 transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
