import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import PublicLayout from './components/common/PublicLayout';
import Home from './pages/public/Home';
import Program from './pages/public/Program';
import Biaya from './pages/public/Biaya';
import KehidupanMadinah from './pages/public/KehidupanMadinah';
import Galeri from './pages/public/Galeri';
import Pendaftaran from './pages/public/Pendaftaran';
import TentangKami from './pages/public/TentangKami';
import BlogList from './pages/public/BlogList';
import BlogDetail from './pages/public/BlogDetail';
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import KelolaPendaftar from './pages/admin/KelolaPendaftar';
import KelolaProgram from './pages/admin/KelolaProgram';
import KelolaGaleri from './pages/admin/KelolaGaleri';
import KelolaTestimoni from './pages/admin/KelolaTestimoni';
import KelolaBlog from './pages/admin/KelolaBlog';

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/program" element={<Program />} />
        <Route path="/biaya" element={<Biaya />} />
        <Route path="/kehidupan-madinah" element={<KehidupanMadinah />} />
        <Route path="/galeri" element={<Galeri />} />
        <Route path="/pendaftaran" element={<Pendaftaran />} />
        <Route path="/tentang-kami" element={<TentangKami />} />
        <Route path="/blog" element={<BlogList />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="pendaftar" element={<KelolaPendaftar />} />
        <Route path="program" element={<KelolaProgram />} />
        <Route path="galeri" element={<KelolaGaleri />} />
        <Route path="testimoni" element={<KelolaTestimoni />} />
        <Route path="blog" element={<KelolaBlog />} />
      </Route>
    </Routes>
  );
}

export default App;
