import Hero from './components/Hero';
import ListaServicios from './components/ListaServicios'; 
import FormularioCotizacion from './components/FormularioCotizacion'; 

function App() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <Hero />
      
      {/* 
        Lista de servicios obtenida desde tu backend 
        (Consume el endpoint GET /api/servicios) 
      */}
      <ListaServicios />
      
      {/* 
        Formulario interactivo para calcular y reservar
        (Consume el endpoint POST /api/cotizacion) 
      */}
      <FormularioCotizacion />
      
    </main>
  );
}

export default App;