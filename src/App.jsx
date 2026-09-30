import Navbar from './components/layout/Navbar';
import Hero from './components/Hero';
import ListaServicios from './components/ListaServicios'; 
import FormularioCotizacion from './components/cotizacion/FormularioCotizacion'; 
import Footer from './components/layout/Footer';

function App() {
  return (
    <div className="relative font-sans text-slate-900">
      <Navbar />
      
      {/* El pt-20 evita que el Navbar fijo oculte el inicio del Hero */}
      <main className="min-h-screen bg-gray-50 flex flex-col pt-20">
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

      <Footer />
    </div>
  );
}

export default App;