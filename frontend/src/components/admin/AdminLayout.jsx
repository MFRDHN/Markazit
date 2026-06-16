import { useState, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAuthStore } from '../../store';
import { 
  FaHome, FaUsers, FaBook, FaImages, 
  FaQuoteLeft, FaFileAlt, FaSignOutAlt, FaBars, FaTimes 
} from 'react-icons/fa';

export default function AdminLayout() {
  const { isAuthenticated, user, logout, checkAuth } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const initAuth = async () => {
      await checkAuth();
      setLoading(false);
    };
    initAuth();
  }, [checkAuth]);

  // Close sidebar on route change in mobile
  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream-50">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { path: '/admin', icon: FaHome, label: 'Dashboard' },
    { path: '/admin/pendaftar', icon: FaUsers, label: 'Pendaftar' },
    { path: '/admin/program', icon: FaBook, label: 'Program' },
    { path: '/admin/galeri', icon: FaImages, label: 'Galeri' },
    { path: '/admin/testimoni', icon: FaQuoteLeft, label: 'Testimoni' },
    { path: '/admin/blog', icon: FaFileAlt, label: 'Blog & Artikel' },
  ];

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - Markaz IT</title>
      </Helmet>

      <div className="min-h-screen bg-cream-50 flex flex-col md:flex-row">
        
        {/* Mobile Header */}
        <div className="md:hidden bg-cream-100 border-b border-cream-200 flex items-center justify-between p-4 z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center text-primary-950 font-bold text-sm">M</div>
            <span className="font-bold text-primary-950">Admin Panel</span>
          </div>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-primary-950 p-2">
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Sidebar */}
        <aside className={`
          fixed md:sticky top-0 left-0 z-40 w-64 h-screen bg-cream-100 border-r border-cream-200 flex flex-col transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}>
          <div className="p-6 hidden md:flex items-center gap-3 border-b border-cream-200">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-primary-950 font-bold text-lg shadow-lg shadow-primary-500/20">
              M
            </div>
            <div>
              <span className="text-lg font-bold text-primary-950 block">Markaz IT</span>
              <span className="text-xs text-primary-600">Admin Panel</span>
            </div>
          </div>

          <div className="p-4 border-b border-cream-200 md:hidden">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-400">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <p className="text-sm font-medium text-primary-950">{user?.name}</p>
                <p className="text-xs text-primary-600">{user?.email}</p>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <p className="px-3 text-xs font-semibold text-primary-500 uppercase tracking-wider mb-2 mt-4">Menu Utama</p>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path))
                    ? 'bg-primary-500/10 text-primary-400'
                    : 'text-primary-700 hover:bg-white hover:text-primary-950'
                }`}
              >
                <item.icon className={location.pathname === item.path ? 'text-primary-400' : 'text-primary-500'} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-cream-200">
            <div className="hidden md:flex items-center gap-3 mb-4 px-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-primary-400 text-sm font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-medium text-primary-950 truncate">{user?.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-400/10 transition-colors"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 w-full min-w-0 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </>
  );
}
