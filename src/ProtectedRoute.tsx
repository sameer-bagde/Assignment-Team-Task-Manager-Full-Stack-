import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/auth/context";
import { UserRole } from "./types";

interface ProtectedRouteProps {
  children: JSX.Element;
  requiredRole?: UserRole;
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const { pathname } = useLocation();
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace state={{ referrer: pathname }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // Not the right role — send back to projects
    return <Navigate to="/account/projects" replace />;
  }

  return <>{children}</>;
}
