import { useState, useEffect } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { FaLock, FaEnvelope, FaSpinner } from 'react-icons/fa';
import { useAuthStore } from '../../store';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login, loading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Already logged in? Redirect to dashboard
    if (isAuthenticated) {
      navigate('/admin');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Email dan password wajib diisi.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate('/admin');
    } else {
      setError(result.message);
    }
  };

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  return (
    <>
      <Helmet>
        <title>Login Admin - Markaz IT Madinah</title>
      </Helmet>
      
      <div className="min-h-screen flex items-center justify-center bg-cream-50 px-4">
        <div className="max-w-md w-full glass-card p-8 md:p-10 border-primary-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-primary-950 font-bold text-2xl mx-auto mb-4 shadow-lg shadow-primary-500/30">
              M
            </div>
            <h2 className="text-2xl font-bold text-primary-950 mb-2">Admin Panel</h2>
            <p className="text-primary-600 text-sm">Masuk untuk mengelola sistem</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-xl mb-6 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                  <FaEnvelope />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field pl-11"
                  placeholder="admin@markazit-madinah.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-primary-500">
                  <FaLock />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center items-center gap-2"
            >
              {loading ? <FaSpinner className="animate-spin" /> : 'Masuk Dashboard'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-primary-600 hover:text-primary-950 text-sm transition-colors">
              &larr; Kembali ke Beranda
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
