// src/pages/public/LandingPage.jsx
import Navbar from '../../components/layout/Navbar';
import Hero from '../../components/Hero';
import ListaServicios from '../../components/ListaServicios';
import GaleriaMontajes from '../../components/galeria/GaleriaMontajes';
import Testimonios from '../../components/Testimonios';
import FormularioCotizacion from '../../components/cotizacion/FormularioCotizacion';
import WhatsAppFloat from '../../components/WhatsAppFloat';
import Footer from '../../components/layout/Footer';

export default function LandingPage() {
  return (
    <div className="relative font-sans text-slate-900 bg-neutral-950">
      <Navbar />

      <main className="min-h-screen bg-neutral-950 flex flex-col pt-20">
        <Hero />
        <ListaServicios />
        <GaleriaMontajes />
        <Testimonios />
        <FormularioCotizacion />
      </main>

      <WhatsAppFloat />
      <Footer />
    </div>
  );
}
