
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const location = useLocation();
  const token = localStorage.getItem("accessToken");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (token && (!adminOnly || user?.role === "admin")) {
    return children;
  }

  return (
    <Navigate
      to={adminOnly ? "/login?redirect=/admin-dashboard" : "/login"}
      replace
      state={{ from: location }}
    />
  );
}


