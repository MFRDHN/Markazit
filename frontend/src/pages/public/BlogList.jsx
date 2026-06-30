import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import SEOHelmet from '../../components/common/SEOHelmet';
import { Link } from 'react-router-dom';
import { ScrollReveal } from '../../components/common/ScrollReveal';
import api from '../../services/api';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';

export default function BlogList() {
  const { t, i18n } = useTranslation();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await api.get('/blogs');
        setBlogs(response.data.data);
      } catch (error) {
        console.error("Failed to fetch blogs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  const dateLocale = i18n.language === 'ar' ? 'ar-SA' : i18n.language === 'en' ? 'en-US' : 'id-ID';

  return (
    <>
      <SEOHelmet
        title="pageTitle.blog"
        description={t('blog.description')}
        canonicalPath="/blog"
      />

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <h1 className="sr-only">{t('blog.title')}</h1>
            <TextReveal text={t('blog.title')} className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              {t('blog.subtitle')}
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-16 md:py-20 lg:py-24 bg-cream-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <HoverCard key={blog.id} delay={index * 0.1}>
                  <article><Link to={`/blog/${blog.slug}`} className="block h-full bg-white group">
                    <div className="aspect-[16/10] bg-cream-50 relative overflow-hidden">
                      {blog.thumbnail ? (
                        <img src={blog.thumbnail} alt={blog.judul} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary-500 text-4xl font-bold bg-cream-100">M</div>
                      )}
                      {blog.kategori && (
                        <div className="absolute top-4 left-4 bg-primary-500 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {blog.kategori}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-primary-600 mb-3">{new Date(blog.created_at).toLocaleDateString(dateLocale, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <h2 className="text-xl font-bold text-primary-950 mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">{blog.judul}</h2>
                      <p className="text-primary-700 text-sm line-clamp-3 mb-4">{blog.meta_desc || t('blog.meta_fallback')}</p>
                      <span className="text-primary-400 text-sm font-medium">{t('blog.baca_artikel')}</span>
                    </div>
                  </Link></article>
                </HoverCard>
              ))}
            </div>
          ) : (
            <div className="text-center text-primary-600 py-12">{t('blog.empty')}</div>
          )}
        </div>
      </section>
    </>
  );
}
