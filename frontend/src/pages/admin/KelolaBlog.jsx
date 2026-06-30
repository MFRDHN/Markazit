import { useState, useEffect } from 'react';
import { FaPlus, FaEdit, FaTrash, FaSpinner } from 'react-icons/fa';
import api from '../../services/api';
import ConfirmModal from '../../components/common/ConfirmModal';

export default function KelolaBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  const [formData, setFormData] = useState({
    judul: '',
    kategori: '',
    meta_desc: '',
    konten: '',
    thumbnail: null
  });

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data.data);
    } catch (error) {
      console.error('Error fetching blogs', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleOpenModal = (blog = null) => {
    if (blog) {
      setEditingId(blog.id);
      setFormData({
        judul: blog.judul,
        kategori: blog.kategori || '',
        meta_desc: blog.meta_desc || '',
        konten: blog.konten,
        thumbnail: null // Don't set file input value
      });
    } else {
      setEditingId(null);
      setFormData({ judul: '', kategori: '', meta_desc: '', konten: '', thumbnail: null });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('judul', formData.judul);
    data.append('kategori', formData.kategori);
    data.append('meta_desc', formData.meta_desc);
    data.append('konten', formData.konten);
    if (formData.thumbnail) {
      data.append('thumbnail', formData.thumbnail);
    }

    try {
      if (editingId) {
        data.append('_method', 'PUT');
        await api.post(`/blogs/${editingId}`, data);
      } else {
        await api.post('/blogs', data);
      }
      setIsModalOpen(false);
      fetchBlogs();
    } catch (error) {
      const msg = error.response?.data?.message
        || (error.response?.data?.errors ? Object.values(error.response.data.errors).flat().join('\n') : null)
        || 'Gagal menyimpan artikel';
      alert(msg);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus artikel');
    }
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-primary-950 mb-1">Kelola Blog</h1>
          <p className="text-primary-600 text-sm">Artikel dan Berita Markaz IT</p>
        </div>
        <button onClick={() => handleOpenModal()} className="btn-primary flex items-center gap-2">
          <FaPlus /> Tambah Artikel
        </button>
      </div>

      <div className="admin-card p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-primary-700">
            <thead className="bg-cream-100 text-primary-600 uppercase text-xs border-b border-cream-200">
              <tr>
                <th className="px-6 py-4 font-medium w-20">Foto</th>
                <th className="px-6 py-4 font-medium">Judul & Kategori</th>
                <th className="px-6 py-4 font-medium">Tanggal</th>
                <th className="px-6 py-4 font-medium text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cream-200/50">
              {loading ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center"><FaSpinner className="animate-spin inline-block mr-2" /> Memuat...</td></tr>
              ) : blogs.length === 0 ? (
                <tr><td colSpan="4" className="px-6 py-8 text-center text-primary-500">Tidak ada artikel.</td></tr>
              ) : (
                blogs.map((blog) => (
                  <tr key={blog.id} className="hover:bg-cream-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="w-16 h-12 bg-cream-200 rounded overflow-hidden">
                        {blog.thumbnail && <img src={blog.thumbnail} alt="thumb" className="w-full h-full object-cover" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-primary-950 mb-1">{blog.judul}</p>
                      <span className="text-xs bg-cream-200 px-2 py-1 rounded">{blog.kategori || 'Uncategorized'}</span>
                    </td>
                    <td className="px-6 py-4 text-xs">{new Date(blog.created_at).toLocaleDateString('id-ID')}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(blog)} className="p-2 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"><FaEdit /></button>
                        <button onClick={() => setConfirmDelete(blog.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded transition-colors"><FaTrash /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete)}
        title="Hapus Artikel"
        message="Yakin ingin menghapus artikel ini?"
        danger
      />

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-cream-100 border border-cream-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-cream-200 flex justify-between items-center sticky top-0 bg-cream-100 z-10">
              <h2 className="text-xl font-bold text-primary-950">{editingId ? 'Edit Artikel' : 'Tambah Artikel'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-primary-600 hover:text-primary-950">✕</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Judul Artikel</label>
                <input required type="text" value={formData.judul} onChange={e => setFormData({...formData, judul: e.target.value})} className="input-field" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Kategori</label>
                  <input type="text" value={formData.kategori} onChange={e => setFormData({...formData, kategori: e.target.value})} className="input-field" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-primary-700 mb-1">Thumbnail (Opsional jika edit)</label>
                  <input type="file" accept="image/*" onChange={e => setFormData({...formData, thumbnail: e.target.files[0]})} className="input-field file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-primary-500 file:text-primary-950 text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Meta Deskripsi Singkat</label>
                <textarea rows="2" value={formData.meta_desc} onChange={e => setFormData({...formData, meta_desc: e.target.value})} className="input-field"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-primary-700 mb-1">Konten</label>
                <div className="flex flex-wrap gap-1 mb-2 p-1.5 bg-white border border-cream-200 rounded-lg">
                  {[
                    { tag: 'h2', label: 'H2' },
                    { tag: 'h3', label: 'H3' },
                    { tag: 'p', label: 'P' },
                    { tag: 'b', label: 'B' },
                    { tag: 'i', label: 'I' },
                    { tag: 'ul', label: 'UL' },
                    { tag: 'li', label: 'LI' },
                    { tag: 'a', label: 'Link' },
                    { tag: 'img', label: 'Img' },
                    { tag: 'blockquote', label: 'Quote' },
                  ].map(({ tag, label }) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormData({ ...formData, konten: formData.konten + `<${tag}></${tag}>` })}
                      className="px-2 py-1 text-xs font-mono font-bold text-primary-700 hover:bg-primary-500/10 rounded transition-colors"
                      title={`Insert <${tag}>`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
                <textarea required rows="12" value={formData.konten} onChange={e => setFormData({...formData, konten: e.target.value})} className="input-field font-mono text-sm" placeholder="Tulis konten artikel dengan HTML..."></textarea>
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
