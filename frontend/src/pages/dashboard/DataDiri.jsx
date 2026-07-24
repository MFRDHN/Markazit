import { useState, useEffect } from 'react';
import api from '../../services/api';
import SEOHelmet from '../../components/common/SEOHelmet';

export default function DataDiri() {
  const [form, setForm] = useState({ nama: '', usia: '', no_hp: '', email: '', motivasi: '' });
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  useEffect(() => {
    api.get('/applicants/me')
      .then((res) => {
        const d = res.data.data;
        setForm({ nama: d.nama || '', usia: d.usia || '', no_hp: d.no_hp || '', email: d.email || '', motivasi: d.motivasi || '' });
      })
      .catch(() => setMsg({ type: 'error', text: 'Gagal memuat data.' }))
      .finally(() => setLoading(false));
  }, []);

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
      setMsg({ type: 'success', text: 'Data berhasil disimpan!' });
    } catch (err) {
      setMsg({ type: 'error', text: 'Gagal menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-20"><div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent" /></div>;

  return (
    <>
      <SEOHelmet title="Data Diri" />
      <h1 className="mb-6 text-2xl font-bold text-gray-800">Data Diri</h1>

      {msg.text && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${msg.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
          {msg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4 rounded-xl bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Input label="Nama Lengkap" name="nama" value={form.nama} onChange={handleChange} required />
          <Input label="Usia" name="usia" type="number" value={form.usia} onChange={handleChange} required />
          <Input label="No HP" name="no_hp" value={form.no_hp} onChange={handleChange} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Motivasi</label>
          <textarea name="motivasi" value={form.motivasi} onChange={handleChange} rows={3}
            className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-emerald-500 focus:outline-none" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FileInput label="Dokumen KTP" name="dokumen_ktp" onChange={handleFile} />
          <FileInput label="Dokumen KK" name="dokumen_kk" onChange={handleFile} />
          <FileInput label="Dokumen Paspor" name="dokumen_paspor" onChange={handleFile} />
          <FileInput label="Foto" name="foto" onChange={handleFile} accept="image/*" />
        </div>

        <button type="submit" disabled={saving}
          className="rounded-lg bg-emerald-600 px-6 py-2 font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50">
          {saving ? 'Menyimpan...' : 'Simpan Data'}
        </button>
      </form>
    </>
  );
}

function Input({ label, name, type = 'text', value, onChange, required }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type={type} name={name} value={value} onChange={onChange} required={required}
        className="mt-1 w-full rounded-lg border px-4 py-2 focus:border-emerald-500 focus:outline-none" />
    </div>
  );
}

function FileInput({ label, name, onChange, accept = '.jpg,.jpeg,.png,.pdf' }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input type="file" name={name} onChange={onChange} accept={accept}
        className="mt-1 w-full text-sm text-gray-500 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-emerald-700" />
    </div>
  );
}
