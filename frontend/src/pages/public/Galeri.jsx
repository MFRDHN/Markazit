import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';
import { TextReveal } from '../../components/common/TextReveal';
import api from '../../services/api';

export default function Galeri() {
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fallback data
  const defaultGalleries = [
    { id: 1, judul: 'Masjid Nabawi', foto: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', kategori: 'Masjid' },
    { id: 2, judul: 'Kelas Coding', foto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', kategori: 'Kegiatan' },
    { id: 3, judul: 'Halaqah Quran', foto: 'https://images.unsplash.com/photo-1563122870-6b0b48a0af09?w=800&q=80', kategori: 'Kegiatan' },
    { id: 4, judul: 'Asrama Santri', foto: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', kategori: 'Fasilitas' },
    { id: 5, judul: 'Perpustakaan', foto: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80', kategori: 'Fasilitas' },
    { id: 6, judul: 'Umrah Bersama', foto: 'https://images.unsplash.com/photo-1565552643983-6592233f21ed?w=800&q=80', kategori: 'Kegiatan' },
    { id: 7, judul: 'Pemandangan Madinah', foto: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', kategori: 'Masjid' },
    { id: 8, judul: 'Ujian Akhir', foto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', kategori: 'Kegiatan' },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await api.get('/gallery/categories');
        setCategories(catRes.data.data.length > 0 ? catRes.data.data : ['Masjid', 'Kegiatan', 'Fasilitas']);

        const query = activeCategory === 'all' ? '' : `?kategori=${activeCategory}`;
        const res = await api.get(`/gallery${query}`);
        setGalleries(res.data.data.length > 0 ? res.data.data : defaultGalleries.filter(g => activeCategory === 'all' || g.kategori === activeCategory));
      } catch (error) {
        setCategories(['Masjid', 'Kegiatan', 'Fasilitas']);
        setGalleries(defaultGalleries.filter(g => activeCategory === 'all' || g.kategori === activeCategory));
      }
      setLoading(false);
    };
    fetchData();
  }, [activeCategory]);

  const slides = galleries.map(g => ({ src: g.foto, description: g.judul }));

  return (
    <>
      <Helmet>
        <title>Galeri - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Galeri Dokumentasi" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Rekam jejak dan momen berharga kegiatan santri Markaz IT Madinah.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-cream-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter */}
          <ScrollReveal className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all' ? 'bg-primary-500 text-primary-950 shadow-lg shadow-primary-500/30' : 'bg-white text-primary-700 hover:text-primary-950 hover:bg-cream-200'
              }`}
            >
              Semua Foto
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-primary-500 text-primary-950 shadow-lg shadow-primary-500/30' : 'bg-white text-primary-700 hover:text-primary-950 hover:bg-cream-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </ScrollReveal>

          {/* Grid */}
          {loading ? (
             <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : (
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {galleries.map((item, index) => (
                <StaggerItem key={item.id} className="relative group overflow-hidden rounded-2xl aspect-[4/3] cursor-pointer">
                  <div onClick={() => { setPhotoIndex(index); setIsOpen(true); }} className="w-full h-full">
                    <div className="absolute inset-0 bg-white animate-pulse" />
                    <img
                      src={item.foto}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <span className="text-primary-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">{item.kategori}</span>
                      <h3 className="text-primary-950 font-bold text-sm md:text-base">{item.judul}</h3>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {galleries.length === 0 && !loading && (
            <div className="text-center py-20 text-primary-600">
              Tidak ada foto untuk kategori ini.
            </div>
          )}
        </div>
      </section>

      <Lightbox
        open={isOpen}
        close={() => setIsOpen(false)}
        index={photoIndex}
        slides={slides}
      />
    </>
  );
}
