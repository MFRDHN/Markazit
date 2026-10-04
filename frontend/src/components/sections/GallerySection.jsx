import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import SplitText from '../common/SplitText';
import InteractiveBackground from '../common/InteractiveBackground';
import api from '../../services/api';

// ponytail: 6 per-item skew/blur/rotate variants removed — single fade-up.

export default function GallerySection() {
  const { t } = useTranslation();
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState({});
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

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
      setLoading(true);
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
      setLoading(false);
    };
    fetchGalleries();
  }, []);

  const slides = galleries.map(g => ({ src: g.foto, description: g.judul }));

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream-50 relative overflow-hidden">
      <InteractiveBackground />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SplitText
            text={t('gallery.title')}
            className="section-title mb-4 justify-center"
            tag="h2"
            splitType="chars"
            delay={0.05}
          />
          <SplitText
            text={t('gallery.subtitle')}
            className="section-subtitle justify-center"
            tag="p"
            splitType="words"
            delay={0.12}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: index * 0.06 }}
              className="relative group overflow-hidden rounded-2xl aspect-video"
            >
              <div
                onClick={() => { setPhotoIndex(index); setIsOpen(true); }}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setPhotoIndex(index); setIsOpen(true); } }}
                role="button"
                tabIndex={0}
                aria-label={`Buka galeri: ${item.judul}`}
                className="w-full h-full cursor-pointer"
              >
                <div className={`absolute inset-0 bg-white animate-pulse ${loadedImages[item.id] ? 'opacity-0' : ''}`} />
                <img
                  src={item.foto}
                  alt={item.judul}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 relative z-10"
                  loading="lazy"
                  onLoad={() => setLoadedImages(prev => ({ ...prev, [item.id]: true }))}
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Found'; setLoadedImages(prev => ({ ...prev, [item.id]: true })); }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-950 via-primary-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-6 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300 z-30">
                  <span className="text-gold-400 text-xs font-bold uppercase tracking-wider mb-2 block">{item.kategori}</span>
                  <h3 className="text-white font-bold text-lg">{item.judul}</h3>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

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
