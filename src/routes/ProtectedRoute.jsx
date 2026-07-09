import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectAuthChecked } from '@/features/auth/authSlice';
import Loader from '@/components/common/Loader';

export default function ProtectedRoute({ redirectTo = '/admin/login', children }) {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const authChecked = useSelector(selectAuthChecked);
  const location = useLocation();

  // Wait for the background refresh to finish before deciding to bounce
  // to /admin/login — otherwise a logged-in user hitting /admin directly
  // gets kicked to the login screen for a split second.
  if (!authChecked) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <Loader label="Loading admin" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace state={{ from: location }} />;
  }
  return children ?? <Outlet />;
}
