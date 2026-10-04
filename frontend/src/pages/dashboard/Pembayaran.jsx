import { useState, useEffect } from 'react';
import { FaSpinner, FaWallet, FaUpload, FaFileInvoice, FaExternalLinkAlt, FaCheck, FaTimes, FaHourglassHalf, FaUniversity, FaTrash } from 'react-icons/fa';
import api from '../../services/api';
import SEOHelmet from '../../components/common/SEOHelmet';
import ConfirmModal from '../../components/common/ConfirmModal';

// ponytail: open tab first (user gesture) so popup blocker doesn't kill window.open after await
const openFile = async (url) => {
  const w = window.open('', '_blank');
  try {
    const res = await api.get(url, { responseType: 'blob' });
    w.location.href = URL.createObjectURL(res.data);
  } catch {
    w?.close();
    alert('Gagal membuka file');
  }
};

export default function Pembayaran() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [bukti, setBukti] = useState(null);
  const [jumlah, setJumlah] = useState('');
  const [keterangan, setKeterangan] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

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
      const fd = new FormData();
      fd.append('jumlah', jumlah);
      fd.append('keterangan', keterangan);
      fd.append('bukti', bukti);

      await api.post('/payments', fd);
      setMsg({ type: 'success', text: 'Bukti pembayaran berhasil diupload! Menunggu verifikasi admin.' });
      setBukti(null);
      setJumlah('');
      setKeterangan('');
      loadPayments();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal upload. Coba lagi.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await api.delete(`/payments/mine/${deleteTarget.id}`);
      setMsg({ type: 'success', text: 'Pembayaran berhasil dihapus.' });
      setDeleteTarget(null);
      loadPayments();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menghapus pembayaran.' });
      setDeleteTarget(null);
    }
  };

  const statusBadge = (s) => {
    const colors = {
      pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      verified: 'bg-green-500/10 text-green-500 border-green-500/20',
      rejected: 'bg-red-500/10 text-red-500 border-red-500/20',
    };
    return <span className={`rounded-full px-3 py-1 text-xs font-bold border ${colors[s] || 'bg-cream-100 text-primary-600'}`}>{s || 'pending'}</span>;
  };

  return (
    <>
      <SEOHelmet title="Pembayaran" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-950 mb-1">Pembayaran</h1>
        <p className="text-primary-600 text-sm">Upload bukti transfer dan riwayat pembayaran</p>
      </div>

      {/* Info biaya */}
      <div className="admin-card flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
          <FaUniversity className="text-green-500 text-xl" />
        </div>
        <div>
          <p className="text-sm text-primary-700">
            <span className="font-bold text-primary-950">Biaya Pendaftaran:</span> Rp 2.500.000
            <span className="mx-2 text-cream-300">|</span>
            <span className="font-bold text-primary-950">Total Program:</span> Rp 47.500.000
          </p>
          <p className="text-xs text-primary-600 mt-1">
            Bank BSI 7364 9901 83 a.n. PT MARKAZ IT INTERNATIONAL
          </p>
        </div>
      </div>

      {msg.text && (
        <div className={`mb-4 rounded-xl p-4 text-sm font-medium border ${msg.type === 'success' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
          {msg.text}
        </div>
      )}

      {/* Upload form */}
      <div className="admin-card mb-8">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary-500/10 flex items-center justify-center">
            <FaUpload className="text-primary-400" />
          </div>
          <h2 className="font-bold text-primary-950">Upload Bukti Transfer</h2>
        </div>
        <form onSubmit={handleUpload} className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Jumlah Nominal (Rp)</label>
              <input type="number" min="0" placeholder="Contoh: 2500000" value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-primary-700 mb-1">Keterangan Pembayaran</label>
              <input type="text" placeholder="Contoh: Pendaftaran program, DP, pelunasan" value={keterangan}
                onChange={(e) => setKeterangan(e.target.value)}
                className="input-field" required />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <input type="file" accept=".jpg,.jpeg,.png,.pdf" onChange={(e) => setBukti(e.target.files[0])}
              className="input-field flex-1 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600" required />
            <button type="submit" disabled={saving || !bukti || !jumlah || !keterangan}
              className="btn-primary flex items-center justify-center gap-2 shrink-0">
              {saving ? <><FaSpinner className="animate-spin" /> Mengupload...</> : <><FaUpload /> Upload</>}
            </button>
          </div>
        </form>
      </div>

      {/* Riwayat */}
      <div className="admin-card">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
            <FaFileInvoice className="text-blue-500" />
          </div>
          <h2 className="font-bold text-primary-950">Riwayat Pembayaran</h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-10"><FaSpinner className="animate-spin text-primary-400 text-xl" /></div>
        ) : payments.length === 0 ? (
          <div className="text-center py-10 text-primary-600">
            <FaWallet className="text-3xl mx-auto mb-2 text-primary-400" />
            <p className="text-sm">Belum ada pembayaran.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b border-cream-200 text-primary-600 uppercase text-xs">
                  <th className="px-4 py-3 font-medium">Tanggal</th>
                  <th className="px-4 py-3 font-medium">Keterangan</th>
                  <th className="px-4 py-3 font-medium">Jumlah</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">File</th>
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/50 text-primary-700">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-4 py-3">{new Date(p.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-4 py-3">{p.keterangan || '-'}</td>
                    <td className="px-4 py-3 font-medium">Rp {Number(p.jumlah).toLocaleString('id-ID')}</td>
                    <td className="px-4 py-3">{statusBadge(p.status)}</td>
                    <td className="px-4 py-3">
                      {p.bukti && (
                        <button onClick={() => openFile(`/payments/mine/${p.id}/file`)}
                          className="inline-flex items-center gap-1.5 text-primary-400 hover:text-primary-700 text-xs font-medium transition-colors">
                          <FaExternalLinkAlt /> Lihat
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setDeleteTarget(p)}
                        className="inline-flex items-center gap-1.5 text-red-500 hover:text-red-700 text-xs font-medium transition-colors">
                        <FaTrash /> Hapus
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Pembayaran"
        message={deleteTarget ? `Yakin ingin menghapus pembayaran Rp ${Number(deleteTarget.jumlah).toLocaleString('id-ID')} (${deleteTarget.keterangan || '-'})? File bukti juga akan dihapus.` : ''}
        confirmText="Ya, Hapus"
        danger
      />
    </>
  );
}
