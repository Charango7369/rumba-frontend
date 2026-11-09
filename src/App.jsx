// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';

import LandingPage from './pages/public/LandingPage';
import LoginAdmin from './pages/admin/LoginAdmin';
import AdminLayout from './pages/admin/AdminLayout';
import DashboardPage from './pages/admin/DashboardPage';
import CatalogoAdminPage from './pages/admin/CatalogoAdminPage';
import CotizacionesAdminPage from './pages/admin/CotizacionesAdminPage';
import UsuariosAdminPage from './pages/admin/UsuariosAdminPage';
import AuditoriaAdminPage from './pages/admin/AuditoriaAdminPage';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Ruta Pública Principal */}
          <Route path="/" element={<LandingPage />} />

          {/* Autenticación Administrativa */}
          <Route path="/admin/login" element={<LoginAdmin />} />

          {/* Panel Administrativo Protegido con RBAC */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            
            <Route
              path="dashboard"
              element={
                <ProtectedRoute requiredPermission="dashboard:view">
                  <DashboardPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="catalogo"
              element={
                <ProtectedRoute requiredPermission="catalog:read">
                  <CatalogoAdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="cotizaciones"
              element={
                <ProtectedRoute requiredPermission="quotes:read">
                  <CotizacionesAdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="usuarios"
              element={
                <ProtectedRoute requiredPermission="users:manage">
                  <UsuariosAdminPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="auditoria"
              element={
                <ProtectedRoute requiredPermission="audit:read">
                  <AuditoriaAdminPage />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
