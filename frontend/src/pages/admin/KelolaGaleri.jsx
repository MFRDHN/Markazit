import { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function KelolaGaleri() {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({ judul: '', kategori: '', foto: null });

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gallery');
      setGalleries(response.data.data);
    } catch (error) {
      console.error('Error fetching galleries', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGalleries(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.foto) return alert('Pilih foto terlebih dahulu');
    
    setIsUploading(true);
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('kategori', formData.kategori);
    data.append('foto', formData.foto);

    try {
      await api.post('/gallery', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setIsModalOpen(false);
      setFormData({ judul: '', kategori: '', foto: null });
      fetchGalleries();
    } catch (error) {
      alert('Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/gallery/${id}`);
      fetchGalleries();
    } catch (error) {
      alert('Gagal menghapus foto');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-950 mb-1">Kelola Galeri</h1>
          <p className="text-primary-600 text-sm">Dokumentasi kegiatan dan fasilitas</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-primary flex items-center gap-2">
          <FaPlus /> Tambah Foto
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12"><FaSpinner className="animate-spin text-4xl text-primary-500" /></div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleries.map(item => (
            <div key={item.id} className="admin-card p-2 group relative">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-cream-100">
                <img src={item.foto} alt={item.judul} className="w-full h-full object-cover" />
              </div>
              <div className="p-3">
                <p className="font-bold text-primary-950 text-sm truncate">{item.judul}</p>
                <p className="text-xs text-primary-600">{item.kategori}</p>
              </div>
              <button 
                onClick={() => setConfirmDelete(item.id)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-primary-950 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
              >
                <FaTrash size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Hapus Foto"
        message="Yakin ingin menghapus foto ini?"
        danger
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-100 border border-cream-200 rounded-2xl w-full max-w-md">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary-950">Upload Foto</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-600 hover:text-primary-950">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Judul Foto</label>
                <input required type="text" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Kategori</label>
                <input required type="text" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} placeholder="Cth: Fasilitas" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">File Gambar</label>
                <input required type="file" accept="image/*" onChange={e => setFormData({...formData, foto: e.target.files[0]})} className="input-field file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary-500 file:text-primary-950 text-sm" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary px-6 py-2">Batal</button>
                <button type="submit" disabled={isUploading} className="btn-primary px-6 py-2 flex items-center gap-2">
                  {isUploading && <FaSpinner className="animate-spin" />} Upload
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
