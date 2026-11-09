// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [permisos, setPermisos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarSesion = useCallback(async () => {
    const storedToken = localStorage.getItem('rxs_access_token');
    if (!storedToken) {
      setCargando(false);
      return;
    }

    try {
      const data = await api.getPerfil();
      setUsuario(data.usuario);
      setPermisos(data.permisos || []);
      api.setStoredUser(data.usuario);
    } catch (err) {
      console.error('Error al restaurar sesión:', err);
      api.setTokens(null, null);
      api.setStoredUser(null);
      setUsuario(null);
      setPermisos([]);
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargarSesion();
  }, [cargarSesion]);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    api.setTokens(data.access_token, data.refresh_token);
    api.setStoredUser(data.usuario);
    setUsuario(data.usuario);
    setPermisos(data.permisos || []);
    return data.usuario;
  };

  const logout = async () => {
    await api.logout();
    setUsuario(null);
    setPermisos([]);
  };

  const esSuperAdmin = () => {
    if (!usuario) return false;
    const codigosRoles = (usuario.roles || []).map((r) => r.codigo || r);
    return codigosRoles.includes('superadmin') || usuario.rol === 'superadmin';
  };

  const tienePermiso = (codigoPermiso) => {
    if (!usuario) return false;
    if (esSuperAdmin()) return true;
    if (permisos.includes('*')) return true;
    return permisos.includes(codigoPermiso);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        permisos,
        cargando,
        login,
        logout,
        tienePermiso,
        esSuperAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
