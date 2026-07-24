import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUser, FaWallet, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import SEOHelmet from '../../components/common/SEOHelmet';

export default function DashboardHome() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/applicants/me')
      .then((res) => setData(res.data.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusBadge = (status) => {
    const colors = { pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20', review: 'bg-orange-500/10 text-orange-500 border-orange-500/20', diterima: 'bg-green-500/10 text-green-500 border-green-500/20', ditolak: 'bg-red-500/10 text-red-500 border-red-500/20' };
    return <span className={`rounded-full px-3 py-1 text-xs font-bold border ${colors[status] || 'bg-cream-100 text-primary-600'}`}>{status || 'pending'}</span>;
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-primary-400 text-2xl" /></div>;

  return (
    <>
      <SEOHelmet title="Dashboard" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-950 mb-1">Ringkasan Pendaftaran</h1>
        <p className="text-primary-600 text-sm">Status dan informasi pendaftaran Anda</p>
      </div>

      {!data ? (
        <div className="admin-card text-center py-12">
          <FaUser className="text-4xl text-primary-400 mx-auto mb-3" />
          <p className="text-primary-700 mb-4">Kamu belum melengkapi data pendaftaran.</p>
          <Link to="/dashboard/data" className="btn-primary inline-block">Lengkapi Sekarang</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="admin-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
                <FaUser className="text-primary-400" />
              </div>
              <h2 className="font-bold text-primary-950 text-lg">Data Diri</h2>
            </div>
            <dl className="space-y-3 text-sm">
              {[
                ['Nama Lengkap', data.nama],
                ['Usia', `${data.usia} Tahun`],
                ['No. HP', data.no_hp],
                ['Email', data.email],
                ['Status', statusBadge(data.status)],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between items-center py-1.5 border-b border-cream-200/50 last:border-0">
                  <dt className="text-primary-600">{label}</dt>
                  <dd className="text-primary-950 font-medium text-right">{value}</dd>
                </div>
              ))}
            </dl>
            <Link to="/dashboard/data" className="mt-5 inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-700 transition-colors">
              Edit Data →
            </Link>
          </div>

          <div className="admin-card">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                <FaWallet className="text-green-500" />
              </div>
              <h2 className="font-bold text-primary-950 text-lg">Pembayaran</h2>
            </div>
            <p className="text-3xl font-bold text-green-600 mb-1">Rp {(data.payments || []).reduce((s, p) => s + Number(p.jumlah), 0).toLocaleString('id-ID')}</p>
            <p className="text-sm text-primary-600 mb-5">terbayar dari Rp 2.500.000 (pendaftaran)</p>
            <Link to="/dashboard/pembayaran" className="inline-flex items-center text-sm font-medium text-primary-400 hover:text-primary-700 transition-colors">
              Kelola Pembayaran →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
