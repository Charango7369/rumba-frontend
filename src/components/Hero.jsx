// src/components/layout/Hero.jsx
// (Asegúrate de tenerlo en layout/ o ajusta la ruta si lo dejaste en components/)

export default function Hero() {
  return (
    <div className="relative bg-black text-white overflow-hidden animate-fade-in">
      {/* Fondo decorativo con colores de RXS */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-red-950/20 to-black opacity-90"></div>
        {/* Brillos simulando iluminación de escenario en rojo y dorado */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[400px] bg-red-600/20 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-amber-500/10 blur-[100px] rounded-full mix-blend-screen animate-pulse-slow delay-1000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center z-10">
        
        <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 bg-amber-500/10 px-5 py-1.5 rounded-full border border-amber-500/30">
          Producción Técnica de Alto Nivel
        </span>
        
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight drop-shadow-xl uppercase italic">
          Siente la potencia <br className="hidden md:block" />
          de <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-amber-500">Nexo STM</span>
        </h1>
        
        <p className="mt-4 text-xl text-neutral-300 max-w-2xl mb-10 font-medium">
          Sistemas line array, iluminación inteligente y la mejor infraestructura para que tu evento vibre con calidad internacional.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <a 
            href="#cotizar" 
            className="inline-flex justify-center items-center px-8 py-4 bg-red-600 hover:bg-red-500 hover:-translate-y-1 text-white font-bold rounded-lg text-lg transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.5)] hover:shadow-[0_0_30px_rgba(220,38,38,0.7)] uppercase tracking-wide"
          >
            Cotizar mi Evento
          </a>
          <a 
            href="#servicios" 
            className="inline-flex justify-center items-center px-8 py-4 bg-white/5 hover:bg-white/10 hover:-translate-y-1 text-white font-bold rounded-lg text-lg backdrop-blur-md border border-white/10 transition-all duration-300 uppercase tracking-wide"
          >
            Ver Catálogo
          </a>
        </div>
      </div>
    </div>
  );
}