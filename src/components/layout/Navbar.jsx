// src/components/layout/Navbar.jsx
import { useState } from 'react';

export default function Navbar() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-black/90 backdrop-blur-md border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo / Marca actualizado a RXS */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <span className="text-4xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 to-red-700 drop-shadow-[0_2px_2px_rgba(217,119,6,0.8)]">
              Rumba X Siempre
            </span>
            <span className="text-white font-medium tracking-widest uppercase text-xs sm:text-sm mt-2 ml-1">
              Sonido & Luces
            </span>
          </div>

          {/* Enlaces Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#servicios" className="text-neutral-300 hover:text-amber-500 font-medium transition-colors">
              Catálogo
            </a>
            <a 
              href="#cotizar" 
              className="px-6 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(220,38,38,0.4)] hover:shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:-translate-y-0.5"
            >
              Cotizar Evento
            </a>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMenuAbierto(!menuAbierto)} 
              className="text-neutral-300 hover:text-white focus:outline-none p-2"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={menuAbierto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {menuAbierto && (
        <div className="md:hidden bg-neutral-950 border-b border-white/10 animate-fade-in absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-4 flex flex-col shadow-2xl">
            <a 
              href="#servicios" 
              onClick={() => setMenuAbierto(false)} 
              className="block px-3 py-3 text-neutral-300 hover:bg-neutral-900 hover:text-amber-500 rounded-lg font-medium transition-colors"
            >
              Catálogo
            </a>
            <a 
              href="#cotizar" 
              onClick={() => setMenuAbierto(false)} 
              className="block px-3 py-3 text-center bg-red-600 text-white font-bold rounded-lg shadow-lg"
            >
              Cotizar Evento
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}