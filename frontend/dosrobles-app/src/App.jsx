import './App.css'
import './index.css';
import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from './pages/Home';

// Módulo 1 - Empleados
import EmpleadosList from "./pages/empleados/EmpleadosList";


// Módulo 2 - Fichaje
import HistorialFichajes from "./pages/fichaje/HistorialFichajes";

// Módulo 3 - Licencias
import LicenciasList from "./pages/licencias/LicenciasList";
import CalendarioLicencias from "./pages/licencias/CalendarioLicencias";

// Módulo 4 - Nómina
import CalculoHaberes from "./pages/nomina/CalculoHaberes";
import RecibosDigitales from "./pages/nomina/RecibosDigitales";


function App() {
  return (<Routes>
      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Empleados */}
      <Route path="/empleados" element={<EmpleadosList />} />

      {/* Fichaje */}
      <Route path="/fichaje/historial" element={<HistorialFichajes />} />

      {/* Licencias */}
      <Route path="/licencias" element={<LicenciasList />} />
      <Route path="/licencias/calendario" element={<CalendarioLicencias />} />

      {/* Nómina */}
      <Route path="/nomina/calculo" element={<CalculoHaberes />} />
      <Route path="/nomina/recibos" element={<RecibosDigitales />} />

      {/* Ruta por defecto */}
      <Route path="*" element={<h1>Página no encontrada</h1>} />
    </Routes>
  );
}

export default App
