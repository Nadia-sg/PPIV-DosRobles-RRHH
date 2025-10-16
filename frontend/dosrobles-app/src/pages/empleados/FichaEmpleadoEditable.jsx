// src/pages/empleados/FichaEmpleadoEditable.jsx

import React from "react";
import ModalCard from "../../components/ui/ModalCard";
import FichaEmpleadoBase from "./FichaEmpleadoBase";
import Empleado2 from "../../assets/empleados/empleado2_1.png"; // mock foto

const mockData = {
  legajo: "000123",
  nombre: "Juan",
  apellido: "Pérez",
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
    { label: "Editar", onClick: () => console.log("Editar"), variant: "contained" },
    { label: "Enviar Mensaje", onClick: () => console.log("Mensaje"), variant: "outlined" },
    { label: "Asignar Tarea", onClick: () => console.log("Asignar"), variant: "outlined" },
  ];

  return (
    <ModalCard
      open={open}
      onClose={onClose}
      title="Ficha Empleado"
      width={1000} 
      actions={actions}
    >
      <FichaEmpleadoBase
        data={mockData}
        readOnly={false}
        actions={[]}      
        showClose={false} 
      />
    </ModalCard>
  );
};

export default FichaEmpleadoEditable;

