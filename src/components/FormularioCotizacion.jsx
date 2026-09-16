import { useState } from 'react';

export default function FormularioCotizacion() {
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    ciudad: '',
    fecha: '',
    tipo_evento: '',
    invitados: 100,
    paquete: 'premium', // Valor por defecto
    extras: []
  });

  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState(null);

  // Lista de extras disponibles según tu backend
  const opcionesExtras = [
    { id: 'pantallas', label: 'Pantallas LED' },
    { id: 'humo', label: 'Máquina de Humo' },
    { id: 'animacion', label: 'Animación / DJ' },
    { id: 'streaming', label: 'Streaming en vivo' }
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? Number(value) : value
    });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let nuevosExtras = [...formData.extras];
    
    if (checked) {
      nuevosExtras.push(value);
    } else {
      nuevosExtras = nuevosExtras.filter((extra) => extra !== value);
    }
    
    setFormData({ ...formData, extras: nuevosExtras });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setResultado(null);

    try {
      const response = await fetch('http://127.0.0.1:8000/api/cotizacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail?.[0]?.msg || 'Error al procesar la cotización');
      }

      const data = await response.json();
      setResultado(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12" id="cotizar">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        <div className="bg-blue-600 px-8 py-6 text-white text-center">
          <h2 className="text-3xl font-bold">Cotiza tu Evento al Instante</h2>
          <p className="mt-2 text-blue-100">Obtén un presupuesto preliminar y resérvalo por WhatsApp</p>
        </div>

        <div className="p-8">
          {resultado ? (
            <div className="text-center animate-fade-in">
              <div className="bg-green-50 text-green-800 p-6 rounded-xl border border-green-200 mb-6">
                <h3 className="text-2xl font-bold mb-2">¡Cotización Generada!</h3>
                <p className="text-lg">Costo estimado: <span className="font-black text-3xl">Bs. {resultado.resumen.estimado_bob}</span></p>
              </div>
              
              <a 
                href={resultado.whatsapp} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold text-xl px-8 py-4 rounded-xl transition-all shadow-lg hover:shadow-xl w-full sm:w-auto"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>
                Enviar a WhatsApp
              </a>
              
              <button 
                onClick={() => setResultado(null)}
                className="mt-6 text-gray-500 hover:text-gray-700 underline block mx-auto"
              >
                Hacer otra cotización
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
                  <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required minLength="2" maxLength="80" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ej. Juan Pérez" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                  <input type="tel" name="telefono" value={formData.telefono} onChange={handleChange} required minLength="6" maxLength="24" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ej. 71234567" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ciudad</label>
                  <input type="text" name="ciudad" value={formData.ciudad} onChange={handleChange} required minLength="2" maxLength="80" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ej. Apolo" />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha del Evento</label>
                  <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Evento</label>
                  <input type="text" name="tipo_evento" value={formData.tipo_evento} onChange={handleChange} required minLength="2" maxLength="60" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" placeholder="Ej. Matrimonio, 15 años" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cant. Invitados Aprox.</label>
                  <input type="number" name="invitados" value={formData.invitados} onChange={handleChange} required min="20" max="5000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Paquete Base</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {['esencial', 'premium', 'pro'].map((pkg) => (
                    <label key={pkg} className={`flex flex-col items-center p-4 border rounded-xl cursor-pointer transition-all ${formData.paquete === pkg ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-blue-300'}`}>
                      <input type="radio" name="paquete" value={pkg} checked={formData.paquete === pkg} onChange={handleChange} className="sr-only" />
                      <span className="font-bold capitalize text-gray-800">{pkg}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <label className="block text-sm font-medium text-gray-900 mb-3">Extras Opcionales</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {opcionesExtras.map((extra) => (
                    <label key={extra.id} className="flex items-center space-x-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input type="checkbox" value={extra.id} checked={formData.extras.includes(extra.id)} onChange={handleCheckboxChange} className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500" />
                      <span className="text-sm text-gray-700">{extra.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">
                  {error}
                </div>
              )}

              <div className="pt-4">
                <button 
                  type="submit" 
                  disabled={cargando}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg disabled:opacity-70 flex justify-center items-center"
                >
                  {cargando ? 'Calculando...' : 'Calcular Cotización'}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
}
