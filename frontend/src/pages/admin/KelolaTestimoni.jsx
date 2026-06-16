import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner, FaStar } from 'react-icons/fa';
import api from '../../services/api';

export default function KelolaTestimoni() {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nama: '', asal: '', isi: '', rating: 5 });

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await api.get('/testimonials');
      setTestimonials(response.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchTestimonials(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/testimonials', formData);
      setIsModalOpen(false);
      setFormData({ nama: '', asal: '', isi: '', rating: 5 });
      fetchTestimonials();
    } catch (error) {
      alert('Gagal menyimpan testimoni');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Yakin menghapus testimoni?')) return;
    try {
      await api.delete(`/testimonials/${id}`);
      fetchTestimonials();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-950">Kelola Testimoni</h1>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2"><FaPlus /> Tambah</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {loading ? <FaSpinner className="animate-spin text-primary-950 text-2xl" /> : 
          testimonials.map(t => (
            <div key={t.id} className="admin-card flex flex-col">
              <div className="flex-1">
                <div className="flex text-gold-400 text-xs mb-3">
                  {[...Array(t.rating)].map((_, i) => <FaStar key={i} />)}
                </div>
                <p className="text-primary-950 italic text-sm mb-4">"{t.isi}"</p>
              </div>
              <div className="flex justify-between items-end pt-4 border-t border-cream-200 mt-auto">
                <div>
                  <p className="font-bold text-primary-950 text-sm">{t.nama}</p>
                  <p className="text-xs text-primary-600">{t.asal}</p>
                </div>
                <button onClick={() => handleDelete(t.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><FaTrash /></button>
              </div>
            </div>
          ))
        }
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-100 border border-cream-200 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary-950">Tambah Testimoni</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-600 hover:text-primary-950">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-primary-700 mb-1">Nama</label>
                  <input required type="text" value={formData.nama} onChange={e=>setFormData({...formData, nama: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-primary-700 mb-1">Asal Daerah</label>
                  <input required type="text" value={formData.asal} onChange={e=>setFormData({...formData, asal: e.target.value})} className="input-field" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-primary-700 mb-1">Rating (1-5)</label>
                <input required type="number" min="1" max="5" value={formData.rating} onChange={e=>setFormData({...formData, rating: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-primary-700 mb-1">Isi Testimoni</label>
                <textarea required rows="4" value={formData.isi} onChange={e=>setFormData({...formData, isi: e.target.value})} className="input-field"></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6 py-2">Batal</button>
                <button type="submit" className="btn-primary px-6 py-2">Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
