import { useState, useEffect } from 'react';
import { FaSpinner, FaUser, FaSave, FaFile, FaFileImage, FaFilePdf, FaExternalLinkAlt } from 'react-icons/fa';
import api from '../../services/api';
import SEOHelmet from '../../components/common/SEOHelmet';

// ponytail: fetch via axios to avoid 401 from direct href
const openFile = async (url) => {
  try {
    const res = await api.get(url, { responseType: 'blob' });
    window.open(URL.createObjectURL(res.data), '_blank');
  } catch { alert('Gagal membuka file'); }
};

export default function DataDiri() {
  const [form, setForm] = useState({ nama: '', usia: '', no_hp: '', email: '', motivasi: '' });
  const [applicant, setApplicant] = useState(null);
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const loadData = () => api.get('/applicants/me')
    .then((res) => {
      const d = res.data.data;
      setApplicant(d);
      setForm({ nama: d.nama || '', usia: d.usia || '', no_hp: d.no_hp || '', email: d.email || '', motivasi: d.motivasi || '' });
    })
    .catch(() => setMsg({ type: 'error', text: 'Gagal memuat data.' }))
    .finally(() => setLoading(false));

  useEffect(() => { loadData(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleFile = (e) => setFiles({ ...files, [e.target.name]: e.target.files[0] });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMsg({ type: '', text: '' });

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
      Object.entries(files).forEach(([k, v]) => { if (v) fd.append(k, v); });
      fd.append('_method', 'PUT');

      await api.post('/applicants/me', fd);
      setFiles({});
      await loadData();
      setMsg({ type: 'success', text: 'Data berhasil disimpan!' });
      setTimeout(() => setMsg({ type: '', text: '' }), 3000);
    } catch (err) {
      setMsg({ type: 'error', text: 'Gagal menyimpan data.' });
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
