// Reglas alineadas con el backend (app/schemas/cotizacion.py). Esta función es la fuente única:
// también alimenta la validación en vivo y la barra de progreso (utils/validacionCotizacion.js).
const fechaLocal = (anios = 0) => {
  const d = new Date();
  d.setFullYear(d.getFullYear() + anios);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

export const validarFormularioCotizacion = (datos) => {
  const errores = {};
  if (!datos.nombre || datos.nombre.trim().length < 3) errores.nombre = "Mínimo 3 caracteres.";
  const regexTelefono = /^[67]\d{7}$/;
  if (!datos.telefono || !regexTelefono.test(datos.telefono.replace(/\s/g, ''))) errores.telefono = "Celular inválido.";
  if (!datos.ciudad || datos.ciudad.trim().length < 2) errores.ciudad = "Ingresa una ciudad.";
  if (!datos.fecha) errores.fecha = "Selecciona la fecha.";
  else if (datos.fecha < fechaLocal()) errores.fecha = "La fecha no puede ser anterior a hoy.";
  else if (datos.fecha > fechaLocal(3)) errores.fecha = "La fecha no puede superar los 3 años.";
  if (!datos.tipo_evento || datos.tipo_evento.trim().length < 2) errores.tipo_evento = "Ingresa el tipo de evento.";
  if (!Number.isInteger(datos.invitados)) errores.invitados = "Ingresa un número entero.";
  else if (datos.invitados < 20) errores.invitados = "Mínimo 20 invitados.";
  else if (datos.invitados > 5000) errores.invitados = "Máximo 5000 invitados.";
  return errores;
};