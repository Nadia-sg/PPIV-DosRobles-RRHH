import React, { useRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

/**
 * DateField
 * - Acepta value en: Date object, "yyyy-MM-dd", ISO string, o "dd/MM/yyyy"
 * - Normaliza internamente a "yyyy-MM-dd" para el <input type="date" />
 * - Muestra fecha en formato local (es-AR) en el área visible
 *
 * Props:
 * - label: string
 * - value: Date | string
 * - onChange: function(event) -> recibe el event original del input (value en yyyy-MM-dd en event.target.value)
 */
export default function DateField({ label, value, onChange }) {
  const inputRef = useRef(null);

  // Intenta convertir distintos formatos a yyyy-MM-dd (valor que necesita input type=date)
  const toISOForInput = (val) => {
    if (!val) return "";

    // Si ya es Date
    if (val instanceof Date) {
      if (isNaN(val)) return "";
      return val.toISOString().split("T")[0];
    }

    // Si es string con formato dd/MM/yyyy -> convertir a yyyy-MM-dd
    const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = String(val).trim().match(ddmmyyyy);
    if (match) {
      const [, dd, mm, yyyy] = match;
      return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
    }

    // Si ya es yyyy-MM-dd o ISO
    // Intento crear Date; si es válido, lo devuelvo en formato yyyy-MM-dd
    const parsed = new Date(val);
    if (!isNaN(parsed)) {
      return parsed.toISOString().split("T")[0];
    }

    // No se pudo parsear
    return "";
  };

  // Valor que le pasamos al input (yyyy-MM-dd o '')
  const inputValue = useMemo(() => toISOForInput(value), [value]);

  // Texto visible (formateado localmente) para mostrar en el box
  const displayText = useMemo(() => {
    if (!inputValue) return "Seleccionar fecha";
    const d = new Date(inputValue);
    if (isNaN(d)) return "Seleccionar fecha";
    return d.toLocaleDateString("es-AR");
  }, [inputValue]);

  const handleOpen = () => {
    // intentar abrir picker nativo si existe
    if (inputRef.current) {
      // algunos navegadores implementan showPicker()
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
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

      {/* Contenedor visible */}
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
        <Typography sx={{ color: inputValue ? "#585858" : "#999999", fontSize: "0.95rem" }}>
          {displayText}
        </Typography>

        <Box sx={{ color: "#7FC6BA", "&:hover": { color: "#5FA89A" } }}>
          <CalendarMonth />
        </Box>

        {/* input real oculto (controlado) */}
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={(e) => {
            // reenviamos el evento al padre: e.target.value será "yyyy-MM-dd"
            if (typeof onChange === "function") onChange(e);
          }}
          style={{
            opacity: 0,
            position: "absolute",
            pointerEvents: "none",
            width: 0,
            height: 0,
          }}
        />
      </Box>
    </Box>
  );
}