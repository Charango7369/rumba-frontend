// src/components/servicios/ListaServicios.jsx
import { useState, useEffect, useCallback } from "react";
import { obtenerServicios } from "@/services/api";

/** Icono por categoría; si llega una categoría nueva, usa el fallback. */
const ICONOS = { Sonido: "🔊", Iluminación: "💡", Paquetes: "🎉" };

/** Clases de foco reutilizables (accesibilidad por teclado). */
const FOCO =
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-900";

/** Skeleton con la misma forma que la tarjeta real, para evitar saltos de layout. */
function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-neutral-800 bg-neutral-900 p-8">
      <div className="mb-6 h-16 w-16 rounded-full bg-neutral-800" />
      <div className="mb-4 h-6 w-3/4 rounded bg-neutral-800" />
      <div className="mb-2 h-4 w-full rounded bg-neutral-800" />
      <div className="h-4 w-5/6 rounded bg-neutral-800" />
    </div>
  );
}

/** Tarjeta de servicio. onCotizar avisa al formulario qué servicio se eligió. */
function ServicioCard({ servicio, onCotizar }) {
  const nombre = servicio.nombre || servicio.titulo;

  return (
    <article
      className="group flex h-full flex-col rounded-xl border border-neutral-800 bg-neutral-900 p-8
                 shadow-lg motion-safe:transition-colors motion-safe:duration-300
                 hover:border-red-600 hover:shadow-red-900/20 focus-within:border-red-600"
    >
      {/* Icono decorativo */}
      <div
        aria-hidden="true"
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-neutral-800
                   bg-neutral-950 text-3xl motion-safe:transition-transform motion-safe:duration-300
                   group-hover:border-amber-500 motion-safe:group-hover:scale-110"
      >
        {servicio.icono || ICONOS[servicio.categoria] || "🔥"}
      </div>

      <h3 className="mb-3 text-xl font-bold text-white">{nombre}</h3>

      <p className="mb-6 flex-grow leading-relaxed text-neutral-400">
        {servicio.descripcion}
      </p>

      <a
        href="#cotizar"
        onClick={() => onCotizar(nombre)}
        aria-label={`Cotizar ${nombre}`}
        className={`mt-auto inline-flex items-center gap-2 rounded text-sm font-semibold uppercase
                    tracking-wider text-amber-500 motion-safe:transition-colors hover:text-red-500 ${FOCO}`}
      >
        Cotizar ahora <span aria-hidden="true">&rarr;</span>
      </a>
    </article>
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
      const data = await obtenerServicios();
      if (!estaCancelado()) setServicios(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Error al obtener servicios:", err);
      if (!estaCancelado()) setError("Ocurrió un problema al cargar los servicios.");
    } finally {
      if (!estaCancelado()) setCargando(false);
    }
  }, []);

  useEffect(() => {
    let cancelado = false;
    cargarServicios(() => cancelado);
    return () => {
      cancelado = true;
    };
  }, [cargarServicios]);

  const handleCotizar = (nombre) => {
    window.dispatchEvent(new CustomEvent("cotizacion:servicio", { detail: nombre }));
  };

  return (
    <section
      id="servicios"
      aria-labelledby="servicios-titulo"
      className="scroll-mt-20 bg-neutral-950 px-4 py-16 text-neutral-100"
    >
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 text-center">
          <h2
            id="servicios-titulo"
            className="mb-4 text-3xl font-bold uppercase tracking-wide md:text-4xl"
          >
            Nuestros <span className="text-red-600">Servicios</span>
          </h2>
          <div aria-hidden="true" className="mx-auto mb-4 h-1 w-24 rounded-full bg-amber-500" />
          <p className="mx-auto max-w-2xl text-neutral-400">
            Soluciones técnicas integrales para que tu evento sea inolvidable.
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="mx-auto max-w-2xl rounded-lg border border-red-600/50 bg-red-900/20 p-4 text-center text-red-400"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => cargarServicios()}
              className="mt-3 rounded-lg bg-red-600 px-5 py-2 text-sm font-semibold text-white
                         motion-safe:transition-colors hover:bg-red-500
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              Reintentar
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
          <p className="text-center text-neutral-400">
            Pronto publicaremos nuestros servicios. Mientras tanto,{" "}
            <a href="#cotizacion" className="text-amber-500 underline hover:text-red-500">
              cuéntanos qué necesitas
            </a>
            .
          </p>
        )}
      </div>
    </section>
  );
}
