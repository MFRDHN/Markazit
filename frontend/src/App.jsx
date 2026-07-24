import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PublicLayout from './components/common/PublicLayout';
import AdminLayout from './components/admin/AdminLayout';
import DashboardLayout from './pages/dashboard/DashboardLayout';
import LoadingScreen from './components/common/LoadingScreen';

// Lazy-loaded pages — each becomes a separate chunk
const Home = lazy(() => import('./pages/public/Home'));
const Program = lazy(() => import('./pages/public/Program'));
const Biaya = lazy(() => import('./pages/public/Biaya'));
const KehidupanMadinah = lazy(() => import('./pages/public/KehidupanMadinah'));
const Galeri = lazy(() => import('./pages/public/Galeri'));
const Pendaftaran = lazy(() => import('./pages/public/Pendaftaran'));
const LanjutkanPembayaran = lazy(() => import('./pages/public/LanjutkanPembayaran'));
const TentangKami = lazy(() => import('./pages/public/TentangKami'));
const BlogList = lazy(() => import('./pages/public/BlogList'));
const BlogDetail = lazy(() => import('./pages/public/BlogDetail'));
const NotFound = lazy(() => import('./pages/public/NotFound'));
const Login = lazy(() => import('./pages/public/Login'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const DashboardHome = lazy(() => import('./pages/dashboard/DashboardHome'));
const DataDiri = lazy(() => import('./pages/dashboard/DataDiri'));
const Pembayaran = lazy(() => import('./pages/dashboard/Pembayaran'));
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const KelolaPendaftar = lazy(() => import('./pages/admin/KelolaPendaftar'));
const KelolaProgram = lazy(() => import('./pages/admin/KelolaProgram'));
const KelolaGaleri = lazy(() => import('./pages/admin/KelolaGaleri'));
const KelolaTestimoni = lazy(() => import('./pages/admin/KelolaTestimoni'));
const KelolaBlog = lazy(() => import('./pages/admin/KelolaBlog'));

function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/program" element={<Program />} />
          <Route path="/biaya" element={<Biaya />} />
          <Route path="/kehidupan-madinah" element={<KehidupanMadinah />} />
          <Route path="/galeri" element={<Galeri />} />
          <Route path="/pendaftaran" element={<Pendaftaran />} />
          <Route path="/lanjutkan-pembayaran" element={<LanjutkanPembayaran />} />
          <Route path="/login" element={<Login />} />
          <Route path="/tentang-kami" element={<TentangKami />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* User Dashboard Routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="data" element={<DataDiri />} />
          <Route path="pembayaran" element={<Pembayaran />} />
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
    </Suspense>
  );
}

export default App;
