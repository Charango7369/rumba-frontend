import { useState, useEffect } from "react";

const TESTIMONIOS_DEFAULT = [
  {
    id: 1,
    autor: "Carlos Mendoza",
    rol: "Productor General",
    evento: "Festival Apolo en Vivo",
    ciudad: "Apolo, La Paz",
    calificacion: 5,
    fotoAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    fotoEvento: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80",
    texto: "El sistema Nexo STM superó cualquier expectativa. La claridad vocal y la pegada de los subwoofers en un recinto abierto para más de 4,000 personas fue impecable. Sin duda el mejor equipo técnico de la región.",
  },
  {
    id: 2,
    autor: "Mariana & Rodrigo",
    rol: "Pareja de Novios",
    evento: "Boda de Gala",
    ciudad: "La Paz",
    calificacion: 5,
    fotoAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80",
    fotoEvento: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80",
    texto: "La iluminación ambiental, la máquina de humo bajo y las chispas frías hicieron que nuestro primer baile pareciera de película. Todos los invitados quedaron fascinados con la música y el show de luces.",
  },
  {
    id: 3,
    autor: "Ing. Fernando Quiroga",
    rol: "Director de Relaciones Públicas",
    evento: "Aniversario Institucional & Concierto",
    ciudad: "Caranavi - La Paz",
    calificacion: 5,
    fotoAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=80",
    fotoEvento: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80",
    texto: "Puntualidad total en el armado de estructuras truss y calibración acústica. No tuvimos ni un solo microfonazo en toda la noche. Un nivel de profesionalismo técnico que da total tranquilidad.",
  },
];

export default function Testimonios({ items = TESTIMONIOS_DEFAULT, intervalo = 6000 }) {
  const lista = items.length > 0 ? items : TESTIMONIOS_DEFAULT;
  const [indice, setIndice] = useState(0);
  const [pausa, setPausa] = useState(false);

  useEffect(() => {
    if (pausa || lista.length < 2) return;
    const temporizador = setInterval(() => {
      setIndice((prev) => (prev + 1) % lista.length);
    }, intervalo);
    return () => clearInterval(temporizador);
  }, [pausa, lista.length, intervalo]);

  const siguiente = () => setIndice((prev) => (prev + 1) % lista.length);
  const anterior = () => setIndice((prev) => (prev - 1 + lista.length) % lista.length);

  const cur = lista[indice];

  return (
    <section
      id="testimonios"
      aria-label="Testimonios y Experiencias de Clientes"
      className="scroll-mt-20 bg-neutral-950 py-20 px-4 sm:px-6 lg:px-8 border-t border-neutral-900 text-white overflow-hidden relative"
      onMouseEnter={() => setPausa(true)}
      onMouseLeave={() => setPausa(false)}
    >
      {/* Resplandor ambiental de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-red-600/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Cabecera */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-amber-500 font-bold uppercase tracking-widest text-xs sm:text-sm bg-amber-500/10 px-4 py-1.5 rounded-full border border-amber-500/30">
            Opiniones de Confianza
          </span>
          <h2 className="text-3xl sm:text-5xl font-black uppercase tracking-tight mt-4 mb-3">
            Lo que dicen <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-amber-500">Nuestros Clientes</span>
          </h2>
          <div className="mx-auto h-1 w-20 rounded-full bg-gradient-to-r from-red-600 to-amber-500 mb-4" />
          <p className="text-neutral-400 text-sm sm:text-base">
            Organizadores, novios y productoras que confiaron la potencia de su evento a Rumba X Siempre.
          </p>
        </div>

        {/* Tarjeta Principal del Testimonio */}
        <div className="relative max-w-4xl mx-auto bg-neutral-900/90 border border-neutral-800 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Comillas decorativas de fondo */}
          <div className="absolute top-4 right-8 text-neutral-800/40 text-8xl sm:text-9xl font-serif font-black select-none pointer-events-none">
            “
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            {/* Foto del Evento / Montaje (Columna izquierda) */}
            <div className="md:col-span-5 relative group overflow-hidden rounded-2xl aspect-[4/3] bg-neutral-950 shadow-lg border border-neutral-800">
              <img
                src={cur.fotoEvento}
                alt={`Evento ${cur.evento}`}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 text-xs text-white font-semibold flex items-center justify-between">
                <span className="bg-red-600/90 px-2.5 py-1 rounded text-[10px] uppercase font-bold tracking-wider">
                  {cur.evento}
                </span>
                <span className="text-neutral-300 text-[11px]">{cur.ciudad}</span>
              </div>
            </div>

            {/* Contenido del Testimonio (Columna derecha) */}
            <div className="md:col-span-7 flex flex-col justify-between">
              {/* Estrellas doradas */}
              <div className="flex items-center gap-1 mb-4 text-amber-400">
                {[...Array(cur.calificacion || 5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
                <span className="ml-2 text-xs font-bold text-neutral-400">5.0 / 5.0</span>
              </div>

              {/* Texto de la reseña */}
              <blockquote className="text-lg sm:text-xl text-neutral-200 font-medium leading-relaxed italic mb-6">
                “{cur.texto}”
              </blockquote>

              {/* Información del Autor */}
              <div className="flex items-center gap-4 pt-4 border-t border-neutral-800">
                <img
                  src={cur.fotoAvatar}
                  alt={cur.autor}
                  className="w-12 h-12 rounded-full object-cover border-2 border-amber-500 shadow-md"
                />
                <div>
                  <h4 className="text-base font-bold text-white leading-tight">
                    {cur.autor}
                  </h4>
                  <p className="text-xs text-amber-400 font-medium">
                    {cur.rol} • <span className="text-neutral-400">{cur.evento}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controles de Navegación (Flechas e Indicadores) */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={anterior}
            aria-label="Testimonio anterior"
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-white transition-all shadow-md hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Indicadores en forma de píldora */}
          <div className="flex items-center gap-2">
            {lista.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setIndice(idx)}
                aria-label={`Ver testimonio ${idx + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  idx === indice
                    ? "w-8 bg-gradient-to-r from-red-600 to-amber-500 shadow-[0_0_10px_rgba(220,38,38,0.5)]"
                    : "w-2.5 bg-neutral-800 hover:bg-neutral-700"
                }`}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={siguiente}
            aria-label="Siguiente testimonio"
            className="p-2.5 rounded-full bg-neutral-900 border border-neutral-800 hover:border-amber-500/50 text-neutral-300 hover:text-white transition-all shadow-md hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
