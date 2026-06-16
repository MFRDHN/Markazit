import { useState, useEffect } from 'react';
import { FaUsers, FaClock, FaCheckCircle, FaTimesCircle, FaChartLine } from 'react-icons/fa';
import api from '../../services/api';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/dashboard');
        setStats(response.data.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 flex justify-center"><div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>;
  }

  const statCards = [
    { title: 'Total Pendaftar', value: stats?.total_pendaftar || 0, icon: FaUsers, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { title: 'Pendaftar Bulan Ini', value: stats?.pendaftar_bulan_ini || 0, icon: FaChartLine, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { title: 'Status Pending', value: stats?.pending || 0, icon: FaClock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
    { title: 'Sedang Direview', value: stats?.review || 0, icon: FaUsers, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    { title: 'Diterima', value: stats?.diterima || 0, icon: FaCheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
    { title: 'Ditolak', value: stats?.ditolak || 0, icon: FaTimesCircle, color: 'text-red-400', bg: 'bg-red-400/10' },
  ];

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-950 mb-2">Dashboard</h1>
        <p className="text-primary-600">Ringkasan data pendaftaran Markaz IT Madinah.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {statCards.map((card, index) => (
          <div key={index} className="admin-card flex items-center gap-4">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${card.bg}`}>
              <card.icon className={`text-2xl ${card.color}`} />
            </div>
            <div>
              <p className="text-sm font-medium text-primary-600 mb-1">{card.title}</p>
              <h3 className="text-2xl font-bold text-primary-950">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 admin-card">
        <h2 className="text-lg font-bold text-primary-950 mb-4">Informasi Sistem</h2>
        <div className="space-y-3 text-sm text-primary-700">
          <p>• Gunakan menu di sebelah kiri untuk mengelola berbagai data.</p>
          <p>• Data pendaftar baru akan masuk dengan status <strong>Pending</strong>.</p>
          <p>• Pastikan untuk meninjau dokumen pendaftar sebelum mengubah status menjadi <strong>Review</strong> atau <strong>Diterima</strong>.</p>
          <p>• Email notifikasi otomatis akan dikirim ke pendaftar setiap kali status mereka diperbarui (bila dikonfigurasi).</p>
        </div>
      </div>
    </div>
  );
}
