import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
    const colors = { pending: 'bg-yellow-100 text-yellow-800', review: 'bg-blue-100 text-blue-800', diterima: 'bg-green-100 text-green-800', ditolak: 'bg-red-100 text-red-800' };
    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${colors[status] || 'bg-gray-100'}`}>{status || 'pending'}</span>;
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>;

  return (
    <>
      <SEOHelmet title="Dashboard" />
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Ringkasan Pendaftaran</h1>

      {!data ? (
        <div className="rounded-xl bg-yellow-50 p-6 text-center">
          <p className="text-yellow-700">Kamu belum melengkapi data pendaftaran.</p>
          <Link to="/dashboard/data" className="mt-2 inline-block text-emerald-600 hover:underline">Lengkapi sekarang</Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Data Diri</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between"><dt className="text-gray-500">Nama</dt><dd>{data.nama}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Usia</dt><dd>{data.usia}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">No HP</dt><dd>{data.no_hp}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Email</dt><dd>{data.email}</dd></div>
              <div className="flex justify-between"><dt className="text-gray-500">Status</dt><dd>{statusBadge(data.status)}</dd></div>
            </dl>
            <Link to="/dashboard/data" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">Edit data</Link>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Pembayaran</h2>
            <p className="text-2xl font-bold text-emerald-600">Rp {(data.payments || []).reduce((s, p) => s + Number(p.jumlah), 0).toLocaleString('id-ID')}</p>
            <p className="text-sm text-gray-500">terbayar dari Rp 2.500.000 (pendaftaran)</p>
            <Link to="/dashboard/pembayaran" className="mt-4 inline-block text-sm text-emerald-600 hover:underline">Kelola pembayaran</Link>
          </div>
        </div>
      )}
    </>
  );
}
