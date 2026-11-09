import { useState } from "react";

const CATEGORIAS = [
  { id: "todos", label: "Todos los Montajes" },
  { id: "conciertos", label: "Festivales & Conciertos" },
  { id: "luces", label: "Iluminación & Láser" },
  { id: "sociales", label: "Bodas & Eventos VIP" },
  { id: "sonido", label: "Sonido Nexo STM" },
];

const MONTAJES = [
  {
    id: 1,
    titulo: "Festival Masivo en Vivo",
    categoria: "conciertos",
    tipo: "video",
    mediaUrl: "https://assets.mixkit.co/videos/48624/48624-720.mp4",
    posterUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Sonorización con torres Nexo STM para más de 5,000 personas e iluminación sincronizada con código de tiempo.",
    equipos: "Nexo STM M46/B112, 24x Beam 7R, Pantalla LED P3.9",
    destacado: true,
  },
  {
    id: 2,
    titulo: "Show de Haces Láser & Robóticas",
    categoria: "luces",
    tipo: "imagen",
    mediaUrl: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Efectos atmosféricos con máquinas de humo Hazer y programación de cabezas móviles sobre truss circular.",
    equipos: "16x Cabezas Móviles Spot/Beam, 4x Láser RGB 10W",
  },
  {
    id: 3,
    titulo: "Boda de Gala & Pista Iluminada",
    categoria: "sociales",
    tipo: "imagen",
    mediaUrl: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Ambiente cálido y elegante con sonido perimetral de alta fidelidad y trusses forrados en tela blanca.",
    equipos: "Columnas Array Nexo ID Series, Bañadores LED Warm White",
  },
  {
    id: 4,
    titulo: "Calibración de Line Array Nexo",
    categoria: "sonido",
    tipo: "imagen",
    mediaUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Montaje técnico con software NS-1 para predicción acústica exacta y presión sonora homogénea en todo el recinto.",
    equipos: "Nexo STM + Procesamiento Dante / Yamaha CL5",
  },
  {
    id: 5,
    titulo: "Noche Electrónica & DJ Booth",
    categoria: "conciertos",
    tipo: "imagen",
    mediaUrl: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Cabina Pioneer DJ Nexus 2 con monitoreo activo de alta potencia y pantallas LED envolventes.",
    equipos: "Pioneer CDJ-3000 + DJM-900NXS2, Subwoofers Nexo RS18",
  },
  {
    id: 6,
    titulo: "Pirotecnia Fría & Efectos Especiales",
    categoria: "luces",
    tipo: "imagen",
    mediaUrl: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80",
    descripcion: "Chorros de chispas frías no inflamables y criogénica Co2 para momentos cumbre del evento.",
    equipos: "Sparkular FX, Jets Co2 DMX, Pistolas de Niebla",
  },
];

export default function GaleriaMontajes() {
  const [categoriaActiva, setCategoriaActiva] = useState("todos");
  const [elementoSeleccionado, setElementoSeleccionado] = useState(null);

  const montajesFiltrados =
    categoriaActiva === "todos"
      ? MONTAJES
      : MONTAJES.filter((m) => m.categoria === categoriaActiva);

  return (
    <section id="galeria" className="scroll-mt-20 bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Cabecera de la Sección */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs sm:text-sm bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Portafolio Real
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-4 mb-4">
            Nuestros <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Montajes en Acción</span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-red-600 to-amber-500 mb-6" />
          <p className="text-neutral-400 text-base sm:text-lg">
            Explora la calidad de sonido, iluminación y estructura que desplegamos en cada escenario. Cada evento es una obra de ingeniería.
          </p>
        </div>

        {/* Pestañas de Filtro */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-12">
          {CATEGORIAS.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoriaActiva(cat.id)}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-300 ${
                categoriaActiva === cat.id
                  ? "bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)] scale-105"
                  : "bg-neutral-900 text-neutral-400 hover:text-white hover:bg-neutral-800 border border-neutral-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Bento Grid Asimétrico */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {montajesFiltrados.map((item) => (
            <div
              key={item.id}
              onClick={() => setElementoSeleccionado(item)}
              className={`group relative rounded-2xl overflow-hidden bg-neutral-900 border border-neutral-800 hover:border-red-500/60 transition-all duration-500 cursor-pointer shadow-xl hover:shadow-[0_0_25px_rgba(220,38,38,0.25)] flex flex-col justify-end min-h-[320px] ${
                item.destacado ? "md:col-span-2 lg:col-span-2 min-h-[360px]" : ""
              }`}
            >
              {/* Media (Video o Imagen) */}
              {item.tipo === "video" ? (
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <video
                    src={item.mediaUrl}
                    poster={item.posterUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute top-4 right-4 z-10 bg-red-600/90 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    Video en Vivo
                  </div>
                </div>
              ) : (
                <img
                  src={item.mediaUrl}
                  alt={item.titulo}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
              )}

              {/* Degradado oscuro para lectura perfecta */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

              {/* Información Superpuesta */}
              <div className="relative z-10 p-6 flex flex-col">
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider mb-1">
                  {item.equipos}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white group-hover:text-amber-300 transition-colors">
                  {item.titulo}
                </h3>
                <p className="text-neutral-300 text-sm mt-2 line-clamp-2 leading-relaxed">
                  {item.descripcion}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-semibold text-red-400 group-hover:text-red-300">
                  <span>Ver ficha técnica y fotos completas</span>
                  <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Inferior de la Galería */}
        <div className="mt-14 text-center bg-gradient-to-r from-neutral-900 via-neutral-900/90 to-neutral-900 border border-neutral-800 rounded-2xl p-8 max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <h4 className="text-xl font-bold text-white">¿Tienes un evento en mente?</h4>
            <p className="text-neutral-400 text-sm mt-1">Configuramos el sistema de sonido y luces a la medida de tu espacio.</p>
          </div>
          <a
            href="#cotizar"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 transition-all shadow-lg shadow-red-600/30 whitespace-nowrap uppercase tracking-wider text-sm"
          >
            Cotizar Este Nivel
          </a>
        </div>
      </div>

      {/* Modal / Lightbox de Detalle */}
      {elementoSeleccionado && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setElementoSeleccionado(null)}
        >
          <div
            className="relative bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Botón Cerrar */}
            <button
              onClick={() => setElementoSeleccionado(null)}
              aria-label="Cerrar vista detallada"
              className="absolute top-4 right-4 z-20 bg-black/70 hover:bg-black text-white p-2 rounded-full border border-white/20 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Media en Modal */}
            <div className="relative aspect-video w-full bg-black">
              {elementoSeleccionado.tipo === "video" ? (
                <video
                  src={elementoSeleccionado.mediaUrl}
                  controls
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <img
                  src={elementoSeleccionado.mediaUrl}
                  alt={elementoSeleccionado.titulo}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Ficha Técnica */}
            <div className="p-6">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">
                Configuración Técnica
              </span>
              <h3 className="text-2xl font-black text-white mt-1 mb-2">
                {elementoSeleccionado.titulo}
              </h3>
              <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                {elementoSeleccionado.descripcion}
              </p>

              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 mb-6">
                <h4 className="text-xs uppercase font-bold text-neutral-400 tracking-wider mb-1">
                  Equipamiento Empleado:
                </h4>
                <p className="text-white font-mono text-sm">{elementoSeleccionado.equipos}</p>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setElementoSeleccionado(null)}
                  className="px-5 py-2.5 rounded-lg border border-neutral-700 text-neutral-300 hover:text-white hover:bg-neutral-800 text-sm font-semibold transition-colors"
                >
                  Cerrar
                </button>
                <a
                  href="#cotizar"
                  onClick={() => setElementoSeleccionado(null)}
                  className="px-6 py-2.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-sm transition-colors shadow-md shadow-red-600/30"
                >
                  Cotizar Algo Así
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
