// src/pages/admin/AuditoriaAdminPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Search, Eye, Filter, X } from 'lucide-react';

export default function AuditoriaAdminPage() {
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [detalleLog, setDetalleLog] = useState(null);

  const [accionFiltro, setAccionFiltro] = useState('');
  const [recursoFiltro, setRecursoFiltro] = useState('');

  const cargarLogs = useCallback(async () => {
    setCargando(true);
    try {
      const params = new URLSearchParams();
      if (accionFiltro) params.append('accion', accionFiltro);
      if (recursoFiltro) params.append('recurso', recursoFiltro);
      params.append('limit', '100');

      const data = await api.getAdminAuditoria(params.toString());
      setLogs(Array.isArray(data) ? data : []);
    } catch (err) {
      alert('Error al cargar auditoría: ' + err.message);
    } finally {
      setCargando(false);
    }
  }, [accionFiltro, recursoFiltro]);

  useEffect(() => {
    cargarLogs();
  }, [cargarLogs]);

  // Bloqueo de scroll de fondo y tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setDetalleLog(null);
    };
    if (detalleLog) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [detalleLog]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Auditoría Forense & Trazabilidad
          </h2>
          <p className="text-sm text-neutral-400">
            Registro inmutable de cambios de precios, creaciones, eliminaciones e inicios de sesión.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Filtrar por acción..."
            value={accionFiltro}
            onChange={(e) => setAccionFiltro(e.target.value)}
            className="py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500"
          />
          <select
            value={recursoFiltro}
            onChange={(e) => setRecursoFiltro(e.target.value)}
            className="py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white outline-none focus:border-red-500"
          >
            <option value="">Todos los Recursos</option>
            <option value="servicios">Servicios</option>
            <option value="cotizaciones">Cotizaciones</option>
            <option value="usuarios">Usuarios</option>
            <option value="auth">Autenticación</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-2xl">
        <table className="w-full text-left text-sm text-neutral-300">
          <thead className="bg-neutral-950 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
            <tr>
              <th className="py-4 px-4">Fecha & Hora</th>
              <th className="py-4 px-4">Usuario Responsable</th>
              <th className="py-4 px-4">Rol</th>
              <th className="py-4 px-4">Acción Realizada</th>
              <th className="py-4 px-4">Recurso Afectado</th>
              <th className="py-4 px-4">IP Origen</th>
              <th className="py-4 px-4 text-right">Detalle</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {cargando ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-500">
                  Cargando trazabilidad...
                </td>
              </tr>
            ) : logs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-neutral-500">
                  No hay registros de auditoría que coincidan con la búsqueda.
                </td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log.id} className="hover:bg-neutral-800/40 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-neutral-400">
                    {new Date(log.fecha_hora).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 font-bold text-white text-xs">
                    {log.usuario_email}
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-800 border border-neutral-700 text-amber-400">
                      {log.rol_ejecutor}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono text-xs font-bold text-white">
                    {log.accion}
                  </td>
                  <td className="py-3 px-4 text-xs font-semibold text-neutral-300">
                    {log.recurso_afectado} {log.recurso_id ? `#${log.recurso_id}` : ''}
                  </td>
                  <td className="py-3 px-4 font-mono text-xs text-neutral-500">
                    {log.ip}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setDetalleLog(log)}
                      className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white transition-colors"
                      title="Ver valores modificados"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detalleLog && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm p-4 sm:p-6">
          <div className="flex min-h-full items-start justify-center py-6 sm:py-10">
            <div className="w-full max-w-xl rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl relative my-auto">
              <div className="flex items-start justify-between gap-4 pb-3 border-b border-neutral-800 mb-4">
                <div>
                  <h3 className="text-lg font-black uppercase text-white">
                    Detalle de Mutación #{detalleLog.id}
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {detalleLog.accion} sobre {detalleLog.recurso_afectado} por {detalleLog.usuario_email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDetalleLog(null)}
                  className="p-1.5 -mr-1 -mt-1 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors shrink-0"
                  title="Cerrar"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4 font-mono text-xs">
                <div>
                  <p className="font-bold text-neutral-400 font-sans uppercase mb-1">Valores Previos:</p>
                  <pre className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-red-300 overflow-x-auto max-h-60">
                    {detalleLog.valores_previos ? JSON.stringify(detalleLog.valores_previos, null, 2) : 'Ninguno / Creación'}
                  </pre>
                </div>

                <div>
                  <p className="font-bold text-neutral-400 font-sans uppercase mb-1">Valores Nuevos:</p>
                  <pre className="p-3 rounded-xl bg-neutral-950 border border-neutral-800 text-emerald-300 overflow-x-auto max-h-60">
                    {detalleLog.valores_nuevos ? JSON.stringify(detalleLog.valores_nuevos, null, 2) : 'Ninguno / Eliminación'}
                  </pre>
                </div>
              </div>

              <div className="flex justify-end pt-4 mt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setDetalleLog(null)}
                  className="px-5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-bold uppercase text-white"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
