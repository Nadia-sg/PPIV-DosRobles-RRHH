import React, { useRef, useMemo } from "react";
import { Box, Typography } from "@mui/material";
import { CalendarMonth } from "@mui/icons-material";

/**
 * DateField
 * - Acepta value en: Date object, "yyyy-MM-dd", ISO string, o "dd/MM/yyyy"
 * - Normaliza internamente a "yyyy-MM-dd" para el <input type="date" />
 * - Muestra fecha en formato local (es-AR) en el área visible
 */
export default function DateField({ label, value, onChange, readOnly = false, disabled = false }) {
  const inputRef = useRef(null);

  // Convierte distintos formatos a yyyy-MM-dd (sin uso de UTC)
  const toISOForInput = (val) => {
    if (!val) return "";

    if (val instanceof Date) {
      if (isNaN(val)) return "";
      const year = val.getFullYear();
      const month = String(val.getMonth() + 1).padStart(2, "0");
      const day = String(val.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // Si es string dd/MM/yyyy
    const ddmmyyyy = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const match = String(val).trim().match(ddmmyyyy);
    if (match) {
      const [, dd, mm, yyyy] = match;
      return `${yyyy}-${mm}-${dd}`;
    }

    // Si ya viene en formato yyyy-MM-dd
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    if (iso.test(val)) return val;

    // Intentar crear fecha desde otro formato (ISO, timestamp)
    const parsed = new Date(val);
    if (!isNaN(parsed)) {
      const year = parsed.getFullYear();
      const month = String(parsed.getMonth() + 1).padStart(2, "0");
      const day = String(parsed.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    return "";
  };

  // Valor para el input date (yyyy-MM-dd)
  const inputValue = useMemo(() => toISOForInput(value), [value]);

  // Texto visible formateado localmente
  const displayText = useMemo(() => {
    if (!inputValue) return "Seleccionar fecha";
    const parts = inputValue.split("-");
    if (parts.length !== 3) return "Seleccionar fecha";
    const [year, month, day] = parts;
    const d = new Date(year, month - 1, day);
    if (isNaN(d)) return "Seleccionar fecha";
    return d.toLocaleDateString("es-AR");
  }, [inputValue]);

  const handleOpen = () => {
    if (disabled || readOnly) return;
    if (inputRef.current) {
      if (typeof inputRef.current.showPicker === "function") {
        inputRef.current.showPicker();
      } else {
        inputRef.current.focus();
      }
    }
  };

  return (
    <Box sx={{ mb: 3, position: "relative", zIndex: 10 }}>
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
          zIndex: 2,
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
          backgroundColor: disabled || readOnly ? "#F5F5F5" : "#FFFFFF",
          cursor: disabled || readOnly ? "not-allowed" : "pointer",
          opacity: disabled || readOnly ? 0.6 : 1,
          position: "relative",
          zIndex: 3,
        }}
      >
        <Typography sx={{ color: inputValue ? "#585858" : "#999999", fontSize: "0.95rem" }}>
          {displayText}
        </Typography>

        <Box sx={{ color: "#7FC6BA", "&:hover": { color: "#5FA89A" } }}>
          <CalendarMonth />
        </Box>

        {/* Input real oculto */}
        <input
          ref={inputRef}
          type="date"
          value={inputValue}
          onChange={(e) => {
            if (typeof onChange === "function") onChange(e);
          }}
          disabled={disabled || readOnly}
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
