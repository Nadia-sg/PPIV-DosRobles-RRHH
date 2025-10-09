import React from "react";
import { Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

/**
 * DateField
 * Campo de fecha con estilo personalizado.
 *
 * Props:
 * - label: string → título del campo (ej: "Fecha de nacimiento")
 * - value: string → fecha seleccionada o texto a mostrar
 * - onClick: function → acción al clickear el ícono (abrir date picker)
 */

export default function DateField({ label, value, onClick }) {
  return (
    <Box sx={{ mb: 3, position: "relative" }}>
      {/* Label sobre la línea superior */}
      <Typography
        sx={{
          position: "absolute",
          top: "-10px",
          left: "16px",
          backgroundColor: "#FFFFFF",
          px: 0.5,
          color: "#585858",
          fontWeight: 500,
          fontSize: "0.9rem",
        }}
      >
        {label}
      </Typography>

      {/* Contenedor principal */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          border: "1px solid #7FC6BA",
          borderRadius: "10px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          px: 2,
          py: 1.2,
          mt: 1,
          backgroundColor: "#FFFFFF",
        }}
      >
        {/* Texto o fecha */}
        <Typography
          sx={{
            color: value ? "#585858" : "#999999",
            fontSize: "0.95rem",
          }}
        >
          {value || "Seleccionar fecha"}
        </Typography>

        {/* Ícono de calendario */}
        <Box
          onClick={onClick}
          sx={{
            cursor: "pointer",
            color: "#7FC6BA",
            "&:hover": { color: "#5FA89A" },
          }}
        >
          <CalendarMonth />
        </Box>
      </Box>
    </Box>
  );
}
