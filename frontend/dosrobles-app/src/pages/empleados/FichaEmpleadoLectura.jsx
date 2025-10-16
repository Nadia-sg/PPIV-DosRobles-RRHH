// src/pages/empleados/FichaEmpleadoLectura.jsx
import React from "react";
import FichaEmpleadoBase from "./FichaEmpleadoBase";
import Empleado2 from "../../assets/empleados/empleado2.png"; // mock foto

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
  if (!open) return null;

  const actions = [
    { label: "Solicitar Ausencia", onClick: () => console.log("Solicitar Ausencia") },
    { label: "Enviar Mensaje", onClick: () => console.log("Mensaje") },
  ];

  return <FichaEmpleadoBase data={mockData} readOnly={true} actions={actions} onClose={onClose} />;
};

export default FichaEmpleadoLectura;
