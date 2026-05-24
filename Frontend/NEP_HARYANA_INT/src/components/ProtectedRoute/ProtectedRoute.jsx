import { Navigate } from "react-router-dom";
import { getAuthToken, getSavedAuthUser, getDashboardPathForUser } from "../../api/auth";

export function ProtectedRoute({ children, allowedRoles }) {
  const token = getAuthToken();
  const user = getSavedAuthUser();

  if (!token || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const correctDashboard = getDashboardPathForUser(user);
    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}

export function GuestRoute({ children }) {
  const token = getAuthToken();
  const user = getSavedAuthUser();

  if (token && user) {
    const correctDashboard = getDashboardPathForUser(user);
    return <Navigate to={correctDashboard} replace />;
  }

  return children;
}
