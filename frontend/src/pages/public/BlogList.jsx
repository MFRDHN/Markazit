import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ScrollReveal, StaggerContainer, StaggerItem } from '../../components/common/ScrollReveal';
import api from '../../services/api';
import { TextReveal } from '../../components/common/TextReveal';
import { HoverCard } from '../../components/common/HoverCard';

export default function BlogList() {
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

  return (
    <>
      <Helmet>
        <title>Blog & Artikel - Markaz IT Madinah</title>
      </Helmet>

      {/* Header */}
      <section className="pt-32 pb-24 bg-primary-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-islamic-pattern opacity-5 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <ScrollReveal direction="up">
            <TextReveal text="Blog & Artikel" className="text-4xl md:text-5xl font-display font-bold text-white mb-6 justify-center drop-shadow-md" />
            <p className="text-lg text-cream-100 max-w-2xl mx-auto text-balance opacity-90">
              Kumpulan informasi, tips beasiswa, dan kisah inspiratif seputar kehidupan di Madinah.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-24 bg-cream-100 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
             <div className="flex justify-center"><div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div></div>
          ) : blogs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog, index) => (
                <HoverCard key={blog.id} delay={index * 0.1}>
                  <Link to={`/blog/${blog.slug}`} className="block h-full bg-white group">
                    <div className="aspect-[16/10] bg-cream-50 relative overflow-hidden">
                      {blog.thumbnail ? (
                        <img src={blog.thumbnail} alt={blog.judul} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-primary-500 text-4xl font-bold bg-cream-100">M</div>
                      )}
                      {blog.kategori && (
                        <div className="absolute top-4 left-4 bg-primary-500 text-primary-950 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                          {blog.kategori}
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <p className="text-xs text-primary-600 mb-3">{new Date(blog.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      <h2 className="text-xl font-bold text-primary-950 mb-3 line-clamp-2 group-hover:text-primary-400 transition-colors">{blog.judul}</h2>
                      <p className="text-primary-700 text-sm line-clamp-3 mb-4">{blog.meta_desc || 'Baca selengkapnya artikel ini di halaman detail.'}</p>
                      <span className="text-primary-400 text-sm font-medium">Baca Artikel →</span>
                    </div>
                  </Link>
                </HoverCard>
              ))}
            </div>
          ) : (
            <div className="text-center text-primary-600 py-12">Belum ada artikel.</div>
          )}
        </div>
      </section>
    </>
  );
}
