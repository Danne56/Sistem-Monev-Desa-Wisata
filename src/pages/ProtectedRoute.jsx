import React from "react";
import { Navigate } from "react-router-dom";
import { getRoleFromToken } from "../context/UserContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
const role = getRoleFromToken();

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
