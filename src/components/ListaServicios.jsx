import { useState, useEffect } from 'react';

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        // Apuntamos al endpoint que configuramos en FastAPI con el prefijo /api
        const response = await fetch('http://127.0.0.1:8000/api/servicios');
        
        if (!response.ok) {
          throw new Error('No se pudieron cargar los servicios');
        }
        
        const data = await response.json();
        setServicios(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setCargando(false);
      }
    };

    fetchServicios();
  }, []);

  if (cargando) return <p className="text-center text-gray-500 py-10">Cargando catálogo...</p>;
  if (error) return <p className="text-center text-red-500 py-10">Error de conexión: Verifica que tu backend esté corriendo.</p>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-3xl font-bold text-center mb-8 text-slate-800">
        Nuestros Servicios
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {servicios.map((servicio) => (
          <div 
            key={servicio.id} 
            className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 p-6 border border-gray-100"
          >
            <div className="flex justify-between items-start mb-4">
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-semibold uppercase tracking-wide">
                {servicio.categoria}
              </span>
              {servicio.disponible ? (
                <span className="flex h-3 w-3 rounded-full bg-green-500"></span>
              ) : (
                <span className="flex h-3 w-3 rounded-full bg-red-500"></span>
              )}
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {servicio.nombre}
            </h3>
            
            <p className="text-gray-600 mb-6 min-h-[60px]">
              {servicio.descripcion}
            </p>
            
            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className="text-2xl font-black text-slate-800">
                Bs. {servicio.precio_base}
              </span>
              <a 
                href="#cotizar"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                Cotizar
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}