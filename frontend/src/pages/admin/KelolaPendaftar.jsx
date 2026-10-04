import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaEye, FaTrash, FaCheck, FaTimes, FaSpinner, FaWallet, FaDownload, FaFile, FaFileImage, FaFilePdf } from 'react-icons/fa';
import api from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';

// ponytail: show 'Belum diisi' for default no_hp placeholders (e.g. -13)
const displayNoHp = (v) => (v && !v.startsWith('-')) ? v : 'Belum diisi';

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
const downloadFile = async (url, name) => {
  try {
    const res = await api.get(url, { responseType: 'blob' });
    // ponytail: derive ext from MIME — without it Windows saves extensionless files it can't open
    const ext = { 'application/pdf': '.pdf', 'image/jpeg': '.jpg', 'image/png': '.png' }[res.data.type] || '';
    const href = URL.createObjectURL(res.data);
    const a = document.createElement('a');
    a.href = href;
    a.download = `${name}${ext}`;
    a.click();
    URL.revokeObjectURL(href);
  } catch { alert('Gagal mengunduh file'); }
};

export default function KelolaPendaftar() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [fotoBlob, setFotoBlob] = useState(null);
  const currentApplicantIdRef = useRef(null); // ponytail: ref beats closure for race condition guard

  const fetchApplicants = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/applicants`, {
        params: { search, status: statusFilter, page }
      });
      setApplicants(response.data.data);
      setTotalPages(response.data.meta.last_page);
    } catch (error) {
      console.error('Error fetching applicants', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [search, statusFilter, page]);

  const updateStatus = async (id, newStatus) => {
    setIsUpdating(true);
    try {
      await api.put(`/applicants/${id}/status`, { status: newStatus });
      fetchApplicants();
      if (selectedApplicant?.id === id) {
        setSelectedApplicant({ ...selectedApplicant, status: newStatus });
      }
    } catch (error) {
      alert('Gagal memperbarui status');
    } finally {
      setIsUpdating(false);
    }
  };

  const allowPayment = async (id) => {
    setIsUpdating(true);
    try {
      await api.put(`/applicants/${id}/allow-payment`);
      fetchApplicants();
      if (selectedApplicant?.id === id) {
        setSelectedApplicant({ ...selectedApplicant, payment_allowed_at: new Date().toISOString() });
      }
    } catch (error) {
      alert('Gagal mengizinkan pembayaran');
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch foto for selected applicant — ref-based guard prevents stale response overwrite
  useEffect(() => {
    setFotoBlob(null);
    if (!selectedApplicant?.foto) return;
    const id = selectedApplicant.id;
    currentApplicantIdRef.current = id;
    api.get(`/applicants/${id}/file/foto`, { responseType: 'blob' })
      .then(r => {
        if (currentApplicantIdRef.current === id) {
          setFotoBlob(prev => { if (prev) URL.revokeObjectURL(prev); return URL.createObjectURL(r.data); });
        }
      })
      .catch(() => {});
  }, [selectedApplicant?.id]);

  const updatePaymentStatus = async (paymentId, status) => {
    setIsUpdating(true);
    try {
      await api.put(`/payments/${paymentId}/status`, { status });
      fetchApplicants();
      // Refresh selected applicant
      if (selectedApplicant) {
        const res = await api.get(`/applicants/${selectedApplicant.id}`);
        setSelectedApplicant(res.data.data);
      }
    } catch (error) {
      alert('Gagal memperbarui status pembayaran');
    } finally {
      setIsUpdating(false);
    }
  };

  const deleteApplicant = async (id) => {
    try {
      await api.delete(`/applicants/${id}`);
      fetchApplicants();
      setSelectedApplicant(null);
    } catch (error) {
      alert('Gagal menghapus data');
    }
  };

  const deletePayment = async (paymentId) => {
    try {
      await api.delete(`/payments/${paymentId}`);
      fetchApplicants();
      if (selectedApplicant) {
        const res = await api.get(`/applicants/${selectedApplicant.id}`);
        setSelectedApplicant(res.data.data);
      }
    } catch (error) {
      alert('Gagal menghapus pembayaran');
    }
  };

  const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    review: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    diterima: 'bg-green-500/10 text-green-500 border-green-500/20',
    ditolak: 'bg-red-500/10 text-red-500 border-red-500/20',
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-950 mb-1">Kelola Pendaftar</h1>
          <p className="text-primary-600 text-sm">Daftar calon santri Markaz IT</p>
        </div>
      </div>

      <div className="admin-card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500" />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-11"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="input-field md:w-48 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239fa2a9%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_1rem_center] bg-[length:0.65rem_auto]"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Pending</option>
            <option value="review">Review</option>
            <option value="diterima">Diterima</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmAction}
        onClose={() => setConfirmAction(null)}
        onConfirm={() => {
          if (confirmAction?.type === 'delete') {
            deleteApplicant(confirmAction.id);
          } else if (confirmAction?.type === 'status') {
            updateStatus(confirmAction.id, confirmAction.value);
          } else if (confirmAction?.type === 'allow-payment') {
            allowPayment(confirmAction.id);
          } else if (confirmAction?.type === 'verify-payment') {
            updatePaymentStatus(confirmAction.id, 'verified');
          } else if (confirmAction?.type === 'reject-payment') {
            updatePaymentStatus(confirmAction.id, 'rejected');
          } else if (confirmAction?.type === 'delete-payment') {
            deletePayment(confirmAction.id);
          }
        }}
        title={
          confirmAction?.type === 'delete' ? 'Hapus Pendaftar'
          : confirmAction?.type === 'allow-payment' ? 'Izinkan Pembayaran'
          : confirmAction?.type === 'verify-payment' ? 'Verifikasi Pembayaran'
          : confirmAction?.type === 'reject-payment' ? 'Tolak Pembayaran'
          : confirmAction?.type === 'delete-payment' ? 'Hapus Pembayaran'
          : 'Ubah Status'
        }
        message={
          confirmAction?.type === 'delete' ? 'Yakin ingin menghapus pendaftar ini? Tindakan ini tidak dapat dibatalkan dan akan menghapus semua file terkait.'
          : confirmAction?.type === 'allow-payment' ? 'Izinkan pendaftar ini untuk mengirim bukti pembayaran?'
          : confirmAction?.type === 'verify-payment' ? 'Tandai pembayaran ini sebagai terverifikasi?'
          : confirmAction?.type === 'reject-payment' ? 'Tolak pembayaran ini? Pendaftar akan melihat status ditolak.'
          : confirmAction?.type === 'delete-payment' ? 'Yakin ingin menghapus pembayaran ini? File bukti juga akan dihapus.'
          : `Yakin ingin mengubah status menjadi ${confirmAction?.value}?`
        }
        confirmText={
          confirmAction?.type === 'delete' ? 'Ya, Hapus'
          : confirmAction?.type === 'reject-payment' ? 'Ya, Tolak'
          : confirmAction?.type === 'delete-payment' ? 'Ya, Hapus'
          : 'Ya, Izinkan'
        }
        danger={confirmAction?.type === 'delete' || confirmAction?.type === 'reject-payment' || confirmAction?.type === 'delete-payment'}
      />

      {/* Main Table Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className={`admin-card p-0 overflow-hidden ${selectedApplicant ? 'hidden xl:block xl:col-span-2' : 'xl:col-span-3'}`}>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-primary-700">
              <thead className="bg-cream-100 text-primary-600 uppercase text-xs border-b border-cream-200">
                <tr>
                  <th className="px-6 py-4 font-medium">Nama / Kontak</th>
                  <th className="px-6 py-4 font-medium">Usia</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium">Tanggal</th>
                  <th className="px-6 py-4 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200/50">
                {loading ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center"><FaSpinner className="animate-spin inline-block mr-2" /> Memuat data...</td></tr>
                ) : applicants.length === 0 ? (
                  <tr><td colSpan="5" className="px-6 py-8 text-center text-primary-500">Tidak ada data pendaftar.</td></tr>
                ) : (
                  applicants.map((app) => (
                    <tr key={app.id} className="hover:bg-cream-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary-950 mb-1">{app.nama}</p>
                        <p className="text-xs">{app.email}</p>
                        <p className="text-xs">{displayNoHp(app.no_hp)}</p>
                      </td>
                      <td className="px-6 py-4">{app.usia} Thn</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${statusColors[app.status]}`}>
                          {app.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs">
                        {new Date(app.created_at).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedApplicant(app)}
                          className="p-2 text-primary-400 hover:bg-primary-500/10 rounded-lg transition-colors inline-flex"
                          title="Lihat Detail"
                        >
                          <FaEye />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="p-4 border-t border-cream-200 flex justify-center gap-2">
              <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="px-3 py-1 rounded bg-white text-primary-950 disabled:opacity-50">Prev</button>
              <span className="px-3 py-1 text-primary-600">Hal {page} dari {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)} className="px-3 py-1 rounded bg-white text-primary-950 disabled:opacity-50">Next</button>
            </div>
          )}
        </div>

        {/* Detail Panel */}
        {selectedApplicant && (
          <div className="admin-card flex flex-col h-[calc(100vh-120px)] sticky top-6">
            <div className="flex justify-between items-center border-b border-cream-200 pb-4 mb-4">
              <h3 className="font-bold text-primary-950">Detail Pendaftar</h3>
              <button onClick={() => setSelectedApplicant(null)} className="text-primary-600 hover:text-primary-950 p-1">
                <FaTimes />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-cream-200 overflow-hidden shrink-0 border border-cream-300">
                  {fotoBlob ? (
                    <img key={selectedApplicant.id} src={fotoBlob} alt="Foto" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-500"><FaFileImage /></div>
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-lg text-primary-950">{selectedApplicant.nama}</h4>
                  <span className={`inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusColors[selectedApplicant.status]}`}>
                    {selectedApplicant.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Info Detail */}
              <div className="bg-cream-100 rounded-xl p-4 border border-cream-200 space-y-3">
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-primary-600">Email</span>
                  <span className="col-span-2 text-primary-950">{selectedApplicant.email}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-primary-600">No. HP</span>
                  <span className="col-span-2 text-primary-950">{displayNoHp(selectedApplicant.no_hp)}</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-primary-600">Usia</span>
                  <span className="col-span-2 text-primary-950">{selectedApplicant.usia} Tahun</span>
                </div>
                <div className="grid grid-cols-3 text-sm">
                  <span className="text-primary-600">Tanggal</span>
                  <span className="col-span-2 text-primary-950">{new Date(selectedApplicant.created_at).toLocaleString('id-ID')}</span>
                </div>
                {selectedApplicant.registrasi_ip && (
                  <div className="grid grid-cols-3 text-sm">
                    <span className="text-primary-600">IP Daftar</span>
                    <span className="col-span-2 text-primary-950 font-mono">{selectedApplicant.registrasi_ip}</span>
                  </div>
                )}
              </div>

              {/* Dokumen */}
              <div>
                <h5 className="font-bold text-primary-950 text-sm mb-3">Dokumen Lampiran</h5>
                <div className="space-y-2">
                  {selectedApplicant.dokumen_ktp && (
                    <DocLink label="KTP" field="dokumen_ktp" applicantId={selectedApplicant.id} />
                  )}
                  {selectedApplicant.dokumen_kk && (
                    <DocLink label="Kartu Keluarga" field="dokumen_kk" applicantId={selectedApplicant.id} />
                  )}
                  {selectedApplicant.dokumen_paspor && (
                    <DocLink label="Paspor" field="dokumen_paspor" applicantId={selectedApplicant.id} />
                  )}
                  {selectedApplicant.foto && (
                    <DocLink label="Foto" field="foto" applicantId={selectedApplicant.id} />
                  )}
                </div>
              </div>

              {/* Riwayat Pembayaran */}
              {selectedApplicant.payments?.length > 0 && (
                <div>
                  <h5 className="font-bold text-primary-950 text-sm mb-3">Riwayat Pembayaran</h5>
                  <div className="space-y-3">
                    {selectedApplicant.payments.map(p => {
                      const payStatus = p.status || 'pending';
                      const statusColor = payStatus === 'verified' ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : payStatus === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-500/20'
                        : 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
                      return (
                        <div key={p.id} className="bg-cream-100 rounded-xl p-3 border border-cream-200 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-primary-950">
                              Rp {Number(p.jumlah).toLocaleString('id-ID')}
                            </span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-bold border ${statusColor}`}>
                              {payStatus.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-primary-500">{new Date(p.created_at).toLocaleDateString('id-ID')}</span>
                            <div className="flex gap-1.5">
                              {p.bukti && (
                                <button onClick={() => openFile(`/payments/${p.id}/file`)}
                                  className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-cream-200 rounded-lg text-primary-600 hover:bg-cream-200 transition-colors">
                                  <FaFileImage /> Lihat Bukti
                                </button>
                              )}
                              {payStatus === 'pending' && (
                                <>
                                  <button onClick={() => setConfirmAction({ type: 'verify-payment', id: p.id })}
                                    disabled={isUpdating}
                                    className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 transition-colors">
                                    <FaCheck /> Verifikasi
                                  </button>
                                  <button onClick={() => setConfirmAction({ type: 'reject-payment', id: p.id })}
                                    disabled={isUpdating}
                                    className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
                                    <FaTimes /> Tolak
                                  </button>
                                </>
                              )}
                              <button onClick={() => setConfirmAction({ type: 'delete-payment', id: p.id })}
                                disabled={isUpdating}
                                className="text-xs inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-500/10 text-red-600 border border-red-500/20 rounded-lg hover:bg-red-500/20 transition-colors">
                                <FaTrash /> Hapus
                              </button>
                            </div>
                          </div>
                          {p.keterangan && (
                            <div className="text-xs text-primary-500 pt-1 border-t border-cream-200">
                              Keterangan: {p.keterangan}
                            </div>
                          )}
                          {p.norek_pengirim && (
                            <div className="text-xs text-primary-500 pt-1 border-t border-cream-200">
                              Rek: {p.norek_pengirim}{p.bank_pengirim ? ` (${p.bank_pengirim})` : ''}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Motivasi */}
              <div>
                <h5 className="font-bold text-primary-950 text-sm mb-2">Motivasi</h5>
                <div className="bg-cream-100 rounded-xl p-4 border border-cream-200 text-sm text-primary-700 leading-relaxed whitespace-pre-wrap">
                  {selectedApplicant.motivasi || '-'}
                </div>
              </div>
            </div>

            {/* Payment Status */}
            {selectedApplicant.payment_allowed_at ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-sm">
                <p className="text-green-600 font-medium flex items-center gap-2">
                  <FaCheck className="text-green-500" /> Pembayaran sudah diizinkan
                </p>
                <p className="text-green-500/70 text-xs mt-1">
                  {new Date(selectedApplicant.payment_allowed_at).toLocaleString('id-ID')}
                </p>
              </div>
            ) : (
              <button
                onClick={() => setConfirmAction({ type: 'allow-payment', id: selectedApplicant.id })}
                disabled={isUpdating}
                className="w-full px-4 py-2 bg-green-500/10 text-green-600 hover:bg-green-500/20 border border-green-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaWallet /> Izinkan Pembayaran
              </button>
            )}

            {/* Actions */}
            <div className="pt-4 mt-4 border-t border-cream-200 grid grid-cols-2 gap-2">
              <select 
                value={selectedApplicant.status}
                onChange={(e) => setConfirmAction({ type: 'status', id: selectedApplicant.id, value: e.target.value })}
                disabled={isUpdating}
                className="col-span-2 input-field text-sm mb-2"
              >
                <option value="pending">Status: Pending</option>
                <option value="review">Status: Review</option>
                <option value="diterima">Status: Diterima</option>
                <option value="ditolak">Status: Ditolak</option>
              </select>
              
              <button 
                onClick={() => setConfirmAction({ type: 'delete', id: selectedApplicant.id })}
                className="col-span-2 px-4 py-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
              >
                <FaTrash /> Hapus Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper: file link with view + download (uses axios to avoid 401 from direct href)
function DocLink({ label, field, applicantId }) {
  const viewUrl = `/applicants/${applicantId}/file/${field}`;
  const dlUrl = `/applicants/${applicantId}/download/${field}`;
  const isImage = field === 'foto';

  return (
    <div className="flex items-center gap-2">
      <button onClick={() => openFile(viewUrl)}
        className="flex-1 flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-cream-200 border border-cream-200 rounded-lg text-sm text-primary-700 transition-colors text-left">
        {isImage ? <FaFileImage className="text-primary-400" /> : <FaFilePdf className="text-red-400" />}
        Lihat {label}
      </button>
      <button onClick={() => downloadFile(dlUrl, `${label}_${applicantId}`)}
        className="px-3 py-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-emerald-600 transition-colors"
        title="Download">
        <FaDownload />
      </button>
    </div>
  );
}
