// src/components/cotizacion/FormularioCotizacion.jsx
import { useState, useEffect } from 'react';
import { useCotizacion } from '../../hooks/useCotizacion';
import ProgressBar from './ProgressBar';
import { CAMPOS_REQUERIDOS, validarCampo, calcularProgreso } from '../../utils/validacionCotizacion';
import { api } from '../../services/api';
import '../../styles/rxs-animations.css';

const hoyLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

function Campo({ label, name, value, onChange, error, type = 'text', ...rest }) {
  const id = `campo-${name}`;
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-bold text-neutral-700">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? errorId : undefined}
        className={`w-full rounded-xl border bg-neutral-50 px-4 py-3 text-neutral-900 outline-none motion-safe:transition-all focus:bg-white focus:ring-2 focus:ring-red-600 ${
          error ? 'border-red-600' : 'border-neutral-300 focus:border-red-600'
        }`}
        {...rest}
      />
      {error && (
        <p id={errorId} className="mt-1 text-xs font-bold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

export default function FormularioCotizacion() {
  const {
    formData,
    setFormData,
    erroresValidacion,
    estadoCotizacion,
    handleChange,
    handleCheckboxChange,
    handleSubmit,
    resetFormulario,
  } = useCotizacion();

  const { cargando, resultado, errorServidor } = estadoCotizacion;

  // Catálogo dinámico recuperado desde la API
  const [paquetesDisponibles, setPaquetesDisponibles] = useState([]);
  const [extrasDisponibles, setExtrasDisponibles] = useState([]);
  const [cargandoCatalogo, setCargandoCatalogo] = useState(true);

  useEffect(() => {
    let cancelado = false;
    const fetchOpciones = async () => {
      try {
        const data = await api.obtenerOpcionesCotizacion();
        if (!cancelado) {
          const pkgs = data.paquetes || [];
          const exts = data.extras || [];
          setPaquetesDisponibles(pkgs);
          setExtrasDisponibles(exts);

          // Si no hay paquete preseleccionado, seleccionar el primero
          if (pkgs.length > 0 && !formData.paquete) {
            setFormData((prev) => ({ ...prev, paquete: pkgs[0].slug }));
          }
        }
      } catch (err) {
        console.error('Error al cargar opciones de cotización:', err);
      } finally {
        if (!cancelado) setCargandoCatalogo(false);
      }
    };
    fetchOpciones();
    return () => { cancelado = true; };
  }, [setFormData, formData.paquete]);

  // Listener para eventos desde las tarjetas de servicio
  useEffect(() => {
    const handleServicioSeleccionado = (e) => {
      const slugONombre = e.detail;
      setFormData((prev) => ({ ...prev, paquete: slugONombre }));
    };
    window.addEventListener('cotizacion:servicio', handleServicioSeleccionado);
    return () => window.removeEventListener('cotizacion:servicio', handleServicioSeleccionado);
  }, [setFormData]);

  const [tocados, setTocados] = useState({});
  const marcar = (name) => () => setTocados((t) => ({ ...t, [name]: true }));
  const errorDe = (name) =>
    erroresValidacion[name] || (tocados[name] ? validarCampo(name, formData[name]) : '');
  const progreso = calcularProgreso(formData);
  const reiniciar = () => { setTocados({}); resetFormulario(); };

  const enviar = (e) => {
    setTocados(Object.fromEntries(CAMPOS_REQUERIDOS.map((k) => [k, true])));
    handleSubmit(e);
  };

  return (
    <section
      id="cotizar"
      aria-labelledby="cotizar-titulo"
      className="mx-auto max-w-4xl scroll-mt-20 px-4 py-16"
    >
      <div className="overflow-hidden rounded-3xl border border-neutral-100 bg-white shadow-2xl">
        <header className="bg-gradient-to-r from-red-700 to-neutral-900 px-8 py-8 text-center text-white">
          <h2 id="cotizar-titulo" className="mb-2 text-3xl font-extrabold uppercase tracking-wide">
            Cotiza tu Evento al Instante
          </h2>
          <p className="font-medium text-red-100">
            Obtén un presupuesto preliminar calculado con precios oficiales del catálogo en vivo
          </p>
        </header>

        <div className="p-8 md:p-10">
          {resultado ? (
            <div role="status" className="mx-auto max-w-lg text-center animate-fade-in">
              <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-8 shadow-sm">
                <span className="text-xs uppercase font-extrabold tracking-widest text-green-700 bg-green-200/60 px-3 py-1 rounded-full">
                  Código: {resultado.codigo_seguimiento || 'RXS-PROD'}
                </span>
                <h3 className="mt-3 mb-2 text-2xl font-bold text-green-900">¡Cotización Generada!</h3>
                <p className="mb-4 text-sm text-neutral-600">Presupuesto estimado para tu producción:</p>
                <p className="mb-3 text-5xl font-black text-neutral-900">
                  Bs. {Number(resultado.resumen.estimado_bob).toLocaleString()}
                </p>
                {resultado.resumen.desglose && (
                  <p className="text-xs text-neutral-500 font-mono">
                    Incluye {resultado.resumen.desglose.capacidad?.invitados_totales} invitados + {resultado.resumen.extras?.length || 0} extras
                  </p>
                )}
              </div>

              <a
                href={resultado.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-4 text-xl font-bold uppercase text-neutral-950 shadow-lg hover:bg-[#1EBE5D] transition-all"
              >
                <span>Reservar por WhatsApp</span>
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>

              <button
                type="button"
                onClick={reiniciar}
                className="mt-6 font-medium text-neutral-600 underline hover:text-red-600 transition-colors"
              >
                Calcular otra cotización
              </button>
            </div>
          ) : (
            <form onSubmit={enviar} className="space-y-8" noValidate>
              <ProgressBar value={progreso} />

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Campo
                  label="Nombre Completo"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  error={errorDe('nombre')}
                  onBlur={marcar('nombre')}
                  placeholder="Ej. Juan Pérez"
                  autoComplete="name"
                />

                <Campo
                  label="Teléfono / WhatsApp"
                  name="telefono"
                  type="tel"
                  value={formData.telefono}
                  onChange={handleChange}
                  error={errorDe('telefono')}
                  onBlur={marcar('telefono')}
                  placeholder="Ej. 71234567"
                  autoComplete="tel"
                  inputMode="tel"
                />

                <Campo
                  label="Ciudad o Localidad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                  error={errorDe('ciudad')}
                  onBlur={marcar('ciudad')}
                  placeholder="Ej. Apolo, La Paz, Caranavi"
                  autoComplete="address-level2"
                />

                <Campo
                  label="Fecha del Evento"
                  name="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={handleChange}
                  error={errorDe('fecha')}
                  onBlur={marcar('fecha')}
                  min={hoyLocal()}
                />

                <Campo
                  label="Tipo de Evento"
                  name="tipo_evento"
                  value={formData.tipo_evento}
                  onChange={handleChange}
                  error={errorDe('tipo_evento')}
                  onBlur={marcar('tipo_evento')}
                  placeholder="Ej. Matrimonio, 15 Años, Festival"
                />

                <Campo
                  label="Cant. Invitados Estimada"
                  name="invitados"
                  type="number"
                  value={formData.invitados}
                  onChange={handleChange}
                  error={errorDe('invitados')}
                  onBlur={marcar('invitados')}
                  min={20}
                  max={5000}
                  inputMode="numeric"
                />
              </div>

              {/* Selección de Paquete Dinámico desde BD */}
              <fieldset>
                <legend className="mb-4 block text-sm font-bold text-neutral-900">
                  Nivel de Producción Técnica (Paquete del Catálogo)
                </legend>
                {cargandoCatalogo ? (
                  <div className="py-6 text-center text-xs text-neutral-400 font-mono">
                    Cargando opciones del catálogo en vivo...
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    {paquetesDisponibles.map((pkg) => {
                      const activo =
                        formData.paquete === pkg.slug ||
                        formData.paquete?.toLowerCase() === pkg.nombre.toLowerCase();
                      const precioFinal = pkg.precio_promocional || pkg.precio_base;

                      return (
                        <label
                          key={pkg.id}
                          className={`relative flex cursor-pointer flex-col items-center justify-between rounded-2xl border-2 p-5 text-center transition-all ${
                            activo
                              ? 'border-red-600 bg-red-50/80 shadow-md ring-2 ring-red-600'
                              : 'border-neutral-200 hover:border-red-300 hover:bg-neutral-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="paquete"
                            value={pkg.slug}
                            checked={activo}
                            onChange={() => setFormData((p) => ({ ...p, paquete: pkg.slug }))}
                            className="sr-only"
                          />
                          <span className="font-black uppercase tracking-wider text-neutral-900 text-sm">
                            {pkg.nombre}
                          </span>
                          <span className="mt-2 text-lg font-black text-red-700">
                            Bs. {Number(precioFinal).toLocaleString()}
                          </span>
                          <span className="mt-1 text-[11px] text-neutral-500 line-clamp-2">
                            {pkg.descripcion_corta}
                          </span>

                          {activo && (
                            <span
                              aria-hidden="true"
                              className="absolute -top-3 rounded-full bg-red-600 px-2.5 py-0.5 text-[10px] font-bold uppercase text-white shadow"
                            >
                              Seleccionado
                            </span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                )}
              </fieldset>

              {/* Selección de Extras Dinámicos desde BD */}
              <fieldset>
                <legend className="mb-4 block text-sm font-bold text-neutral-900">
                  Requerimientos Adicionales (Extras)
                </legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {extrasDisponibles.map((extra) => {
                    const activo = formData.extras.includes(extra.slug);
                    const precio = extra.precio_promocional || extra.precio_base;

                    return (
                      <label
                        key={extra.id}
                        className={`flex cursor-pointer items-center justify-between gap-3 rounded-xl border-2 p-4 transition-all ${
                          activo ? 'border-red-600 bg-red-50' : 'border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            value={extra.slug}
                            checked={activo}
                            onChange={() => {
                              setFormData((prev) => {
                                const nuevosExtras = activo
                                  ? prev.extras.filter((x) => x !== extra.slug)
                                  : [...prev.extras, extra.slug];
                                return { ...prev, extras: nuevosExtras };
                              });
                            }}
                            className="h-5 w-5 rounded border-neutral-300 text-red-600 focus:ring-red-500"
                          />
                          <span className="text-xs font-bold text-neutral-800">{extra.nombre}</span>
                        </div>
                        <span className="text-xs font-mono font-black text-red-700">
                          +Bs.{Number(precio).toLocaleString()}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {errorServidor && (
                <div role="alert" className="rounded-r-lg border-l-4 border-red-600 bg-red-50 p-4 font-medium text-red-700 text-sm">
                  {errorServidor}
                </div>
              )}

              <div className="border-t border-neutral-100 pt-6">
                <button
                  type="submit"
                  disabled={cargando}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-neutral-950 via-neutral-950 to-red-700 py-5 text-xl font-bold uppercase tracking-wide text-white shadow-xl hover:bg-right hover:shadow-2xl disabled:opacity-70 transition-all"
                >
                  {cargando && <span className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />}
                  {cargando ? 'Calculando Presupuesto...' : 'Calcular Presupuesto con Catálogo en Vivo'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
