// src/components/auth/CanAccess.jsx
import { useAuth } from '../../context/AuthContext';

export default function CanAccess({ permission, children, fallback = null }) {
  const { tienePermiso } = useAuth();
  if (!permission || tienePermiso(permission)) {
    return children;
  }
  return fallback;
}
