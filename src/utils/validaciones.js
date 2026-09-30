export const validarFormularioCotizacion = (datos) => {
  const errores = {};
  if (!datos.nombre || datos.nombre.trim().length < 3) errores.nombre = "Mínimo 3 caracteres.";
  const regexTelefono = /^[67]\d{7}$/;
  if (!datos.telefono || !regexTelefono.test(datos.telefono.replace(/\s/g, ''))) errores.telefono = "Celular inválido.";
  if (!datos.ciudad) errores.ciudad = "Ingresa una ciudad.";
  if (!datos.fecha) errores.fecha = "Selecciona la fecha.";
  if (!datos.tipo_evento) errores.tipo_evento = "Ingresa el tipo de evento.";
  if (datos.invitados < 20) errores.invitados = "Mínimo 20 invitados.";
  return errores;
};