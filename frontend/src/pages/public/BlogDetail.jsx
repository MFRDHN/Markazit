import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import api from '../../services/api';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${slug}`);
        setBlog(response.data.data);
      } catch (error) {
        console.error("Failed to fetch blog", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50 text-primary-950">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">404</h1>
          <p className="text-primary-700 mb-6">Artikel tidak ditemukan.</p>
          <Link to="/blog" className="btn-primary">Kembali ke Blog</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{blog.judul} - Markaz IT Madinah</title>
        <meta name="description" content={blog.meta_desc || blog.judul} />
      </Helmet>

      <section className="pt-32 pb-24 bg-cream-100 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="text-primary-400 hover:text-primary-300 text-sm font-medium mb-8 inline-block">
            ← Kembali ke Blog
          </Link>
          
          <div className="mb-8">
            {blog.kategori && (
              <span className="text-primary-500 font-bold text-sm uppercase tracking-wider mb-4 block">
                {blog.kategori}
              </span>
            )}
            <h1 className="text-3xl md:text-5xl font-display font-bold text-primary-950 mb-6 leading-tight">
              {blog.judul}
            </h1>
            <p className="text-primary-600 text-sm">
              Dipublikasikan pada {new Date(blog.created_at).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {blog.thumbnail && (
            <div className="aspect-[21/9] rounded-3xl overflow-hidden mb-12 bg-white">
              <img src={blog.thumbnail} alt={blog.judul} className="w-full h-full object-cover" />
            </div>
          )}

          {/* HTML Content rendering with Prose styles approximation */}
          <div 
            className="prose prose-invert prose-primary max-w-none text-primary-800 leading-loose
              prose-headings:font-display prose-headings:text-primary-950 prose-headings:font-bold
              prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
              prose-p:mb-6 prose-a:text-primary-400 hover:prose-a:text-primary-300
              prose-ul:list-disc prose-ul:pl-6 prose-ul:mb-6 prose-li:mb-2"
            dangerouslySetInnerHTML={{ __html: blog.konten }} 
          />
        </div>
      </section>
    </>
  );
}
