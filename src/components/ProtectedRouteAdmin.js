import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRouteAdmin = ({ children }) => {
  const token = localStorage.getItem("jwtToken");

  if (!token) return <Navigate to="/" />;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (payload.role !== "ROLE_ADMIN") {
      return <Navigate to="/" />;
    }
    return children;
  } catch (e) {
    console.error("Errore nella decodifica del token:", e);
    return <Navigate to="/" />;
  }
};

export default ProtectedRouteAdmin;
