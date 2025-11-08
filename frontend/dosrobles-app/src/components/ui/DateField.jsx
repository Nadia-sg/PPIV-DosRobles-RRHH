import React, { useRef } from "react";
import { Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

/**
 * DateField funcional con diseño personalizado
 * Usa un input date invisible que se dispara al hacer clic en el ícono o el texto.
 */
export default function DateField({ label, value, onChange }) {
  const inputRef = useRef(null);

  const handleOpen = () => {
    if (inputRef.current) inputRef.current.showPicker?.(); // abre el selector nativo si el navegador lo soporta
    else inputRef.current?.focus();
  };

  return (
    <Box sx={{ mb: 3, position: "relative" }}>
      {/* Label */}
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
        onClick={handleOpen}
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
          cursor: "pointer",
        }}
      >
        {/* Texto o fecha */}
        <Typography
          sx={{
            color: value ? "#585858" : "#999999",
            fontSize: "0.95rem",
          }}
        >
          {value ? new Date(value).toLocaleDateString("es-AR") : "Seleccionar fecha"}
        </Typography>

        {/* Ícono */}
        <Box
          sx={{
            color: "#7FC6BA",
            "&:hover": { color: "#5FA89A" },
          }}
        >
          <CalendarMonth />
        </Box>

        {/* Input real oculto */}
        <input
          ref={inputRef}
          type="date"
          value={value || ""}
          onChange={onChange}
          style={{
            opacity: 0,
            position: "absolute",
            pointerEvents: "none",
          }}
        />
      </Box>
    </Box>
  );
}
