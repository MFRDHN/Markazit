import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';
import { TextReveal } from '../../components/common/TextReveal';
import api from '../../services/api';

export default function Galeri() {
  const { t } = useTranslation();
  const [galleries, setGalleries] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});

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

  const defaultCats = ['Masjid', 'Kegiatan', 'Fasilitas'];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const catRes = await api.get('/gallery/categories');
        setCategories(catRes.data.data.length > 0 ? catRes.data.data : defaultCats);

        const query = activeCategory === 'all' ? '' : `?kategori=${activeCategory}`;
        const res = await api.get(`/gallery${query}`);
        setGalleries(res.data.data.length > 0 ? res.data.data : defaultGalleries.filter(g => activeCategory === 'all' || g.kategori === activeCategory));
      } catch (error) {
        setCategories(defaultCats);
        setGalleries(defaultGalleries.filter(g => activeCategory === 'all' || g.kategori === activeCategory));
      }
      setLoading(false);
    };
    fetchData();
  }, [activeCategory]);

  const slides = galleries.map(g => ({ src: g.foto, description: g.judul }));

  return (
    <>
      <SEOHelmet
        title="pageTitle.galeri"
        description={t('galeri.description')}
        canonicalPath="/galeri"
      />

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('galeri.title')}</h1>
            <TextReveal text={t('galeri.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('galeri.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 bg-cream-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Category Filter */}
          <ScrollReveal className="flex flex-wrap justify-center gap-3 mb-12">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === 'all' ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white text-primary-700 hover:text-primary-950 hover:bg-cream-200'
              }`}
            >
              {t('galeri.semua_foto')}
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30' : 'bg-white text-primary-700 hover:text-primary-950 hover:bg-cream-200'
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
                <StaggerItem key={item.id} className="relative group overflow-hidden rounded-2xl aspect-[4/3]">
                  <div
                    onClick={() => { setPhotoIndex(index); setIsOpen(true); }}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPhotoIndex(index); setIsOpen(true); } }}
                    role="button"
                    tabIndex={0}
                    aria-label={t('galeri.open_gallery', { judul: item.judul })}
                    className="w-full h-full cursor-pointer"
                  >
                    <div className={`absolute inset-0 bg-white animate-pulse ${loadedImages[item.id] ? 'opacity-0' : ''}`} />
                    <img
                      src={item.foto}
                      alt={item.judul}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                      loading="lazy"
                      onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                      onError={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                    <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                      <span className="text-gold-400 text-[10px] font-bold uppercase tracking-wider mb-1 block">{item.kategori}</span>
                      <h3 className="text-white font-bold text-sm md:text-base">{item.judul}</h3>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          )}

          {galleries.length === 0 && !loading && (
            <div className="text-center py-20 text-primary-600">
              {t('galeri.no_photos')}
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
