import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';
import SplitText from '../common/SplitText';
import InteractiveBackground from '../common/InteractiveBackground';
import api from '../../services/api';

export default function TestimonialSection() {
  const { t } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const defaultTestimonials = [
    { id: 1, nama: 'Ahmad Fauzi', asal: 'Jakarta', isi: 'Program di Markaz IT sangat luar biasa. Saya bisa belajar ilmu agama langsung di Masjid Nabawi sekaligus mengembangkan skill programming.', rating: 5 },
    { id: 2, nama: 'Muhammad Rizki', asal: 'Bandung', isi: 'Lingkungan belajar yang sangat kondusif. Para ustadz dan mentor sangat sabar membimbing. Pengalaman terbaik dalam hidup saya.', rating: 5 },
    { id: 3, nama: 'Abdullah Rahman', asal: 'Surabaya', isi: 'Program Halaqah Quran-nya amazing! Dalam setahun saya berhasil menghafal 8 juz dengan tajwid yang benar.', rating: 5 },
  ];

  useEffect(() => {
    const fetchTestimonials = async () => {
      setLoading(true);
      try {
        const response = await api.get('/testimonials');
        if (response.data.data.length > 0) {
          setTestimonials(response.data.data);
        } else {
          setTestimonials(defaultTestimonials);
        }
      } catch (error) {
        setTestimonials(defaultTestimonials);
      }
      setLoading(false);
    };
    fetchTestimonials();
  }, []);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  if (loading) return null;
  if (testimonials.length === 0) return null;

  return (
    <section className="py-16 md:py-20 lg:py-24 bg-cream-50 relative overflow-hidden">
      <InteractiveBackground />
      <div className="absolute right-0 top-0 w-1/3 h-full bg-gradient-to-l from-primary-900/10 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <SplitText
            text={t('testimonials.title')}
            className="section-title mb-4 justify-center"
            tag="h2"
            splitType="chars"
            delay={0.07}
          />
          <SplitText
            text={t('testimonials.subtitle')}
            className="section-subtitle justify-center"
            tag="p"
            splitType="words"
            delay={0.15}
          />
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative min-h-[320px] md:min-h-[260px]">
            {testimonials.map((item, index) => (
              <motion.div
                key={item.id}
                className="absolute inset-0 w-full h-full glass-card p-8 md:p-12 text-center flex flex-col items-center justify-center"
                initial={{ opacity: 0, x: 100 }}
                animate={{ 
                  opacity: index === activeIndex ? 1 : 0, 
                  x: index === activeIndex ? 0 : index < activeIndex ? -100 : 100,
                  pointerEvents: index === activeIndex ? 'auto' : 'none'
                }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
              >
                <FaQuoteLeft className="text-4xl text-primary-500/20 mb-6" />
                <p className="text-lg md:text-xl text-primary-950 font-medium mb-8 leading-relaxed">
                  "{item.isi}"
                </p>
                <div className="flex gap-1 text-gold-400 mb-4">
                  {[...Array(item.rating)].map((_, i) => (
                    <FaStar key={i} />
                  ))}
                </div>
                <div>
                  <h4 className="font-bold text-primary-950 font-display">{item.nama}</h4>
                  <p className="text-primary-600 text-sm">{item.asal}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeIndex ? 'bg-primary-500 w-8' : 'bg-cream-300 hover:bg-dark-400'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
                aria-current={index === activeIndex ? 'true' : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
