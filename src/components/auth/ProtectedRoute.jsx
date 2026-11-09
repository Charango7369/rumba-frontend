// src/components/auth/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requiredPermission = null }) {
  const { usuario, cargando, tienePermiso } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-red-600" />
          <p className="text-sm font-semibold tracking-wider text-neutral-400 uppercase">
            Verificando credenciales RXS...
          </p>
        </div>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  if (requiredPermission && !tienePermiso(requiredPermission)) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-neutral-950 p-6 text-center text-white">
        <div className="max-w-md rounded-2xl border border-red-600/30 bg-red-950/20 p-8 shadow-2xl backdrop-blur-md">
          <h2 className="mb-2 text-2xl font-black uppercase text-red-500">Acceso Restringido</h2>
          <p className="mb-6 text-sm text-neutral-300">
            Tu cuenta no cuenta con el permiso requerido (<code>{requiredPermission}</code>) para operar este módulo.
          </p>
          <a
            href="/admin/dashboard"
            className="inline-block rounded-xl bg-neutral-800 px-6 py-2.5 text-sm font-bold text-white transition-all hover:bg-neutral-700"
          >
            Regresar al Dashboard
          </a>
        </div>
      </div>
    );
  }

  return children;
}
