// src/components/layout/Footer.jsx

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-950 text-slate-400 py-12 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 text-center md:text-left">
          
          {/* Identidad */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">Rumba Producciones</h3>
            <p className="text-sm leading-relaxed max-w-xs mx-auto md:mx-0">
              Producción técnica profesional para eventos. Sonido line array e iluminación espectacular para que tu rumba sea una experiencia inolvidable.
            </p>
          </div>
          
          {/* Enlaces Rápidos */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-2">Navegación</h4>
            <a href="#" className="hover:text-blue-400 transition-colors w-fit mx-auto md:mx-0">Inicio</a>
            <a href="#servicios" className="hover:text-blue-400 transition-colors w-fit mx-auto md:mx-0">Nuestros Servicios</a>
            <a href="#cotizar" className="hover:text-blue-400 transition-colors w-fit mx-auto md:mx-0">Cotizar en línea</a>
          </div>

          {/* Información de Contacto */}
          <div className="flex flex-col space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-sm mb-2">Ubicación</h4>
            <p className="flex items-center justify-center md:justify-start gap-2">
              <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              Apolo, La Paz - Bolivia
            </p>
          </div>
        </div>
        
        {/* Créditos Finales */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
          <p>&copy; {currentYear} Rumba x Siempre. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Desarrollado por <span className="text-white font-medium tracking-wide">ApoloDigital</span>
          </p>
        </div>
      </div>
    </footer>
  );
}