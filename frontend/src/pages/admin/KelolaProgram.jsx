import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function KelolaProgram() {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({ nama: '', deskripsi: '', icon: '', urutan: 0 });

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const response = await api.get('/programs');
      setPrograms(response.data.data);
    } catch (error) {
      console.error('Error fetching programs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPrograms(); }, []);

  const handleOpenModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ nama: item.nama, deskripsi: item.deskripsi, icon: item.icon || '', urutan: item.urutan });
    } else {
      setEditingId(null);
      setFormData({ nama: '', deskripsi: '', icon: '', urutan: programs.length + 1 });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/programs/${editingId}`, formData);
      } else {
        await api.post('/programs', formData);
      }
      setIsModalOpen(false);
      fetchPrograms();
    } catch (error) {
      alert('Gagal menyimpan program');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/programs/${id}`);
      fetchPrograms();
    } catch (error) {
      alert('Gagal menghapus');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-primary-950">Kelola Program</h1>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2"><FaPlus /> Tambah</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? <FaSpinner className="animate-spin text-primary-950 text-2xl" /> : 
          programs.map(p => (
            <div key={p.id} className="admin-card">
              <h3 className="font-bold text-primary-950 text-lg mb-2">{p.nama}</h3>
              <p className="text-primary-600 text-sm mb-4 line-clamp-3">{p.deskripsi}</p>
              <div className="flex justify-between items-center pt-4 border-t border-cream-200">
                <span className="text-xs text-primary-500">Urutan: {p.urutan}</span>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(p)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded"><FaEdit /></button>
                  <button onClick={() => setConfirmDelete(p.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded"><FaTrash /></button>
                </div>
              </div>
            </div>
          ))
        }
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Hapus Program"
        message="Yakin menghapus program ini?"
        danger
      />

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-100 border border-cream-200 rounded-2xl w-full max-w-lg">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-primary-950">{editingId ? 'Edit Program' : 'Tambah Program'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-600 hover:text-primary-950">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm text-primary-700 mb-1">Nama Program</label>
                <input required type="text" value={formData.nama} onChange={e=>setFormData({...formData, nama: e.target.value})} className="input-field" />
              </div>
              <div>
                <label className="block text-sm text-primary-700 mb-1">Deskripsi</label>
                <textarea required rows="4" value={formData.deskripsi} onChange={e=>setFormData({...formData, deskripsi: e.target.value})} className="input-field"></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-primary-700 mb-1">Nama Icon (opsional)</label>
                  <input type="text" value={formData.icon} onChange={e=>setFormData({...formData, icon: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm text-primary-700 mb-1">Urutan</label>
                  <input type="number" value={formData.urutan} onChange={e=>setFormData({...formData, urutan: e.target.value})} className="input-field" />
                </div>
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
