// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export const obtenerServicios = async () => {
  const response = await fetch(`${API_URL}/api/servicios`);
  if (!response.ok) {
    throw new Error('No se pudieron cargar los servicios de producción técnica.');
  }
  return response.json();
};

export const generarCotizacion = async (formData) => {
  const response = await fetch(`${API_URL}/api/cotizacion`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail?.[0]?.msg || 'Error al procesar la cotización en el servidor.');
  }
  return response.json();
};