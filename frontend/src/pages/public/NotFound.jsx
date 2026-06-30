import { Link } from 'react-router-dom';
import SEOHelmet from '../../components/common/SEOHelmet';

export default function NotFound() {
  return (
    <>
      <SEOHelmet title="pageTitle.notFound" description="404 - Halaman yang Anda cari tidak ditemukan." noIndex />
      <section className="min-h-screen pt-32 pb-24 flex items-center justify-center bg-cream-50">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-8xl font-bold text-primary-950 mb-4">404</h1>
          <p className="text-xl text-primary-700 mb-8">Halaman yang Anda cari tidak ditemukan.</p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2 px-8 py-3">
            Kembali ke Beranda
          </Link>
        </div>
      </section>
    </>
  );
}
