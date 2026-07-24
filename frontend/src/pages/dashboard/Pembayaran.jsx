import { useState, useEffect } from 'react';
import api from '../../services/api';
import SEOHelmet from '../../components/common/SEOHelmet';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export default function Pembayaran() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [bukti, setBukti] = useState(null);

  const loadPayments = () => {
    api.get('/payments/mine')
      .then((res) => setPayments(res.data.data || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { loadPayments(); }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!bukti) return;
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      // Get applicant ID from /me
      const me = await api.get('/applicants/me');
      const applicantId = me.data.data.id;

      const fd = new FormData();
      fd.append('applicant_id', applicantId);
      fd.append('jumlah', '2500000');
      fd.append('bukti', bukti);

      await api.post('/payments', fd);
      setMsg({ type: 'success', text: 'Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.' });
      setBukti(null);
      loadPayments();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal upload. Coba lagi.' });
    } finally {
      setSaving(false);
    }
  };

  const statusBadge = (s) => {
    const colors = { pending: 'bg-yellow-100 text-yellow-800', verified: 'bg-green-100 text-green-800', rejected: 'bg-red-100 text-red-800' };
    return <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${colors[s] || 'bg-gray-100'}`}>{s || 'pending'}</span>;
  };

  return (
    <>
      <SEOHelmet title="Pembayaran" />
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Pembayaran</h1>

      {/* Info biaya */}
      <div className="mb-6 rounded-xl bg-emerald-50 p-4 text-sm">
        <p><strong>Biaya Pendaftaran:</strong> Rp 2.500.000</p>
        <p><strong>Total Program:</strong> Rp 47.500.000</p>
        <p className="mt-1 text-xs text-gray-500">Bank BSI 7364 9901 83 a.n. PT MARKAZ IT INTERNATIONAL</p>
      </div>

      {msg.text && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      {/* Upload form */}
      <form onSubmit={handleUpload} className="mb-8 max-w-md rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Upload Bukti Transfer</h2>
        <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setBukti(e.target.files[0])}
          className="mb-4 w-full text-sm file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700" required />
        <button type="submit" disabled={saving || !bukti}
          className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Mengupload...' : 'Upload Bukti'}
        </button>
      </form>

      {/* Riwayat */}
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Riwayat Pembayaran</h2>
        {loading ? (
          <div className="flex justify-center py-8"><div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>
        ) : payments.length === 0 ? (
          <p className="text-sm text-gray-500">Belum ada pembayaran.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-gray-500">
                  <th className="pb-2 pr-4">Tanggal</th>
                  <th className="pb-2 pr-4">Jumlah</th>
                  <th className="pb-2 pr-4">Status</th>
                  <th className="pb-2">File</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 pr-4">{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="py-2 pr-4">Rp {Number(p.jumlah).toLocaleString('id-ID')}</td>
                    <td className="py-2 pr-4">{statusBadge(p.status)}</td>
                    <td className="py-2">
                      {p.bukti && (
                        <a href={`${API_URL.replace('/api', '/s.php')}?f=${p.bukti}`} target="_blank" rel="noopener noreferrer"
                          className="text-emerald-600 hover:underline text-xs">Lihat</a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
