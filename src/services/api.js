// src/services/api.js

// Se quita la barra final para evitar rutas con "//".
// Vite inyecta esta variable en build time: si la cambias en Cloudflare, redeploya.
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

// Margen para cold starts de Railway.
const TIMEOUT_MS = 15000;

if (!API_URL) {
  console.error('Falta VITE_API_URL. Revisa .env.local o las variables de Cloudflare Pages.');
}

/** Mensajes pensados para el usuario final (los detalles técnicos van a console.error). */
const MSG = {
  config: 'El servicio no está disponible por el momento. Inténtalo más tarde.',
  red: 'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.',
  timeout: 'El servidor está tardando más de lo normal. Inténtalo de nuevo en unos segundos.',
  invalida: 'Recibimos una respuesta inesperada del servidor. Inténtalo de nuevo.',
  validacion: 'Revisa los datos del formulario e inténtalo de nuevo.',
  limite: 'Demasiados intentos. Espera un momento e inténtalo otra vez.',
  servidor: 'No pudimos procesar tu solicitud. Inténtalo de nuevo o escríbenos por WhatsApp.',
};

/** Error tipado: conserva status y detalles por si luego quieres mapear errores a campos. */
export class ApiError extends Error {
  constructor(message, { status, detalles } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.detalles = detalles;
  }
}

/** Traduce la respuesta de error de FastAPI a un mensaje amigable. */
function mensajeDeError(status, body) {
  // HTTPException(detail="texto"): mensaje controlado por tu backend, se muestra tal cual.
  if (typeof body?.detail === 'string') return body.detail;
  if (status === 422) return MSG.validacion; // detail es un array técnico de Pydantic
  if (status === 429) return MSG.limite;
  return MSG.servidor;
}

/**
 * Capa HTTP única: URL base, timeout, errores y validación del JSON.
 * Acepta un `signal` opcional para cancelar desde el componente.
 */
async function request(path, { timeoutMs = TIMEOUT_MS, signal, ...options } = {}) {
  if (!API_URL) throw new ApiError(MSG.config);

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  signal?.addEventListener('abort', () => controller.abort(), { once: true });

  let response;
  try {
    response = await fetch(`${API_URL}${path}`, { ...options, signal: controller.signal });
  } catch (err) {
    if (signal?.aborted) throw err; // cancelado a propósito por el componente
    console.error('Fallo de red:', err);
    throw new ApiError(err.name === 'AbortError' ? MSG.timeout : MSG.red);
  } finally {
    clearTimeout(timer);
  }

  // Solo se parsea si de verdad es JSON (un 502 de proxy suele ser HTML)
  const esJson = response.headers.get('content-type')?.includes('application/json');
  const body = esJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    console.error(`API ${response.status} en ${path}:`, body);
    throw new ApiError(mensajeDeError(response.status, body), {
      status: response.status,
      detalles: body?.detail,
    });
  }

  // 200 sin JSON = probablemente VITE_API_URL mal configurada (devolvió index.html)
  if (body === null) throw new ApiError(MSG.invalida, { status: response.status });
  return body;
}

export const obtenerServicios = (opts) => request('/api/servicios', opts);

export const generarCotizacion = (formData, opts) =>
  request('/api/cotizacion', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
    ...opts,
  });