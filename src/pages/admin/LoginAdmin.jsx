// src/pages/admin/LoginAdmin.jsx
import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';

export default function LoginAdmin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);

  const from = location.state?.from?.pathname || '/admin/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setCargando(true);

    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Error de login:', err);
      setError(err.message || 'Credenciales de acceso inválidas.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 font-sans text-white">
      {/* Fondo con resplandores */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-red-600/15 blur-[130px] rounded-full" />
      </div>

      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="text-center mb-8">
          <span className="text-xs uppercase font-extrabold tracking-widest text-amber-500 bg-amber-500/10 px-3.5 py-1 rounded-full border border-amber-500/30">
            Seguridad & RBAC
          </span>
          <h2 className="mt-4 text-3xl font-black uppercase tracking-tight text-white">
            Rumba X Siempre
          </h2>
          <p className="mt-1 text-sm text-neutral-400">
            Ingreso al Sistema de Control & Catálogo
          </p>
        </div>

        {error && (
          <div role="alert" className="mb-6 flex items-start gap-3 rounded-xl border border-red-500/40 bg-red-950/40 p-4 text-sm text-red-300">
            <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@rumbaporsiempre.com"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full rounded-xl border border-neutral-700 bg-neutral-950/80 pl-12 pr-4 py-3 text-sm text-white placeholder-neutral-500 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/30 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 via-red-500 to-amber-500 py-3.5 text-sm font-extrabold uppercase tracking-wider text-white shadow-lg shadow-red-600/30 hover:brightness-110 active:scale-[0.99] disabled:opacity-60 transition-all"
          >
            {cargando ? (
              <span className="h-5 w-5 animate-spin rounded-full border-b-2 border-white" />
            ) : (
              <>
                <span>Iniciar Sesión</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-neutral-800/80 pt-4 text-center">
          <a
            href="/"
            className="text-xs font-semibold text-neutral-400 hover:text-amber-400 transition-colors uppercase tracking-wider"
          >
            &larr; Volver al sitio público
          </a>
        </div>
      </div>
    </div>
  );
}
