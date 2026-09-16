export default function Hero() {
  return (
    <div className="relative bg-slate-900 text-white overflow-hidden">
      {/* Fondo decorativo con degradado para simular luces de evento */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 opacity-90"></div>
        {/* Un brillo sutil en la esquina superior para darle profundidad */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full mix-blend-screen"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center z-10">
        
        <span className="text-blue-400 font-semibold tracking-wide uppercase text-sm mb-4 bg-blue-900/30 px-4 py-1 rounded-full border border-blue-500/30">
          Producción Técnica Profesional
        </span>
        
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Lleva tu evento en Apolo <br className="hidden md:block" />
          al <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">siguiente nivel</span>
        </h1>
        
        <p className="mt-4 text-xl text-slate-300 max-w-2xl mb-10">
          Sonido line array, iluminación espectacular y la mejor infraestructura para que tu rumba sea una experiencia inolvidable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg text-lg transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]">
            Cotizar mi Evento
          </button>
          <button className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-lg text-lg backdrop-blur-md border border-white/10 transition-all">
            Ver Catálogo
          </button>
        </div>
        
      </div>
    </div>
  );
}