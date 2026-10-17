// Reglas espejo del backend (app/schemas/cotizacion.py). El servidor sigue siendo la fuente de verdad.
// Las claves coinciden con los `name` de FormularioCotizacion (fecha, no fecha_evento).
const hoyLocal = () => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

const REGLAS = {
  nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre (mínimo 2 letras)'),
  telefono: (v) => (/^\+?\d{6,15}$/.test(v.replace(/[\s().-]/g, '')) ? '' : 'Teléfono inválido: entre 6 y 15 dígitos'),
  ciudad: (v) => (v.trim().length >= 2 ? '' : 'Indica la ciudad'),
  fecha: (v) => (!v ? 'Elige la fecha del evento' : v < hoyLocal() ? 'La fecha no puede ser anterior a hoy' : ''),
  tipo_evento: (v) => (v.trim().length >= 2 ? '' : 'Indica el tipo de evento'),
  invitados: (v) => (v !== '' && Number.isInteger(Number(v)) && Number(v) >= 20 && Number(v) <= 5000 ? '' : 'Entre 20 y 5000 invitados'),
  paquete: (v) => (v ? '' : 'Elige un paquete'),
};

export const CAMPOS_REQUERIDOS = Object.keys(REGLAS);

/** Devuelve el mensaje de error de un campo, o '' si es válido. */
export const validarCampo = (name, value) => (REGLAS[name] ? REGLAS[name](String(value ?? '')) : '');

/** Porcentaje (0-100) de campos requeridos que ya son válidos. */
export const calcularProgreso = (data) =>
  Math.round((CAMPOS_REQUERIDOS.filter((k) => !validarCampo(k, data[k])).length / CAMPOS_REQUERIDOS.length) * 100);
