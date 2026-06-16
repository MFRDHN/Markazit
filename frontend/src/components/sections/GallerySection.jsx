import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../common/ScrollReveal';
import { TextReveal } from '../common/TextReveal';
import api from '../../services/api';

export default function GallerySection() {
  const { t } = useTranslation();
  const [galleries, setGalleries] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Fallback data if API fails or is empty
  const defaultGalleries = [
    { id: 1, judul: 'Masjid Nabawi', foto: 'https://images.unsplash.com/photo-1591604129939-f1efa4d9f7fa?w=800&q=80', kategori: 'Masjid' },
    { id: 2, judul: 'Kelas Coding', foto: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&q=80', kategori: 'Kegiatan' },
    { id: 3, judul: 'Halaqah Quran', foto: 'https://images.unsplash.com/photo-1563122870-6b0b48a0af09?w=800&q=80', kategori: 'Kegiatan' },
    { id: 4, judul: 'Asrama Santri', foto: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800&q=80', kategori: 'Fasilitas' },
    { id: 5, judul: 'Perpustakaan', foto: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=800&q=80', kategori: 'Fasilitas' },
    { id: 6, judul: 'Umrah Bersama', foto: 'https://images.unsplash.com/photo-1565552643983-6592233f21ed?w=800&q=80', kategori: 'Kegiatan' },
  ];

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await api.get('/gallery?per_page=6');
        if (response.data.data.length > 0) {
          setGalleries(response.data.data);
        } else {
          setGalleries(defaultGalleries);
        }
      } catch (error) {
        setGalleries(defaultGalleries);
      }
    };
    fetchGalleries();
  }, []);

  const slides = galleries.map(g => ({ src: g.foto, description: g.judul }));

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-multiply pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal className="text-center mb-16">
          <TextReveal text={t('gallery.title')} className="section-title mb-4 justify-center" />
          <p className="section-subtitle">{t('gallery.subtitle')}</p>
        </ScrollReveal>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((item, index) => (
            <StaggerItem key={item.id} className="relative group overflow-hidden rounded-2xl aspect-video cursor-pointer" >
              <div onClick={() => { setPhotoIndex(index); setIsOpen(true); }}>
                <div className="absolute inset-0 bg-white animate-pulse" /> {/* Placeholder loading state */}
                <img
                  src={item.foto}
                  alt={item.judul}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 relative z-10"
                  loading="lazy"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-cream-50 via-cream-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                  <span className="text-primary-400 text-xs font-bold uppercase tracking-wider mb-2 block">{item.kategori}</span>
                  <h3 className="text-primary-950 font-bold text-lg">{item.judul}</h3>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        <Lightbox
          open={isOpen}
          close={() => setIsOpen(false)}
          index={photoIndex}
          slides={slides}
        />
      </div>
    </section>
  );
}
