import { useState, useEffect } from "react";
import { obtenerServicios } from "@/services/api"; // Tu alias funcionando

export default function ListaServicios() {
  const [servicios, setServicios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const data = await obtenerServicios();
        setServicios(data);
      } catch (err) {
        console.error("Error al obtener servicios:", err);
        setError("Ocurrió un problema al cargar los servicios.");
      } finally {
        setCargando(false);
      }
    };

    fetchServicios();
  }, []);

  return (
    <section className="py-16 bg-neutral-950 text-neutral-100" id="servicios">
      <div className="container mx-auto px-4 max-w-6xl">
        
        {/* Encabezado */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-4">
            Nuestros <span className="text-red-600">Servicios</span>
          </h2>
          <div className="h-1 w-24 bg-amber-500 mx-auto rounded-full mb-4"></div>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Soluciones técnicas integrales para que tu evento sea inolvidable.
          </p>
        </div>

        {/* Estado de Error */}
        {error && (
          <div className="bg-red-900/20 border border-red-600/50 text-red-400 p-4 rounded-lg text-center max-w-2xl mx-auto">
            {error}
          </div>
        )}

        {/* Estado de Carga (Skeletons) */}
        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((skeleton) => (
              <div key={skeleton} className="bg-neutral-900 rounded-xl p-8 border border-neutral-800 animate-pulse">
                <div className="w-16 h-16 bg-neutral-800 rounded-full mb-6"></div>
                <div className="h-6 bg-neutral-800 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-neutral-800 rounded w-full mb-2"></div>
                <div className="h-4 bg-neutral-800 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          /* Grid de Servicios Dinámicos */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicios.map((servicio) => (
              <article 
                key={servicio.id} 
                className="group bg-neutral-900 rounded-xl p-8 border border-neutral-800 hover:border-red-600 transition-all duration-300 shadow-lg hover:shadow-red-900/20 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-neutral-950 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300 border border-neutral-800 group-hover:border-amber-500">
                  {/* Si tu API no devuelve un icono, puedes poner un fallback aquí */}
                  {servicio.icono || "🔥"} 
                </div>
                
                {/* Asegúrate de que las propiedades coincidan con las de tu API (ej: servicio.nombre vs servicio.titulo) */}
                <h3 className="text-xl font-bold text-white mb-3">
                  {servicio.nombre || servicio.titulo}
                </h3>
                
                <p className="text-neutral-400 leading-relaxed mb-6 flex-grow">
                  {servicio.descripcion}
                </p>
                
                <button className="text-amber-500 font-semibold text-sm uppercase tracking-wider hover:text-red-500 transition-colors flex items-center gap-2 mt-auto">
                  Cotizar ahora <span aria-hidden="true">&rarr;</span>
                </button>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}