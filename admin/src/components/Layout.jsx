import { NavLink, Outlet, useNavigate } from 'react-router-dom';

export default function Layout() {
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
    <div className="flex min-h-screen">
      <aside className="w-64 bg-card border-r border-coral/20 p-6 flex flex-col">
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
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
