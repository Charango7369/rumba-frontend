// src/pages/admin/UsuariosAdminPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Plus, UserPlus, Shield, Trash2, Key, X } from 'lucide-react';

export default function UsuariosAdminPage() {
  const { usuario: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);

  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rol, setRol] = useState('comercial');

  const cargarUsuarios = useCallback(async () => {
    setCargando(true);
    try {
      const data = await api.getAdminUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (err) {
      alert('Error al cargar usuarios: ' + err.message);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarUsuarios();
  }, [cargarUsuarios]);

  // Bloqueo de scroll de fondo y tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setModalAbierto(false);
    };
    if (modalAbierto) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [modalAbierto]);

  const handleCrearUsuario = async (e) => {
    e.preventDefault();
    try {
      await api.crearUsuario({
        nombre,
        email,
        password,
        roles_codigos: [rol],
        activo: true,
      });
      setModalAbierto(false);
      setNombre('');
      setEmail('');
      setPassword('');
      cargarUsuarios();
    } catch (err) {
      alert('Error al crear usuario: ' + err.message);
    }
  };

  const handleToggleEstado = async (u) => {
    if (u.id === currentUser.id) {
      alert('No puedes desactivar tu propia cuenta.');
      return;
    }
    try {
      await api.actualizarUsuario(u.id, { activo: !u.activo });
      cargarUsuarios();
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleEliminar = async (u) => {
    if (u.id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta.');
      return;
    }
    if (!window.confirm(`¿Eliminar al usuario ${u.nombre}?`)) return;
    try {
      await api.eliminarUsuario(u.id);
      cargarUsuarios();
    } catch (err) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Usuarios del Sistema & Roles
          </h2>
          <p className="text-sm text-neutral-400">
            Administración de cuentas con acceso al panel y asignación de privilegios RBAC.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setModalAbierto(true)}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 font-extrabold uppercase text-xs tracking-wider text-white shadow-lg hover:brightness-110"
        >
          <UserPlus className="w-4 h-4" />
          <span>Nuevo Usuario</span>
        </button>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="bg-neutral-950 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="py-4 px-4">Usuario</th>
              <th className="py-4 px-4">Correo</th>
              <th className="py-4 px-4">Rol Asignado</th>
              <th className="py-4 px-4">Estado</th>
              <th className="py-4 px-4">Último Acceso</th>
              <th className="py-4 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {usuarios.map((u) => {
              const rolCodigo = u.roles?.[0]?.codigo || u.rol || 'comercial';
              return (
                <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-white">{u.nombre}</td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-400">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/30">
                      <Shield className="w-3 h-3" />
                      <span>{rolCodigo}</span>
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      type="button"
                      onClick={() => handleToggleEstado(u)}
                      disabled={u.id === currentUser.id}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        u.activo
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-500 border border-neutral-700'
                      }`}
                    >
                      {u.activo ? 'Activo' : 'Desactivado'}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-500">
                    {u.ultimo_acceso ? new Date(u.ultimo_acceso).toLocaleString() : 'Nunca'}
                  </td>
                  <td className="py-3 px-4 text-right">
                    {u.id !== currentUser.id && (
                      <button
                        type="button"
                        onClick={() => handleEliminar(u)}
                        className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {modalAbierto && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex min-h-full items-start justify-center py-6 sm:py-10">
            <div className="w-full max-w-md rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl relative my-auto">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800 mb-5">
                <h3 className="text-lg font-black uppercase text-white">Crear Cuenta de Acceso</h3>
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  className="p-1.5 -mr-1 -mt-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
                  title="Cerrar ventana"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCrearUsuario} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej. Juan Pérez"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Correo Electrónico</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="operador@rumbaporsiempre.com"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Contraseña Inicial</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">Rol RBAC</label>
                  <select
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                  >
                    <option value="comercial">Operador Comercial (Solo Solicitudes)</option>
                    <option value="admin">Administrador (Gestión de Catálogo y Precios)</option>
                    <option value="superadmin">SuperAdministrador (Acceso Total)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                  <button
                    type="button"
                    onClick={() => setModalAbierto(false)}
                    className="px-4 py-2 rounded-xl text-xs font-bold uppercase text-neutral-400 hover:text-white"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-xs font-bold uppercase text-white shadow-lg hover:brightness-110"
                  >
                    Registrar Usuario
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
