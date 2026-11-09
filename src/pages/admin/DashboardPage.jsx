// src/pages/admin/DashboardPage.jsx
import { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Layers, FileSpreadsheet, CheckCircle, Clock, DollarSign, TrendingUp, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const [metricas, setMetricas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelado = false;
    const fetchMetricas = async () => {
      try {
        const data = await api.getDashboardMetrics();
        if (!cancelado) setMetricas(data);
      } catch (err) {
        if (!cancelado) setError('Error al cargar métricas operativas.');
      } finally {
        if (!cancelado) setCargando(false);
      }
    };
    fetchMetricas();
    return () => { cancelado = true; };
  }, []);

  if (cargando) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-red-600" />
      </div>
    );
  }

  if (error || !metricas) {
    return (
      <div className="p-6 rounded-2xl border border-red-500/30 bg-red-950/20 text-red-400">
        <p>{error || 'No se pudieron recuperar las métricas.'}</p>
      </div>
    );
  }

  const { catalogo, cotizaciones, ultimas_solicitudes } = metricas;

  return (
    <div className="space-y-8">
      {/* Cabecera del Dashboard */}
      <div>
        <h2 className="text-3xl font-black uppercase tracking-tight text-white">
          Resumen Ejecutivo
        </h2>
        <p className="text-sm text-neutral-400">
          Estado en tiempo real de servicios, cotizaciones y conversión económica.
        </p>
      </div>

      {/* Grid de Tarjetas KPI */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Servicios */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Servicios Catálogo</p>
            <h3 className="mt-2 text-3xl font-black text-white">{catalogo.total}</h3>
            <p className="mt-1 text-xs text-emerald-400 font-semibold">{catalogo.activos} activos • {catalogo.destacados} destacados</p>
          </div>
          <div className="p-3.5 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Cotizaciones Pendientes */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Por Atender (Pendientes)</p>
            <h3 className="mt-2 text-3xl font-black text-amber-400">{cotizaciones.pendientes}</h3>
            <p className="mt-1 text-xs text-neutral-400 font-semibold">De {cotizaciones.total} solicitudes totales</p>
          </div>
          <div className="p-3.5 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* Cotizaciones Confirmadas */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Confirmadas / Cerradas</p>
            <h3 className="mt-2 text-3xl font-black text-emerald-400">{cotizaciones.confirmadas}</h3>
            <p className="mt-1 text-xs text-neutral-400 font-semibold">{cotizaciones.contactadas} en seguimiento</p>
          </div>
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* Volumen Estimado en Bolivianos */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-xl flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-neutral-400">Volumen Estimado</p>
            <h3 className="mt-2 text-2xl font-black text-white">
              Bs. {Number(cotizaciones.volumen_estimado_bob).toLocaleString()}
            </h3>
            <p className="mt-1 text-xs text-amber-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> En cotizaciones activas
            </p>
          </div>
          <div className="p-3.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/30">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Tabla de Solicitudes Recientes */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black uppercase tracking-wider text-white">
              Últimas Solicitudes Ingresadas
            </h3>
            <p className="text-xs text-neutral-400">Clientes que cotizaron en la plataforma</p>
          </div>
          <Link
            to="/admin/cotizaciones"
            className="px-4 py-2 rounded-xl border border-neutral-700 bg-neutral-800 text-xs font-bold uppercase text-white hover:bg-neutral-700 transition-colors"
          >
            Ver Todas las Solicitudes
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-300">
            <thead className="bg-neutral-950 text-xs font-bold uppercase text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Teléfono</th>
                <th className="py-3 px-4">Paquete</th>
                <th className="py-3 px-4">Fecha Evento</th>
                <th className="py-3 px-4">Estimado</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-right">Contacto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800">
              {ultimas_solicitudes.map((item) => (
                <tr key={item.id} className="hover:bg-neutral-800/50 transition-colors">
                  <td className="py-3 px-4 font-mono text-xs text-neutral-400">{item.codigo}</td>
                  <td className="py-3 px-4 font-bold text-white">{item.cliente}</td>
                  <td className="py-3 px-4 font-mono text-xs">{item.telefono}</td>
                  <td className="py-3 px-4 text-xs font-semibold text-neutral-200">{item.paquete}</td>
                  <td className="py-3 px-4 text-xs font-mono">{item.fecha}</td>
                  <td className="py-3 px-4 font-black text-amber-400">Bs. {item.total_bob.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        item.estado === 'Pendiente'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                          : item.estado === 'Confirmada'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-neutral-800 text-neutral-400'
                      }`}
                    >
                      {item.estado}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={`https://wa.me/591${item.telefono}?text=Hola%20${encodeURIComponent(item.cliente)}%2C%20te%20escribimos%20de%20Rumba%20X%20Siempre%20por%20tu%20cotizaci%C3%B3n%20${item.codigo}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#25D366]/20 border border-[#25D366]/40 text-[#25D366] text-xs font-bold uppercase hover:bg-[#25D366] hover:text-neutral-950 transition-all"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
