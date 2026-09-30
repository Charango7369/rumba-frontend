import { useState } from 'react';
import { generarCotizacion } from '../services/api';

export default function FormularioCotizacion() {
  const [formData, setFormData] = useState({
    nombre: '', telefono: '', ciudad: '', fecha: '',
    tipo_evento: '', invitados: 100, paquete: 'premium', extras: []
  });

  const [estado, setEstado] = useState({ cargando: false, resultado: null, error: null });

  const opcionesExtras = [
    { id: 'pantallas', label: 'Pantallas LED' },
    { id: 'humo', label: 'Máquina de Humo' },
    { id: 'animacion', label: 'Animación / DJ' },
    { id: 'streaming', label: 'Streaming en vivo' }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'number' ? Number(value) : value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      extras: checked ? [...prev.extras, value] : prev.extras.filter(extra => extra !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEstado({ cargando: true, resultado: null, error: null });

    try {
      const data = await generarCotizacion(formData);
      setEstado({ cargando: false, resultado: data, error: null });
    } catch (err) {
      setEstado({ cargando: false, resultado: null, error: err.message });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16" id="cotizar">
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 px-8 py-8 text-white text-center">
          <h2 className="text-3xl font-extrabold mb-2">Cotiza tu Evento al Instante</h2>
          <p className="text-blue-100/80 font-medium">Obtén un presupuesto preliminar y asegura tu fecha</p>
        </div>

        <div className="p-8 md:p-10">
          {estado.resultado ? (
            <div className="text-center animate-fade-in max-w-lg mx-auto">
              <div className="bg-green-50 text-green-900 p-8 rounded-2xl border border-green-200 mb-8 shadow-sm">
                <h3 className="text-2xl font-bold mb-3 text-green-800">¡Cotización Generada!</h3>
                <p className="text-gray-600 mb-4">Monto estimado para tu evento:</p>
                <p className="font-black text-5xl text-slate-800 mb-2">Bs. {estado.resultado.resumen.estimado_bob}</p>
              </div>
              
              <a 
                href={estado.resultado.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xl px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full"
              >
                <svg className="w-7 h-7 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Reservar por WhatsApp
              </a>
              
              <button 
                onClick={() => setEstado({ cargando: false, resultado: null, error: null })}
                className="mt-6 text-gray-500 hover:text-blue-600 font-medium underline transition-colors"
              >
                Hacer otra cotización
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              {/* Controles del formulario sin cambios estructurales, solo mejoras de clases */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required minLength="2" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required minLength="6" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. 71234567" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Ciudad</label>
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Apolo" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Fecha del Evento</label>
                  <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-slate-700" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Tipo de Evento</label>
                  <input type="text" name="tipo_evento" value={formData.tipo_evento} onChange={handleChange} required className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" placeholder="Ej. Matrimonio, 15 años" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Cant. Invitados Aprox.</label>
                  <input type="number" name="invitados" value={formData.invitados} onChange={handleChange} required min="20" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-4">Nivel de Producción (Paquete)</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['esencial', 'premium', 'pro'].map((pkg) => (
                    <label key={pkg} className={`relative flex flex-col items-center p-5 border-2 rounded-2xl cursor-pointer transition-all ${formData.paquete === pkg ? 'border-blue-600 bg-blue-50 shadow-md' : 'border-gray-100 hover:border-blue-300 hover:bg-gray-50'}`}>
                      <input type="radio" name="paquete" value={pkg} checked={formData.paquete === pkg} onChange={handleChange} className="sr-only" />
                      <span className="font-black uppercase tracking-wider text-slate-800">{pkg}</span>
                      {formData.paquete === pkg && <div className="absolute -top-3 bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase">Seleccionado</div>}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-900 mb-4">Requerimientos Extras</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {opcionesExtras.map((extra) => (
                    <label key={extra.id} className={`flex items-center space-x-3 p-4 border-2 rounded-xl cursor-pointer transition-all ${formData.extras.includes(extra.id) ? 'border-blue-600 bg-blue-50' : 'border-gray-100 hover:bg-gray-50'}`}>
                      <input type="checkbox" value={extra.id} checked={formData.extras.includes(extra.id)} onChange={handleCheckboxChange} className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                      <span className="text-sm font-medium text-slate-700">{extra.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {estado.error && (
                <div className="p-4 bg-red-50 text-red-700 border-l-4 border-red-500 rounded-r-lg font-medium">
                  {estado.error}
                </div>
              )}

              <div className="pt-6 border-t border-gray-100">
                <button 
                  type="submit" 
                  disabled={estado.cargando}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xl py-5 rounded-xl transition-all shadow-xl hover:shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-3"
                >
                  {estado.cargando && <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>}
                  {estado.cargando ? 'Procesando...' : 'Calcular Presupuesto'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}