// src/pages/empleados/FichaEmpleadoEditable.jsx
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

const FichaEmpleadoEditable = ({ open, onClose }) => {
  if (!open) return null;

  const actions = [
    { label: "Editar", onClick: () => console.log("Editar") },
    { label: "Enviar Mensaje", onClick: () => console.log("Mensaje") },
    { label: "Asignar Tarea", onClick: () => console.log("Asignar") },
  ];

  return <FichaEmpleadoBase data={mockData} readOnly={false} actions={actions} onClose={onClose} />;
};

export default FichaEmpleadoEditable;
