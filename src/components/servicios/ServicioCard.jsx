// src/components/servicios/ServicioCard.jsx
import { resolveMediaUrl } from '../../services/api';

export default function ServicioCard({ servicio, onCotizar }) {
  const tieneDescuento =
    servicio.precio_promocional && Number(servicio.precio_promocional) < Number(servicio.precio_base);
  const precioFinal = tieneDescuento ? servicio.precio_promocional : servicio.precio_base;

  const urlImagen = resolveMediaUrl(
    servicio.imagen_principal ||
      'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80'
  );

  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-neutral-800 bg-neutral-900/90 overflow-hidden shadow-xl motion-safe:transition-all motion-safe:duration-500 hover:border-red-500/60 hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] focus-within:border-red-500">
      {/* 1. Encabezado con imagen real de la base de datos */}
      <div className="relative h-56 w-full overflow-hidden bg-neutral-950">
        <img
          src={urlImagen}
          alt={servicio.nombre}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />

        {/* Badge de Categoría */}
        <div className="absolute top-4 left-4">
          <span className="bg-black/70 backdrop-blur-md border border-white/10 text-amber-400 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-lg">
            {servicio.categoria}
          </span>
        </div>

        {/* Badge de Promoción si aplica */}
        {tieneDescuento ? (
          <div className="absolute top-4 right-4">
            <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg animate-pulse">
              Oferta Especial
            </span>
          </div>
        ) : servicio.destacado ? (
          <div className="absolute top-4 right-4">
            <span className="bg-amber-500/90 backdrop-blur-md text-neutral-950 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-md shadow-lg">
              Más Cotizado
            </span>
          </div>
        ) : null}
      </div>

      {/* 2. Cuerpo de la Tarjeta */}
      <div className="flex flex-col flex-grow p-6">
        <h3 className="mb-2 text-2xl font-black text-white group-hover:text-amber-400 transition-colors">
          {servicio.nombre}
        </h3>

        {/* Precio en Vivo (Sin hardcoding) */}
        <div className="mb-4 flex items-baseline gap-2">
          <span className="text-xs uppercase font-bold text-neutral-400">Desde:</span>
          <span className="text-2xl font-black text-amber-400">
            Bs. {Number(precioFinal).toLocaleString()}
          </span>
          {tieneDescuento && (
            <span className="text-sm font-semibold text-neutral-500 line-through">
              Bs. {Number(servicio.precio_base).toLocaleString()}
            </span>
          )}
        </div>

        <p className="mb-5 flex-grow text-sm leading-relaxed text-neutral-300">
          {servicio.descripcion_corta || servicio.descripcion_larga}
        </p>

        {/* Especificaciones Técnicas de BD */}
        {servicio.especificaciones_tecnicas?.length > 0 && (
          <div className="mb-6 space-y-2 border-t border-neutral-800/80 pt-4">
            {servicio.especificaciones_tecnicas.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        )}

        {/* Botón de Cotización */}
        <div className="mt-auto border-t border-neutral-800/80 pt-4 flex items-center justify-between">
          <a
            href="#cotizar"
            onClick={() => onCotizar(servicio.slug || servicio.nombre)}
            aria-label={`Cotizar ${servicio.nombre}`}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-amber-400 hover:text-red-400 group-hover:translate-x-1 transition-all"
          >
            <span>Cotizar este Paquete</span>
            <span aria-hidden="true">&rarr;</span>
          </a>
          <span className="text-[11px] font-semibold text-neutral-400 uppercase">
            Apolo & La Paz
          </span>
        </div>
      </div>
    </article>
  );
}
