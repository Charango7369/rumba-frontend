// src/components/cotizacion/FormularioCotizacion.jsx
import { useCotizacion } from '../../hooks/useCotizacion';

/** Fecha mínima (hoy, en hora local) para impedir fechas pasadas. */
const hoyLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/**
 * Campo de texto accesible y reutilizable.
 * - label asociado con htmlFor/id
 * - aria-invalid + aria-describedby enlazan el error con el input
 * - ...rest permite pasar placeholder, min, inputMode, autoComplete, etc.
 */
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
        className={`w-full rounded-xl border bg-neutral-50 px-4 py-3 text-neutral-900 outline-none
                    motion-safe:transition-all focus:bg-white focus:ring-2 focus:ring-red-600
                    ${error ? 'border-red-600' : 'border-neutral-300 focus:border-red-600'}`}
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

const PAQUETES = ['esencial', 'premium', 'pro'];

const OPCIONES_EXTRAS = [
  { id: 'pantallas', label: 'Pantallas LED' },
  { id: 'humo', label: 'Máquina de Humo' },
  { id: 'animacion', label: 'Animación / DJ' },
  { id: 'streaming', label: 'Streaming en vivo' },
];

export default function FormularioCotizacion() {
  const {
    formData, erroresValidacion, estadoCotizacion,
    handleChange, handleCheckboxChange, handleSubmit, resetFormulario,
  } = useCotizacion();

  const { cargando, resultado, errorServidor } = estadoCotizacion;

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
            Obtén un presupuesto preliminar y asegura tu fecha
          </p>
        </header>

        <div className="p-8 md:p-10">
          {resultado ? (
            /* role="status": el lector de pantalla anuncia el resultado al aparecer */
            <div role="status" className="mx-auto max-w-lg text-center">
              <div className="mb-8 rounded-2xl border border-green-200 bg-green-50 p-8 shadow-sm">
                <h3 className="mb-3 text-2xl font-bold text-green-800">¡Cotización Generada!</h3>
                <p className="mb-4 text-neutral-600">Monto estimado para tu evento:</p>
                <p className="mb-2 text-5xl font-black text-neutral-800">
                  Bs. {resultado.resumen.estimado_bob}
                </p>
              </div>

              <a
                href={resultado.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex w-full items-center justify-center gap-3 rounded-xl bg-[#25D366] px-8 py-4
                           text-xl font-bold uppercase text-neutral-950 shadow-lg
                           motion-safe:transition-all hover:bg-[#1EBE5D] hover:shadow-xl motion-safe:hover:-translate-y-1
                           focus:outline-none focus-visible:ring-4 focus-visible:ring-neutral-900"
              >
                {/* Mantén aquí tu <svg> de WhatsApp original, agregando aria-hidden="true" */}
                Reservar por WhatsApp
                <span className="sr-only"> (se abre en una pestaña nueva)</span>
              </a>

              <button
                type="button"
                onClick={resetFormulario}
                className="mt-6 rounded font-medium text-neutral-600 underline motion-safe:transition-colors
                           hover:text-red-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-600"
              >
                Hacer otra cotización
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Campo label="Nombre Completo" name="nombre" value={formData.nombre}
                  onChange={handleChange} error={erroresValidacion.nombre}
                  placeholder="Ej. Juan Pérez" autoComplete="name" />

                <Campo label="Teléfono" name="telefono" type="tel" value={formData.telefono}
                  onChange={handleChange} error={erroresValidacion.telefono}
                  placeholder="Ej. 71234567" autoComplete="tel" inputMode="tel" />

                <Campo label="Ciudad" name="ciudad" value={formData.ciudad}
                  onChange={handleChange} error={erroresValidacion.ciudad}
                  placeholder="Ej. Apolo" autoComplete="address-level2" />

                <Campo label="Fecha del Evento" name="fecha" type="date" value={formData.fecha}
                  onChange={handleChange} error={erroresValidacion.fecha} min={hoyLocal()} />

                <Campo label="Tipo de Evento" name="tipo_evento" value={formData.tipo_evento}
                  onChange={handleChange} error={erroresValidacion.tipo_evento}
                  placeholder="Ej. Matrimonio, 15 años" />

                <Campo label="Cant. Invitados Aprox." name="invitados" type="number"
                  value={formData.invitados} onChange={handleChange}
                  error={erroresValidacion.invitados} min={1} inputMode="numeric" />
              </div>

              {/* fieldset + legend: el grupo se anuncia con su nombre */}
              <fieldset>
                <legend className="mb-4 block text-sm font-bold text-neutral-900">
                  Nivel de Producción (Paquete)
                </legend>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {PAQUETES.map((pkg) => {
                    const activo = formData.paquete === pkg;
                    return (
                      <label
                        key={pkg}
                        className={`relative flex cursor-pointer flex-col items-center rounded-2xl border-2 p-5
                                    motion-safe:transition-all focus-within:ring-2 focus-within:ring-red-600 focus-within:ring-offset-2
                                    ${activo ? 'border-red-600 bg-red-50 shadow-md'
                                             : 'border-neutral-200 hover:border-red-300 hover:bg-neutral-50'}`}
                      >
                        <input type="radio" name="paquete" value={pkg} checked={activo}
                          onChange={handleChange} className="sr-only" />
                        <span className="font-black uppercase tracking-wider text-neutral-800">{pkg}</span>
                        {/* El estado ya lo comunica el radio "checked"; esto es solo visual */}
                        {activo && (
                          <span aria-hidden="true"
                            className="absolute -top-3 rounded-full bg-red-600 px-2 py-1 text-[10px] font-bold uppercase text-white">
                            Seleccionado
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-4 block text-sm font-bold text-neutral-900">
                  Requerimientos Extras
                </legend>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                  {OPCIONES_EXTRAS.map((extra) => {
                    const activo = formData.extras.includes(extra.id);
                    return (
                      <label
                        key={extra.id}
                        className={`flex cursor-pointer items-center gap-3 rounded-xl border-2 p-4
                                    motion-safe:transition-all focus-within:ring-2 focus-within:ring-red-600
                                    ${activo ? 'border-red-600 bg-red-50' : 'border-neutral-200 hover:bg-neutral-50'}`}
                      >
                        <input type="checkbox" value={extra.id} checked={activo}
                          onChange={handleCheckboxChange}
                          className="h-5 w-5 rounded border-neutral-300 text-red-600 focus:ring-red-500" />
                        <span className="text-sm font-medium text-neutral-700">{extra.label}</span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>

              {/* role="alert": se anuncia inmediatamente */}
              {errorServidor && (
                <div role="alert"
                  className="rounded-r-lg border-l-4 border-red-600 bg-red-50 p-4 font-medium text-red-700">
                  {errorServidor}
                </div>
              )}

              <div className="border-t border-neutral-100 pt-6">
                <button
                  type="submit"
                  disabled={cargando}
                  aria-busy={cargando}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-neutral-950 py-5 text-xl
                             font-bold uppercase tracking-wide text-white shadow-xl motion-safe:transition-all
                             hover:bg-red-700 hover:shadow-2xl disabled:cursor-not-allowed disabled:opacity-70
                             focus:outline-none focus-visible:ring-4 focus-visible:ring-amber-500"
                >
                  {cargando && (
                    <span aria-hidden="true"
                      className="h-6 w-6 animate-spin rounded-full border-b-2 border-white" />
                  )}
                  {cargando ? 'Procesando...' : 'Calcular Presupuesto'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}