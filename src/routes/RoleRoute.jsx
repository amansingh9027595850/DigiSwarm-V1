import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectUserRole } from '@/features/auth/authSlice';

export default function RoleRoute({ allow = [], fallback = '/admin', children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const role = useSelector(selectUserRole);

  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (allow.length && !allow.includes(role)) return <Navigate to={fallback} replace />;

  return children ?? <Outlet />;
}
