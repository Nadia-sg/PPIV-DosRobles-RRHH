// src/pages/empleados/FichaEmpleadoLectura.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import FichaEmpleadoBase from "./FichaEmpleadoBase";

const FichaEmpleadoLectura = ({ open, onClose }) => {
  const [empleadoData, setEmpleadoData] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const empleado = user?.empleado;

    if (empleado) {
      setEmpleadoData({
        legajo: empleado.numeroLegajo,
        nombre: empleado.nombre,
        apellido: empleado.apellido,
        fechaAlta: empleado.fechaAlta || "",
        cuil: empleado.cuil || "",
        telefono: empleado.telefono || "",
        email: empleado.email || "",
        area: empleado.areaTrabajo || "",
        puesto: empleado.puesto || "",
        categoria: empleado.categoria || "",
        modalidad: empleado.modalidad || "",
        jornada: empleado.jornada || "",
        horario: empleado.horario || "",
        obraSocial: empleado.obraSocial || "",
        tipoRemuneracion: empleado.tipoRemuneracion || "",
        sueldo: empleado.sueldoBruto || "",
        banco: empleado.banco || "",
        cbu: empleado.cbu || "",
        vencimientoContrato: empleado.vencimientoContrato || "",
        categoriaImpositiva: empleado.categoriaImpositiva || "",
        foto: empleado.imagenPerfil?.data
          ? `http://localhost:4000/api/empleados/${empleado._id}/imagen`
          : empleado.nombre?.charAt(0).toUpperCase() || null,
      });
    }
  }, [open]); // se actualiza cada vez que se abre el modal

  const actions = [
    {
      label: "Solicitar Ausencia",
      onClick: () => console.log("Solicitar Ausencia"),
    },
    { label: "Enviar Mensaje", onClick: () => console.log("Mensaje") },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      {/* Header Fijo */}
      <Box sx={{ p: 4, backgroundColor: "#FFFFFF", borderBottom: "1px solid #E0E0E0", flexShrink: 0 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "#585858", mb: 0.5 }}
        >
          Mi Ficha
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Consultá tus datos personales, laborales y de contacto. Asegurate de
          mantener tu información actualizada.
        </Typography>
      </Box>

      {/* Contenido con Scroll */}
      <Box sx={{ flex: 1, overflowY: "auto", p: 4 }}>
        {empleadoData ? (
          <FichaEmpleadoBase
            data={empleadoData}
            readOnly={true}
            actions={actions}
            onClose={onClose}
            showClose={true}
          />
        ) : (
          <Typography color="error">
            No se pudo cargar la ficha del empleado.
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default FichaEmpleadoLectura;
