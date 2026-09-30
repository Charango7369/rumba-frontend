import { useState, useEffect } from 'react';
import { obtenerServicios } from '../services/api';

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    obtenerServicios()
      .then(setServicios)
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) return (
    <div className="flex justify-center items-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  if (error) return (
    <div className="max-w-3xl mx-auto my-10 p-6 bg-red-50 text-red-700 rounded-xl border border-red-200 text-center">
      <p className="font-bold">Error de conexión</p>
      <p className="text-sm">{error}</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-16" id="servicios">
      <h2 className="text-3xl font-extrabold text-center mb-12 text-slate-800 relative inline-block left-1/2 -translate-x-1/2">
        Nuestros Servicios
        <span className="absolute -bottom-3 left-1/4 w-1/2 h-1 bg-blue-500 rounded-full"></span>
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map((servicio) => (
          <div 
            key={servicio.id} 
            className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 p-6 border border-gray-100 flex flex-col"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full font-bold uppercase tracking-wide border border-blue-100">
                {servicio.categoria}
              </span>
              <span className="relative flex h-3 w-3">
                {servicio.disponible && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>}
                <span className={`relative inline-flex rounded-full h-3 w-3 ${servicio.disponible ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
              {servicio.nombre}
            </h3>
            
            <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
              {servicio.descripcion}
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">
                Bs. {servicio.precio_base}
              </span>
              <a 
                href="#cotizar"
                className="bg-slate-100 hover:bg-blue-600 text-slate-700 hover:text-white px-5 py-2.5 rounded-lg font-bold transition-all duration-300"
              >
                Elegir
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}