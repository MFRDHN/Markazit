import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const navItems = [
  { to: '/dashboard', label: 'Ringkasan', icon: '📊', end: true },
  { to: '/dashboard/data', label: 'Data Diri', icon: '📋' },
  { to: '/dashboard/pembayaran', label: 'Pembayaran', icon: '💰' },
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
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform lg:static lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b px-6 py-4">
          <h2 className="text-lg font-bold text-emerald-700">Dashboard</h2>
          <button className="lg:hidden text-gray-500 text-2xl" onClick={() => setSidebarOpen(false)}>✕</button>
        </div>

        <div className="border-b px-6 py-3">
          <p className="text-sm font-medium text-gray-800">{user?.name || 'User'}</p>
          <p className="text-xs text-gray-500">{user?.email || ''}</p>
        </div>

        <nav className="mt-4 space-y-1 px-3">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-3 right-3 px-3">
          <button
            onClick={handleLogout}
            className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Overlay mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <main className="flex-1 px-4 py-6 lg:px-8">
        {/* Mobile toggle */}
        <button
          className="mb-4 rounded-lg bg-white p-2 shadow lg:hidden"
          onClick={() => setSidebarOpen(true)}
        >
          ☰ Menu
        </button>

        <Outlet />
      </main>
    </div>
  );
}
