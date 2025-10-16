// src/pages/empleados/HistorialFichajes.jsx
import React from "react";
import { Box, Typography } from "@mui/material";
import CustomTable from "../../components/ui/CustomTable";

const HistorialFichajes = () => {
  // 🧩 Definición de columnas
  const columns = ["Fecha", "Hora Ingreso", "Hora Salida", "Hs Trabajadas", "Hs Estimadas"];

  // 🧩 Filas mockeadas
  const rows = [
    {
      fecha: (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600 }}>27 Ago</Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>Mié</Typography>
        </Box>
      ),
      horaIngreso: "08:05 hs",
      horaSalida: "17:05 hs",
      hsTrabajadas: "08:00 hs",
      hsEstimadas: "08:00 hs",
    },
    {
      fecha: (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600 }}>28 Ago</Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>Jue</Typography>
        </Box>
      ),
      horaIngreso: "08:10 hs",
      horaSalida: "17:00 hs",
      hsTrabajadas: "07:50 hs",
      hsEstimadas: "08:00 hs",
    },
    {
      fecha: (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <Typography sx={{ fontWeight: 600 }}>29 Ago</Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>Vie</Typography>
        </Box>
      ),
      horaIngreso: "07:55 hs",
      horaSalida: "16:55 hs",
      hsTrabajadas: "08:00 hs",
      hsEstimadas: "08:00 hs",
    },
  ];

  return (
    <Box sx={{ p: 4 }}>
      {/* === Encabezado === */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
          Mis Fichajes
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Visualizá tu historial de fichajes recientes y compará las horas trabajadas con las estimadas.
        </Typography>
      </Box>

      {/* === Tabla de Fichajes === */}
      <CustomTable columns={columns} rows={rows} />
    </Box>
  );
};

export default HistorialFichajes;
