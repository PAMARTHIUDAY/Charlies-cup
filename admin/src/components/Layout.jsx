import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
  const [open, setOpen] = useState(false);
  const nav = useNavigate();

  const logout = () => {
    localStorage.removeItem('cc_token');
    nav('/login');
  };

  const links = [
    { to: '/', label: '📊 Dashboard' },
    { to: '/orders', label: '📦 Orders' },
    { to: '/products', label: '🍫 Products' },
    { to: '/coupons', label: '🎟️ Coupons' },
  ];

  return (
    <div className="flex min-h-screen relative">
      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-card border-b border-coral/20 px-4 py-3 flex justify-between items-center">
        <div className="text-2xl font-script text-coral">Charlie's Cup</div>
        <button
          onClick={() => setOpen(!open)}
          className="text-2xl text-cream"
        >
          ☰
        </button>
      </div>

      {/* Overlay when drawer open on mobile */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 z-30"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static inset-y-0 left-0 z-40
          w-64 bg-card border-r border-coral/20 p-6 flex flex-col
          transform transition-transform duration-200
          ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="mb-10">
          <div className="text-4xl font-script text-coral">Charlie's Cup</div>
          <div className="text-xs text-cream/60 mt-1">Admin Panel</div>
        </div>
        <nav className="space-y-2 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl transition ${
                  isActive
                    ? 'bg-coral text-white'
                    : 'hover:bg-coral/10 text-cream'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={logout}
          className="mt-6 px-4 py-3 rounded-xl bg-card border border-coral/40 text-coral hover:bg-coral/10"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 md:p-8 mt-14 md:mt-0 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}
