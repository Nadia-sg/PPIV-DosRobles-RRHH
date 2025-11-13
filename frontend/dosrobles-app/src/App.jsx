import './App.css';
import './index.css';
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';

// Módulo 1 - Empleados
import EmpleadosList from "./pages/empleados/EmpleadosList";
import FichaEmpleadoLectura from "./pages/empleados/FichaEmpleadoLectura";

// Módulo 2 - Fichaje
import HistorialFichajes from "./pages/fichaje/HistorialFichajes";
import FichajeEmpleados from "./pages/fichaje/FichajeEmpleados";

// Módulo 3 - Licencias
import LicenciasList from "./pages/licencias/LicenciasList";
import SolicitudesLicencias from "./pages/licencias/SolicitudesLicencias";
import CalendarioLicencias from "./pages/licencias/CalendarioLicencias";
import BandejaEntrada from "./pages/BandejaEntrada";

// Módulo 4 - Nómina
import CalculoHaberes from "./pages/nomina/CalculoHaberes";
import RecibosDigitales from "./pages/nomina/RecibosDigitales";

// Módulo 5 - Usuarios
import UsuariosList from "./pages/usuarios/UsuariosList"; // <-- Nueva ruta

// Pruebas de componentes
import ComponentsDemo from "./pages/ComponentsDemo";
import FormDemo from "./pages/FormDemo";

function App() {
  return (
    <UserProvider>
      <Routes>
        {/* Redirección inicial al login */}
        <Route path="/" element={<Navigate to="/login" />} />

      {/* Login sin layout */}
      <Route path="/login" element={<LoginPage />} />

      {/* Todas las demás rutas con layout */}
      <Route element={<AppLayout />}>
        {/* Home */}
        <Route path="/home" element={<Home />} />

        {/* Bandeja de Entrada */}
        <Route path="/bandeja-entrada" element={<BandejaEntrada />} />

        {/* Empleados */}
        <Route
          path="/empleados"
          element={
            <ProtectedRoute
              element={<EmpleadosList />}
              requiredRole={["gerente", "rrhh", "admin"]}
            />
          }
        />
        <Route path="/mi-ficha" element={<FichaEmpleadoLectura />} />

        {/* Fichaje */}
        <Route path="/fichaje/historial" element={<HistorialFichajes />} />
        <Route
          path="/fichaje/empleados"
          element={
            <ProtectedRoute
              element={<FichajeEmpleados />}
              requiredRole={["gerente", "rrhh", "admin"]}
            />
          }
        />

        {/* Licencias */}
        <Route path="/licencias" element={<LicenciasList />} />
        <Route path="/ausencias" element={<LicenciasList />} />
        <Route
          path="/solicitudes-licencias"
          element={
            <ProtectedRoute
              element={<SolicitudesLicencias />}
              requiredRole={["gerente", "rrhh", "admin"]}
            />
          }
        />
        <Route path="/licencias/calendario" element={<CalendarioLicencias />} />

        {/* Nómina */}
        <Route
          path="/nomina/calculo"
          element={
            <ProtectedRoute
              element={<CalculoHaberes />}
              requiredRole={["gerente", "rrhh", "admin"]}
            />
          }
        />
        <Route
          path="/calculo-haberes"
          element={
            <ProtectedRoute
              element={<CalculoHaberes />}
              requiredRole={["gerente", "rrhh", "admin"]}
            />
          }
        />
        <Route path="/nomina/recibos" element={<RecibosDigitales />} />
        <Route path="/recibos-digitales" element={<RecibosDigitales />} />

        {/* Usuarios */}
        <Route path="/usuarios" element={<UsuariosList />} /> {/* <-- Nueva ruta */}

        {/* Demo componentes */}
        <Route path="/components-demo" element={<ComponentsDemo />} />
        <Route path="/form-demo" element={<FormDemo />} />

        {/* Ruta por defecto */}
        <Route path="*" element={<h1>Página no encontrada</h1>} />
      </Route>
    </Routes>
    </UserProvider>
  );
}

export default App;
