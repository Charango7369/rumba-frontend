// src/components/ListaServicios.jsx
import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import ServicioCard from './servicios/ServicioCard';

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-neutral-800 bg-neutral-900 overflow-hidden flex flex-col">
      <div className="h-56 w-full bg-neutral-800" />
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4 h-6 w-3/4 rounded bg-neutral-800" />
        <div className="mb-4 h-5 w-1/3 rounded bg-neutral-800" />
        <div className="mb-2 h-4 w-full rounded bg-neutral-800" />
        <div className="mb-6 h-4 w-5/6 rounded bg-neutral-800" />
        <div className="mt-auto h-8 w-1/2 rounded bg-neutral-800" />
      </div>
    </div>
  );
}

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargarServicios = useCallback(async (estaCancelado = () => false) => {
    setCargando(true);
    setError(null);
    try {
      // Consume el nuevo endpoint v1 dinámico
      const data = await api.obtenerServicios();
      // Filtrar servicios principales (los extras van al cotizador)
      const principales = Array.isArray(data) ? data.filter((s) => !s.es_extra) : [];
      if (!estaCancelado()) setServicios(principales);
    } catch (err) {
      console.error('Error al obtener servicios:', err);
      if (!estaCancelado()) setError('Ocurrió un problema al cargar los servicios.');
    } finally {
      if (!estaCancelado()) setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    cargarServicios(() => cancelado);
    return () => { cancelado = true; };
  }, [cargarServicios]);

  const handleCotizar = (slugONombre) => {
    window.dispatchEvent(new CustomEvent('cotizacion:servicio', { detail: slugONombre }));
  };

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="scroll-mt-20 bg-neutral-950 px-4 sm:px-6 lg:px-8 py-20 text-neutral-100 border-t border-neutral-900"
    >
      <div className="container mx-auto max-w-7xl">
        <div className="mb-14 text-center">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs sm:text-sm bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Ingeniería de Escenario
          </span>
          <h2
            id="servicios-titulo"
            className="mt-4 mb-4 text-3xl sm:text-5xl font-black uppercase tracking-tight"
          >
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Servicios Pro</span>
          </h2>
          <div aria-hidden="true" className="mx-auto mb-4 h-1 w-24 rounded-full bg-gradient-to-r from-red-600 to-amber-500" />
          <p className="mx-auto max-w-2xl text-neutral-400 text-base sm:text-lg">
            Soluciones técnicas integrales diseñadas para garantizar potencia, nitidez acústica e impacto visual en cada minuto de tu evento.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-auto max-w-2xl rounded-xl border border-red-600/50 bg-red-950/30 p-6 text-center text-red-400 shadow-xl"
          >
            <p className="font-medium">{error}</p>
            <button
              type="button"
              onClick={() => cargarServicios()}
              className="mt-4 rounded-xl bg-gradient-to-r from-red-600 to-red-500 px-6 py-2.5 text-sm font-bold text-white hover:brightness-110 shadow-lg shadow-red-600/30"
            >
              Reintentar Carga
            </button>
          </div>
        )}

        {cargando && (
          <div
            aria-busy="true"
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            <span className="sr-only" role="status">Cargando servicios…</span>
            {[1, 2, 3].map((n) => (
              <SkeletonCard key={n} />
            ))}
          </div>
        )}

        {!cargando && !error && servicios.length > 0 && (
          <ul className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => (
              <li key={servicio.id}>
                <ServicioCard servicio={servicio} onCotizar={handleCotizar} />
              </li>
            ))}
          </ul>
        )}

        {!cargando && !error && servicios.length === 0 && (
          <div className="text-center py-12 bg-neutral-900/50 border border-neutral-800 rounded-2xl max-w-2xl mx-auto p-8">
            <p className="text-neutral-400 text-lg mb-4">
              Pronto publicaremos el catálogo completo de nuestros servicios.
            </p>
            <a
              href="#cotizar"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white font-bold uppercase tracking-wider text-sm shadow-lg shadow-red-600/30 hover:brightness-110 transition-all"
            >
              Cotizar Requerimiento Personalizado
            </a>
          </div>
        )}
      </div>
    </section>
  );
}
