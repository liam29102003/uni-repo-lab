import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = localStorage.getItem("role");
  // Block if not logged in or role not allowed
  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }
  return children;
};

export default ProtectedRoute;