import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaUser, FaSave, FaFile, FaFileImage, FaFilePdf, FaExternalLinkAlt, FaTrash } from 'react-icons/fa';
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

export default function DataDiri() {
  const [form, setForm] = useState({ nama: '', usia: '', no_hp: '', email: '', motivasi: '' });
  const [applicant, setApplicant] = useState(null);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [showDelete, setShowDelete] = useState(false);
  const navigate = useNavigate();

  const loadData = () => api.get('/applicants/me')
    .then((res) => {
      const d = res.data.data;
      setApplicant(d);
      // ponytail: hide default no_hp placeholder (e.g. -13) in form
      const no_hp = (d.no_hp && !d.no_hp.startsWith('-')) ? d.no_hp : '';
      setForm({ nama: d.nama || '', usia: d.usia || '', no_hp, email: d.email || '', motivasi: d.motivasi || '' });
    })
    .catch((err) => {
      const msg = err.response?.data?.message || err.message || 'Gagal memuat data.';
      setMsg({ type: 'error', text: msg });
    })
    .finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleDelete = async () => {
    try {
      await api.delete('/applicants/me');
      localStorage.removeItem('user_token');
      localStorage.removeItem('user_data');
      navigate('/login');
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menghapus pendaftaran.' });
      setShowDelete(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const fd = new FormData();
      // Send everything the form shows — skipping empty fields made cleared
      // values silently keep their old data server-side
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append('_method', 'PUT');

      const res = await api.post('/applicants/me', fd);
      setFiles({});
      await loadData();
      // Update sidebar name
      if (res.data?.data?.nama) {
        try {
          const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
          userData.name = res.data.data.nama;
          localStorage.setItem('user_data', JSON.stringify(userData));
          window.dispatchEvent(new Event('user_data_updated'));
        } catch {}
      }
      setMsg({ type: 'success', text: 'Data berhasil disimpan!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      const msg = err.response?.data?.message
        || (err.response?.data?.errors ? Object.values(err.response.data.errors).flat().join('\n') : null)
        || err.message
        || 'Gagal menyimpan data.';
      setMsg({ type: 'error', text: msg });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><FaSpinner className="animate-spin text-primary-400 text-2xl" /></div>;

  return (
    <>
      <SEOHelmet title="Data Diri" />
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary-950 mb-1">Data Diri</h1>
        <p className="text-primary-600 text-sm">Kelengkapan data dan dokumen Anda</p>
      </div>

      {msg.text && (
        <div className={`mb-4 rounded-xl p-4 text-sm font-medium border ${msg.type === 'success' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
          {msg.text}
        </div>
      )}

      {/* Existing files */}
      {applicant?.dokumen_ktp && (
        <div className="admin-card mb-6">
          <h3 className="font-bold text-primary-950 text-sm mb-3">Dokumen Terupload</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {[
              ['KTP', 'dokumen_ktp'],
              ['Kartu Keluarga', 'dokumen_kk'],
              ['Paspor', 'dokumen_paspor'],
              ['Foto', 'foto'],
            ].filter(([, f]) => applicant[f]).map(([label, field]) => (
              <button key={field} onClick={() => openFile(`/applicants/me/file/${field}`)}
                className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-cream-200 hover:bg-cream-100 transition-colors w-full text-left">
                {field === 'foto' ? <FaFileImage className="text-primary-400" /> : <FaFilePdf className="text-red-400" />}
                <span className="flex-1 text-sm text-primary-700">{label}</span>
                <FaExternalLinkAlt className="text-primary-400 text-xs" />
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="admin-card">
        <div className="grid gap-4 md:grid-cols-2 mb-6">
          <Input label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} required />
          <Input label="Usia" name="usia" type="number" value={form.usia} onChange={handleChange} required />
          <Input label="No HP" name="no_hp" value={form.no_hp} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-primary-700 mb-1">Motivasi</label>
          <textarea name="motivasi" value={form.motivasi} onChange={handleChange} rows={3}
            className="input-field" />
        </div>

        <div className="mb-6">
          <h3 className="font-bold text-primary-950 text-sm mb-3">Upload Dokumen Baru</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FileInput label="Dokumen KTP" name="dokumen_ktp" onChange={handleFile} />
            <FileInput label="Dokumen KK" name="dokumen_kk" onChange={handleFile} />
            <FileInput label="Dokumen Paspor" name="dokumen_paspor" onChange={handleFile} />
            <FileInput label="Foto" name="foto" onChange={handleFile} accept="image/*" />
          </div>
        </div>

        <button type="submit" disabled={saving}
          className="btn-primary flex items-center gap-2">
          {saving ? <><FaSpinner className="animate-spin" /> Menyimpan...</> : <><FaSave /> Simpan Data</>}
        </button>
      </form>

      <div className="admin-card mt-6 border-red-500/20">
        <h3 className="font-bold text-red-600 text-sm mb-2">Zona Berbahaya</h3>
        <p className="text-sm text-primary-600 mb-4">Menghapus pendaftaran akan menghapus semua data dan dokumen Anda secara permanen, termasuk akun login.</p>
        <button onClick={() => setShowDelete(true)} disabled={saving}
          className="flex items-center gap-2 rounded-xl bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/20">
          <FaTrash /> Hapus Pendaftaran
        </button>
      </div>

      <ConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        title="Hapus Pendaftaran"
        message="Yakin ingin menghapus pendaftaran Anda? Semua data, dokumen, dan akun akan dihapus permanen."
        confirmText="Ya, Hapus"
        danger
      />
    </>
  );
}

function Input({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary-700 mb-1">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required} className="input-field" />
    </div>
  );
}

function FileInput({ label, name, onChange, accept = '.jpg,.jpeg,.png,.pdf' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-primary-700 mb-1">{label}</label>
      <input type="file" name={name} onChange={onChange} accept={accept}
        className="input-field file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-500 file:text-white hover:file:bg-primary-600" />
    </div>
  );
}
