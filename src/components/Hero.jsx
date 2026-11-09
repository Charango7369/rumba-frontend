import { useState, useRef } from "react";

// Video de respaldo cinemático de alta resolución de luces de concierto y escenario
const DEFAULT_VIDEO_URL = "https://assets.mixkit.co/videos/48624/48624-720.mp4";

const MARCAS_TECNICAS = [
  { nombre: "NEXO", subtitulo: "Line Array STM" },
  { nombre: "PIONEER DJ", subtitulo: "Nexus Pro" },
  { nombre: "SHURE", subtitulo: "Wireless Systems" },
  { nombre: "CHAUVET", subtitulo: "Professional Lights" },
  { nombre: "YAMAHA", subtitulo: "Digital Consoles" },
  { nombre: "ALLEN & HEATH", subtitulo: "dLive Audio" },
];

export default function Hero() {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  return (
    <div className="relative bg-black text-white overflow-hidden animate-fade-in">
      {/* 1. CONTENEDOR MULTIMEDIA DE FONDO (VIDEO + POSTER) */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          poster="/og-image.jpg"
          onLoadedData={() => setVideoLoaded(true)}
          className={`w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? "opacity-45" : "opacity-25"
          } scale-105 motion-safe:animate-pulse-slow`}
        >
          {/* Si el usuario coloca su propio video en public/videos/hero.mp4, se prioriza */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src={DEFAULT_VIDEO_URL} type="video/mp4" />
        </video>

        {/* Gradiente cinemático de RXS: Fundido oscuro a negro + resplandores de luces de escenario */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-black/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80" />

        {/* Brillos neón que simulan cabezas móviles en rojo y dorado */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[350px] bg-red-600/25 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[350px] bg-amber-500/15 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
      </div>

      {/* 2. BOTÓN DE CONTROL DE VIDEO (ESQUINA SUPERIOR DERECHA) */}
      <div className="absolute top-6 right-6 z-20 hidden sm:block">
        <button
          type="button"
          onClick={togglePlay}
          aria-label={isPlaying ? "Pausar video de fondo" : "Reproducir video de fondo"}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-semibold text-neutral-300 hover:text-white hover:border-amber-500/50 transition-all"
        >
          <span className={`w-2 h-2 rounded-full ${isPlaying ? "bg-red-500 animate-ping" : "bg-neutral-500"}`} />
          {isPlaying ? "Video en vivo" : "Pausado"}
        </button>
      </div>

      {/* 3. CONTENIDO PRINCIPAL */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-20 sm:pt-28 sm:pb-24 flex flex-col items-center text-center z-10">
        
        {/* Badge superior de tecnología */}
        <div className="inline-flex items-center gap-2.5 text-amber-400 font-bold tracking-widest uppercase text-xs sm:text-sm mb-6 bg-gradient-to-r from-red-950/80 via-amber-950/40 to-neutral-900/80 px-5 py-2 rounded-full border border-amber-500/30 backdrop-blur-md shadow-[0_0_15px_rgba(245,158,11,0.15)]">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-600"></span>
          </span>
          Producción Técnica & Sonido Line Array
        </div>
        
        {/* Título de alto impacto */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-none drop-shadow-2xl uppercase italic">
          Siente la potencia <br />
          de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500 drop-shadow-[0_4px_10px_rgba(220,38,38,0.5)]">NEXO STM</span>
        </h1>
        
        {/* Descripción comercial */}
        <p className="mt-2 text-lg sm:text-2xl text-neutral-300 max-w-3xl mb-8 font-normal leading-relaxed">
          Ingeniería de sonido para festivales, conciertos y eventos exclusivos. 
          Iluminación robótica sincronizada y estructuras para una experiencia inolvidable.
        </p>

        {/* Badges de Ficha Técnica Rápida */}
        <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mb-10 text-xs sm:text-sm font-semibold text-neutral-300">
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
            🔊 Nexo STM Series
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
            💡 Iluminación DMX & Láser
          </span>
          <span className="px-3.5 py-1.5 rounded-lg bg-neutral-900/80 border border-neutral-800 backdrop-blur-sm">
            ⚡ Cobertura Apolo y La Paz
          </span>
        </div>
        
        {/* Botones de Llamado a la Acción (CTA) */}
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a 
            href="#cotizar" 
            className="inline-flex justify-center items-center gap-3 px-8 py-4 bg-gradient-to-r from-red-600 via-red-500 to-amber-500 bg-[length:200%_100%] hover:bg-right hover:-translate-y-1 text-white font-extrabold rounded-xl text-lg transition-all duration-300 shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:shadow-[0_0_35px_rgba(220,38,38,0.85)] uppercase tracking-wide"
          >
            <span>Cotizar mi Evento</span>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
          <a 
            href="#galeria" 
            className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 hover:-translate-y-1 text-white font-bold rounded-xl text-lg backdrop-blur-md border border-white/15 transition-all duration-300 uppercase tracking-wide hover:border-amber-500/50"
          >
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Ver Montajes</span>
          </a>
        </div>
      </div>

      {/* 4. FRANJA DE PRESTIGIO TÉCNICO (MARCAS PROFESIONALES) */}
      <div className="relative z-10 border-t border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-md py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-5">
            Equipamiento de estándar internacional para tu escenario
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center justify-items-center opacity-85">
            {MARCAS_TECNICAS.map((marca) => (
              <div 
                key={marca.nombre}
                className="group flex flex-col items-center transition-all duration-300 hover:scale-105"
              >
                <span className="text-lg md:text-xl font-black tracking-tighter text-neutral-300 group-hover:text-amber-400 transition-colors">
                  {marca.nombre}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-neutral-400 group-hover:text-red-400 transition-colors">
                  {marca.subtitulo}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
