import React from "react";
import { Box, Typography, Avatar, useMediaQuery, useTheme } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DescriptionIcon from "@mui/icons-material/Description";
import CustomTable from "../../components/ui/CustomTable";
import { SecondaryButton, FichaButtonWithIcon } from "../../components/ui/Buttons";

const EmpleadosList = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm")); // Detecta mobile

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
    {
      id: 3,
      foto: "/src/assets/empleados/empleado3.png",
      nombre: "Lucio Gómez",
      legajo: "A104",
      area: "Instalaciones",
      telefono: "11-2233-4455",
    },
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
    {
      id: 3,
      foto: "/src/assets/empleados/empleado3.png",
      nombre: "Lucio Gómez",
      legajo: "A104",
      area: "Instalaciones",
      telefono: "11-2233-4455",
    },
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
    {
      id: 3,
      foto: "/src/assets/empleados/empleado3.png",
      nombre: "Lucio Gómez",
      legajo: "A104",
      area: "Instalaciones",
      telefono: "11-2233-4455",
    },
  ];

  // Columnas según tamaño de pantalla
  const columns = isMobile
    ? ["Foto", "Nombre y Apellido", "Ficha"]
    : ["Foto", "Nombre y Apellido", "Legajo", "Área de Trabajo", "Teléfono", "Ficha"];

  const rows = empleados.map((emp) => ({
    foto: <Avatar src={emp.foto} alt={emp.nombre} sx={{ width: 40, height: 40 }} />,
    nombre: emp.nombre,
    legajo: emp.legajo,
    area: emp.area,
    telefono: emp.telefono,
    ficha: <FichaButtonWithIcon icon={DescriptionIcon} label="Ver Ficha" />,
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
        <Typography variant="h5" sx={{ fontWeight: "bold", color: "#585858" }}>
          Empleados
        </Typography>

        <SecondaryButton
          startIcon={<EditIcon />}
          sx={{
            fontSize: isMobile ? "0.75rem" : "1rem",
            padding: isMobile ? "0.25rem 0.5rem" : "0.5rem 1rem",
            minWidth: isMobile ? 100 : "auto",
          }}
        >
          Nuevo Empleado
        </SecondaryButton>
      </Box>

      {/* Tabla */}
      <CustomTable
        columns={columns}
        rows={rows.map((row) => {
          if (isMobile) {
            // Mantener solo las columnas visibles en mobile
            return {
              foto: row.foto,
              nombre: row.nombre,
              ficha: row.ficha,
            };
          }
          return row;
        })}
      />
    </Box>
  );
};

export default EmpleadosList;