import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaWallet, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import api from '../../services/api';

const navItems = [
  { to: '/dashboard', label: 'Ringkasan', icon: FaTachometerAlt, end: true },
  { to: '/dashboard/data', label: 'Data Diri', icon: FaUser },
  { to: '/dashboard/pembayaran', label: 'Pembayaran', icon: FaWallet },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const raw = localStorage.getItem('user_data');
    if (raw) {
      try { setUser(JSON.parse(raw)); } catch {}
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.getItem('user_token');
    if (token) {
      api.post('/logout').catch(() => {});
    }
    localStorage.removeItem('user_token');
    localStorage.removeItem('user_data');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-cream-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-cream-200 shadow-lg transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-cream-200 px-6 py-5">
          <h2 className="text-lg font-bold text-primary-950">Dashboard</h2>
          <button className="lg:hidden text-primary-600 hover:text-primary-950" onClick={() => setSidebarOpen(false)}>
            <FaTimes size={20} />
          </button>
        </div>

        <div className="border-b border-cream-200 px-6 py-4">
          <p className="text-sm font-bold text-primary-950">{user?.name || 'User'}</p>
          <p className="text-xs text-primary-600">{user?.email || ''}</p>
        </div>

        <nav className="mt-6 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-primary-500/10 text-primary-400' : 'text-primary-700 hover:bg-primary-900/5 hover:text-primary-950'
                }`
              }
            >
              <item.icon className={({ isActive }) => isActive ? 'text-primary-400' : 'text-primary-500'} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-6 left-3 right-3 px-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 px-4 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-500/20"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 px-4 py-6 lg:px-8">
        {/* Mobile toggle */}
        <button
          className="mb-4 flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-medium text-primary-700 shadow-sm border border-cream-200 lg:hidden hover:bg-cream-100 transition-colors"
          onClick={() => setSidebarOpen(true)}
        >
          <FaBars /> Menu
        </button>

        <Outlet />
      </main>
    </div>
  );
}
