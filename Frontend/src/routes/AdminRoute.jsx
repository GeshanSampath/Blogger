// src/routes/AdminRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "super_admin") {
    // Not logged in or not super admin → redirect to login
    return <Navigate to="/login" />;
  }

  return children;
};

export default AdminRoute;
