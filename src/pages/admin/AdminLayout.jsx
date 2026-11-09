// src/pages/admin/AdminLayout.jsx
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Layers,
  FileSpreadsheet,
  Users,
  ShieldCheck,
  LogOut,
  ExternalLink,
  Sliders,
} from 'lucide-react';

export default function AdminLayout() {
  const { usuario, logout, tienePermiso, esSuperAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    {
      to: '/admin/dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      show: tienePermiso('dashboard:view'),
    },
    {
      to: '/admin/catalogo',
      label: 'Catálogo & Precios',
      icon: Layers,
      show: tienePermiso('catalog:read'),
    },
    {
      to: '/admin/cotizaciones',
      label: 'Solicitudes / Leads',
      icon: FileSpreadsheet,
      show: tienePermiso('quotes:read'),
    },
    {
      to: '/admin/usuarios',
      label: 'Usuarios & Roles',
      icon: Users,
      show: esSuperAdmin(),
    },
    {
      to: '/admin/auditoria',
      label: 'Auditoría Forense',
      icon: ShieldCheck,
      show: esSuperAdmin(),
    },
  ];

  const rolBadge = usuario?.roles?.[0]?.nombre || usuario?.rol || 'Operador';

  return (
    <div className="flex min-h-screen bg-neutral-950 font-sans text-neutral-100">
      {/* Sidebar Fijo */}
      <aside className="w-64 border-r border-neutral-800 bg-neutral-900/90 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-neutral-800">
            <Link to="/" className="group flex items-center gap-2">
              <span className="text-2xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">
                RXS Admin
              </span>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 bg-neutral-800 px-2 py-0.5 rounded">
                SaaS
              </span>
            </Link>
          </div>

          {/* Menú de Navegación Basado en Permisos */}
          <nav className="p-4 space-y-1.5">
            {navItems.filter((i) => i.show).map((item) => {
              const Icon = item.icon;
              const activo = location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all duration-200 ${
                    activo
                      ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-600/30'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  }`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Pie del Sidebar: Info de Usuario y Salir */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/60">
          <div className="mb-3 px-2">
            <p className="text-sm font-bold text-white truncate">{usuario?.nombre}</p>
            <div className="flex items-center justify-between mt-1">
              <span className="text-[11px] font-mono text-neutral-400 truncate">{usuario?.email}</span>
              <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                {rolBadge}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Link
              to="/"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-neutral-800 text-xs font-semibold text-neutral-300 hover:text-white hover:bg-neutral-800 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Ver Web</span>
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-red-950/40 border border-red-800/40 text-xs font-semibold text-red-400 hover:bg-red-900/50 hover:text-red-200 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Salir</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Área Principal de Contenido */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-neutral-800 bg-neutral-900/40 px-8 flex items-center justify-between">
          <h1 className="text-lg font-bold text-neutral-200">
            Panel de Operaciones & Administración Comercial
          </h1>
          <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sistema Conectado • PostgreSQL Activo</span>
          </div>
        </header>

        <div className="p-8 flex-1">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
