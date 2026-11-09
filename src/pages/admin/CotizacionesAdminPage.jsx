// src/pages/admin/CotizacionesAdminPage.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Phone, Calendar, Users, DollarSign, MessageSquare, Check, X, Search } from 'lucide-react';
import CanAccess from '../../components/auth/CanAccess';

const ESTADOS = ['Pendiente', 'Contactado', 'En Negociación', 'Confirmada', 'Cancelada'];

export default function CotizacionesAdminPage() {
  const { tienePermiso } = useAuth();
  const [cotizaciones, setCotizaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [filtroEstado, setFiltroEstado] = useState('');
  const [busqueda, setBusqueda] = useState('');

  // Modal de Detalle y Gestión
  const [modalAbierto, setModalAbierto] = useState(false);
  const [cotizacionActual, setCotizacionActual] = useState(null);
  const [nuevoEstado, setNuevoEstado] = useState('');
  const [observaciones, setObservaciones] = useState('');

  const cargarCotizaciones = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (filtroEstado) params.append('estado', filtroEstado);
      if (busqueda.trim()) params.append('q', busqueda.trim());

      const data = await api.getAdminCotizaciones(params.toString());
      setCotizaciones(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || 'Error al cargar cotizaciones.');
    } finally {
      setCargando(false);
    }
  }, [filtroEstado, busqueda]);

  useEffect(() => {
    const timer = setTimeout(() => {
      cargarCotizaciones();
    }, 250);
    return () => clearTimeout(timer);
  }, [cargarCotizaciones]);

  const abrirGestion = (cotiz) => {
    setCotizacionActual(cotiz);
    setNuevoEstado(cotiz.estado);
    setObservaciones(cotiz.observaciones || '');
    setModalAbierto(true);
  };

  const handleGuardarGestion = async (e) => {
    e.preventDefault();
    try {
      await api.actualizarEstadoCotizacion(cotizacionActual.id, nuevoEstado, observaciones);
      setModalAbierto(false);
      cargarCotizaciones();
    } catch (err) {
      alert('Error al actualizar cotización: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">
            Solicitudes & Cotizaciones
          </h2>
          <p className="text-sm text-neutral-400">
            Pipeline comercial, seguimiento de leads y contacto directo por WhatsApp.
          </p>
        </div>

        {/* Filtros Rápidos */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por cliente o teléfono..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="pl-9 pr-4 py-2 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white placeholder-neutral-500 outline-none focus:border-red-500 w-64"
            />
          </div>

          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="py-2 px-3 rounded-xl border border-neutral-700 bg-neutral-900 text-xs text-white outline-none focus:border-red-500"
          >
            <option value="">Todos los Estados</option>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl border border-red-500/30 bg-red-950/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Tabla de Cotizaciones */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-4 px-4">Código / Fecha</th>
                <th className="py-4 px-4">Cliente</th>
                <th className="py-4 px-4">Evento / Ciudad</th>
                <th className="py-4 px-4">Paquete & Extras</th>
                <th className="py-4 px-4">Invitados</th>
                <th className="py-4 px-4">Presupuesto</th>
                <th className="py-4 px-4">Estado</th>
                <th className="py-4 px-4 text-right">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {cargando ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    Cargando cotizaciones...
                  </td>
                </tr>
              ) : cotizaciones.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No se encontraron solicitudes con los filtros aplicados.
                  </td>
                </tr>
              ) : (
                cotizaciones.map((c) => (
                  <tr key={c.id} className="hover:bg-neutral-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono text-xs font-bold text-neutral-300">{c.codigo_seguimiento || `RXS-${c.id}`}</p>
                      <p className="text-[11px] text-neutral-500">{new Date(c.timestamp).toLocaleDateString()}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-bold text-white text-base leading-tight">{c.nombre}</p>
                      <p className="font-mono text-xs text-neutral-400 mt-0.5">{c.telefono}</p>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <p className="font-semibold text-neutral-200">{c.tipo_evento}</p>
                      <p className="text-neutral-400">{c.ciudad} • {c.fecha_evento}</p>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      <p className="font-bold text-amber-400 uppercase">{c.paquete}</p>
                      {c.extras?.length > 0 && (
                        <p className="text-[11px] text-neutral-400 truncate max-w-xs">
                          Extras: {c.extras.join(', ')}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs font-mono font-bold text-neutral-300">
                      {c.invitados} pax
                    </td>
                    <td className="py-3 px-4 font-black text-amber-400 text-sm">
                      Bs. {Number(c.total_estimado || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          c.estado === 'Pendiente'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : c.estado === 'Confirmada'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : c.estado === 'Cancelada'
                            ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                            : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                        }`}
                      >
                        {c.estado}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={`https://wa.me/591${c.telefono}?text=Hola%20${encodeURIComponent(c.nombre)}%2C%20un%20gusto%20saludarte%20desde%20Rumba%20X%20Siempre.%20Recibimos%20tu%20solicitud%20para%20tu%20evento%20en%20${encodeURIComponent(c.ciudad)}%20el%20${c.fecha_evento}.`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2 rounded-lg bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-neutral-950 transition-colors"
                          title="Contactar vía WhatsApp"
                        >
                          <Phone className="w-4 h-4" />
                        </a>

                        <button
                          type="button"
                          onClick={() => abrirGestion(c)}
                          className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-xs font-bold text-white transition-colors"
                        >
                          Gestionar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalle y Seguimiento */}
      {modalAbierto && cotizacionActual && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-700 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-lg font-black uppercase text-white mb-1">
              Gestionar Solicitud: {cotizacionActual.codigo_seguimiento || `RXS-${cotizacionActual.id}`}
            </h3>
            <p className="text-xs text-neutral-400 mb-6">
              Cliente: {cotizacionActual.nombre} • Tel: {cotizacionActual.telefono}
            </p>

            <form onSubmit={handleGuardarGestion} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Estado Comercial de la Solicitud
                </label>
                <select
                  value={nuevoEstado}
                  onChange={(e) => setNuevoEstado(e.target.value)}
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                >
                  {ESTADOS.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-neutral-300 mb-1">
                  Observaciones Internas / Notas del Operador
                </label>
                <textarea
                  rows={4}
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Ej. Cliente prefiere pagar 50% de anticipo. Requiere visita técnica previa a la locación en Apolo."
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-sm text-white outline-none focus:border-red-500"
                />
              </div>

              {cotizacionActual.desglose_calculo && (
                <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950 text-xs font-mono space-y-1 text-neutral-300">
                  <p className="font-bold text-amber-400 uppercase font-sans">Desglose de Cotización Automática:</p>
                  <p>Paquete: {cotizacionActual.desglose_calculo.paquete?.nombre} (Bs. {cotizacionActual.desglose_calculo.paquete?.precio_unitario})</p>
                  <p>Excedente Capacidad: Bs. {cotizacionActual.desglose_calculo.capacidad?.costo_adicional}</p>
                  <p>Extras: Bs. {cotizacionActual.desglose_calculo.costo_extras_total}</p>
                  <p className="font-bold text-white pt-1">Total Estimado: Bs. {cotizacionActual.desglose_calculo.total_estimado}</p>
                </div>
              )}

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
                  Actualizar Seguimiento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
