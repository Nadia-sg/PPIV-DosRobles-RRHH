// src/pages/empleados/EmpleadosList.jsx

import React, { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import CustomTable from "../../components/ui/CustomTable";
import {
  SecondaryButton,
  FichaButtonWithIcon,
} from "../../components/ui/Buttons";
import NuevoEmpleadoModal from "../../components/modales/NuevoEmpleadoModal";
import FichaEmpleadoEditable from "./FichaEmpleadoEditable";

const EmpleadosList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [modalOpen, setModalOpen] = useState(false);
  const [fichaOpen, setFichaOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  const empleados = [
    {
      id: 1,
      foto: "/src/assets/empleados/empleado1.png",
      nombre: "Mariana Carmona",
      legajo: "A102",
      area: "Recursos Humanos",
      telefono: "11-3456-7890",
    },
    {
      id: 2,
      foto: "/src/assets/empleados/empleado2.png",
      nombre: "Juan Pérez",
      legajo: "A103",
      area: "Carpintería",
      telefono: "11-9876-5432",
    },
  ];

  const handleVerFicha = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setFichaOpen(true);
  };

  const columns = isMobile
    ? ["Foto", "Nombre y Apellido", "Ficha"]
    : ["Foto", "Nombre y Apellido", "Legajo", "Área de Trabajo", "Teléfono", "Ficha"];

  const rows = empleados.map((emp) => ({
    foto: <Avatar src={emp.foto} alt={emp.nombre} sx={{ width: 40, height: 40 }} />,
    nombre: emp.nombre,
    legajo: emp.legajo,
    area: emp.area,
    telefono: emp.telefono,
    ficha: (
      <FichaButtonWithIcon
        icon={DescriptionIcon}
        label="Ver Ficha"
        onClick={() => handleVerFicha(emp)}
      />
    ),
  }));

  return (
    <Box sx={{ padding: "2rem" }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
          Empleados
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Visualizá el listado completo de empleados y accedé a su información detallada
        </Typography>
      </Box>

        <SecondaryButton
          startIcon={<EditIcon />}
          onClick={() => setModalOpen(true)}
        >
          Nuevo Empleado
        </SecondaryButton>
      </Box>

      {/* Tabla */}
      <CustomTable
        columns={columns}
        rows={
          isMobile
            ? rows.map((row) => ({
                foto: row.foto,
                nombre: row.nombre,
                ficha: row.ficha,
              }))
            : rows
        }
      />

      {/* Modal Nuevo Empleado */}
      <NuevoEmpleadoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
      />

      {/* Modal Ficha Editable */}
      {fichaOpen && empleadoSeleccionado && (
        <FichaEmpleadoEditable
          open={fichaOpen}
          onClose={() => setFichaOpen(false)}
          empleado={empleadoSeleccionado}
        />
      )}
    </Box>
  );
};

export default EmpleadosList;
