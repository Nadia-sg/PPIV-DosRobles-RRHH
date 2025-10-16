// src/pages/empleados/FichaEmpleadoLectura.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import FichaEmpleadoBase from "./FichaEmpleadoBase";
import Empleado2 from "../../assets/empleados/empleado1_1.png"; // mock foto

const mockData = {
  legajo: "000123",
  nombre: "Mariana",
  apellido: "Gómez",
  fechaAlta: "01/10/2025",
  cuil: "20-12345678-9",
  telefono: "011-1234-5678",
  email: "mariana@example.com",
  area: "Recursos Humanos",
  puesto: "Administrativa",
  categoria: "Full Time",
  modalidad: "Contrato",
  jornada: "Completa",
  horario: "9 a 18 hs",
  obraSocial: "OSDE",
  tipoRemuneracion: "Jornada completa",
  sueldo: "150000",
  banco: "Banco Nación",
  cbu: "1234567890123456789012",
  vencimientoContrato: "31/12/2025",
  categoriaImpositiva: "Dependencia",
  foto: Empleado2,
};

const FichaEmpleadoLectura = ({ open, onClose }) => {
  const actions = [
    { label: "Solicitar Ausencia", onClick: () => console.log("Solicitar Ausencia") },
    { label: "Enviar Mensaje", onClick: () => console.log("Mensaje") },
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* Header específico para lectura */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 0.5 }}>
          Mi Ficha
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080", mb: 4 }}>
          Consultá tus datos personales, laborales y de contacto. 
          Asegurate de mantener tu información actualizada.
        </Typography>
      </Box>

      {/* Ficha base sin header */}
      <FichaEmpleadoBase data={mockData} readOnly={true} actions={actions} onClose={onClose} showClose={true} />
    </Box>
  );
};

export default FichaEmpleadoLectura;

