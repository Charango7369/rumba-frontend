// src/services/api.js
const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/+$/, '');

export const resolveMediaUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) return url;
  return `${API_URL}${url.startsWith('/') ? '' : '/'}${url}`;
};

class ApiService {
  constructor() {
    this.accessToken = localStorage.getItem('rxs_access_token') || null;
    this.refreshToken = localStorage.getItem('rxs_refresh_token') || null;
    this.isRefreshing = false;
    this.refreshSubscribers = [];
  }

  setTokens(access, refresh) {
    this.accessToken = access;
    this.refreshToken = refresh;
    if (access) localStorage.setItem('rxs_access_token', access);
    else localStorage.removeItem('rxs_access_token');

    if (refresh) localStorage.setItem('rxs_refresh_token', refresh);
    else localStorage.removeItem('rxs_refresh_token');
  }

  getStoredUser() {
    try {
      const u = localStorage.getItem('rxs_user');
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  }

  setStoredUser(user) {
    if (user) localStorage.setItem('rxs_user', JSON.stringify(user));
    else localStorage.removeItem('rxs_user');
  }

  onRefreshed(token) {
    this.refreshSubscribers.forEach((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  async request(path, options = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response;
    try {
      response = await fetch(`${API_URL}${path}`, { ...options, headers });
    } catch (err) {
      throw new Error('No se pudo establecer conexión con el servidor.');
    }

    // Interceptor: si responde 401 y hay refresh_token disponible, renovar silenciosamente
    if (response.status === 401 && this.refreshToken && !options._retry) {
      if (this.isRefreshing) {
        return new Promise((resolve) => {
          this.refreshSubscribers.push((newToken) => {
            options.headers = { ...options.headers, Authorization: `Bearer ${newToken}` };
            resolve(this.request(path, options));
          });
        });
      }

      options._retry = true;
      this.isRefreshing = true;

      try {
        const refreshRes = await fetch(`${API_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh_token: this.refreshToken }),
        });

        if (refreshRes.ok) {
          const data = await refreshRes.json();
          this.setTokens(data.access_token, data.refresh_token);
          this.isRefreshing = false;
          this.onRefreshed(data.access_token);
          headers['Authorization'] = `Bearer ${data.access_token}`;
          return fetch(`${API_URL}${path}`, { ...options, headers }).then((r) => r.json());
        } else {
          this.setTokens(null, null);
          this.setStoredUser(null);
          window.location.href = '/admin/login';
        }
      } catch (e) {
        this.setTokens(null, null);
        this.setStoredUser(null);
        window.location.href = '/admin/login';
      } finally {
        this.isRefreshing = false;
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const mensaje = data?.detail || 'Ocurrió un error en la solicitud.';
      throw new Error(typeof mensaje === 'string' ? mensaje : JSON.stringify(mensaje));
    }

    return data;
  }

  // --- Catálogo Público ---
  obtenerServicios = () => this.request('/api/v1/services');
  obtenerServiciosDestacados = () => this.request('/api/v1/services/featured');
  obtenerOpcionesCotizacion = () => this.request('/api/v1/services/catalog/quote-options');
  generarCotizacion = (formData) => this.request('/api/v1/quotes', { method: 'POST', body: JSON.stringify(formData) });

  // --- Subida de Imágenes Multipart ---
  subirImagen = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const headers = {};
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }

    let response;
    try {
      response = await fetch(`${API_URL}/api/v1/admin/services/upload-image`, {
        method: 'POST',
        headers,
        body: formData,
      });
    } catch (err) {
      throw new Error('Fallo de red al subir la imagen al servidor.');
    }

    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data?.detail || 'Error al subir la imagen.');
    }

    return data;
  };

  // --- Autenticación ---
  login = (credentials) => this.request('/api/v1/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  getPerfil = () => this.request('/api/v1/auth/me');
  logout = async () => {
    try {
      if (this.refreshToken) {
        await this.request('/api/v1/auth/logout', { method: 'POST', body: JSON.stringify({ refresh_token: this.refreshToken }) });
      }
    } finally {
      this.setTokens(null, null);
      this.setStoredUser(null);
    }
  };

  // --- Admin: Métricas Dashboard ---
  getDashboardMetrics = () => this.request('/api/v1/admin/metrics/dashboard');

  // --- Admin: Catálogo de Servicios ---
  getAdminServicios = () => this.request('/api/v1/admin/services');
  crearServicio = (servicio) => this.request('/api/v1/admin/services', { method: 'POST', body: JSON.stringify(servicio) });
  actualizarServicio = (id, servicio) => this.request(`/api/v1/admin/services/${id}`, { method: 'PUT', body: JSON.stringify(servicio) });
  actualizarPrecio = (id, precios) => this.request(`/api/v1/admin/services/${id}/price`, { method: 'PATCH', body: JSON.stringify(precios) });
  toggleEstadoServicio = (id, activo) => this.request(`/api/v1/admin/services/${id}/status`, { method: 'PATCH', body: JSON.stringify({ activo }) });
  eliminarServicio = (id) => this.request(`/api/v1/admin/services/${id}`, { method: 'DELETE' });

  // --- Admin: Cotizaciones y Solicitudes ---
  getAdminCotizaciones = (params = '') => this.request(`/api/v1/admin/quotes?${params}`);
  actualizarEstadoCotizacion = (id, estado, observaciones) =>
    this.request(`/api/v1/admin/quotes/${id}`, { method: 'PATCH', body: JSON.stringify({ estado, observaciones }) });
  eliminarCotizacion = (id) => this.request(`/api/v1/admin/quotes/${id}`, { method: 'DELETE' });

  // --- Admin: Usuarios y Roles (SuperAdmin) ---
  getAdminUsuarios = () => this.request('/api/v1/admin/users');
  crearUsuario = (usuario) => this.request('/api/v1/admin/users', { method: 'POST', body: JSON.stringify(usuario) });
  actualizarUsuario = (id, datos) => this.request(`/api/v1/admin/users/${id}`, { method: 'PATCH', body: JSON.stringify(datos) });
  eliminarUsuario = (id) => this.request(`/api/v1/admin/users/${id}`, { method: 'DELETE' });

  // --- Admin: Auditoría (SuperAdmin) ---
  getAdminAuditoria = (params = '') => this.request(`/api/v1/admin/audit?${params}`);
}

export const api = new ApiService();
export const obtenerServicios = api.obtenerServicios;
export const generarCotizacion = api.generarCotizacion;
export default api;
