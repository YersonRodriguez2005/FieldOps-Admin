import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Dashboard from './Pages/Dashboard';
import Usuarios from './Pages/Usuarios';
import Equipos from './Pages/Equipos';
import Ordenes from './Pages/Ordenes';
import Perfil from './Pages/Perfil';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// ─── Sistema de notificaciones personalizado FieldOps ───────────────────────
// Reemplaza react-toastify con un sistema propio que sigue la paleta de la app
import { FieldOpsToastProvider } from './components/FieldOpsToast';

export default function App() {
  return (
    <FieldOpsToastProvider>
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans antialiased selection:bg-blue-500 selection:text-white">
        <Router>
          <Routes>
            <Route path='/' element={<Login />} />

            {/* Ruta Protegida Dashboard */}
            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            {/* Ruta Protegida Usuarios */}
            <Route
              path='/usuarios'
              element={
                <ProtectedRoute>
                  <Usuarios />
                </ProtectedRoute>
              }
            />

            {/* Ruta Protegida Equipos */}
            <Route
              path='/equipos'
              element={
                <ProtectedRoute>
                  <Equipos />
                </ProtectedRoute>
              }
            />

            {/* Ruta Protegida Ordenes */}
            <Route
              path='/ordenes'
              element={
                <ProtectedRoute>
                  <Ordenes />
                </ProtectedRoute>
              }
            />

            {/* Ruta Protegida Perfil */}
            <Route
              path='/perfil'
              element={
                <ProtectedRoute>
                  <Perfil />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Router>
      </div>
    </FieldOpsToastProvider>
  );
}