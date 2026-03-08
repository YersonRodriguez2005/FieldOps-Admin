import React from 'react';
import { Navigate } from 'react-router-dom';

// Ruta protegida
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    // 'replace' evita que el usuario vuelva atrás con el botón del navegador
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;