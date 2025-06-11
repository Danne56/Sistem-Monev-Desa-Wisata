import React from "react";
import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../context/UserContext";


const isProtectionDisabled =
  import.meta.env.MODE === "development" &&
  import.meta.env.VITE_DISABLE_ROUTE_PROTECTION === "true";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const role = getRoleFromToken();

  if (isProtectionDisabled) {
    console.log("[DEV] Route protection is disabled.");
    return children;
  }

  if (!role) {
    // Jika tidak ada role (tidak login)
    return <Navigate to="/masuk" replace />;
  }

  if (!allowedRoles.includes(role)) {
    // Jika role tidak diperbolehkan
    return <Navigate to="/unauthorized" replace />;
  }

  // Akses diberikan
  return children;
};

export default ProtectedRoute;
