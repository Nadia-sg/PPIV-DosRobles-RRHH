import React from "react";
import {
  Box,
  Typography,
  FormControl,
  Select,
  MenuItem,
} from "@mui/material";

/**
 * SelectInput
 * Dropdown reutilizable con opciones dinámicas.
 *
 * Props:
 * - label: string → título del campo
 * - value: string → valor seleccionado
 * - onChange: (e) => void → manejador del cambio
 * - options: array → [{ label: string, value: string }]
 * - placeholder: string → texto inicial (opcional)
 * - helperText: string → texto debajo del campo
 * - error: boolean → estado de error
 * - icon: ReactNode → ícono opcional
 */

export default function SelectInput({
  label,
  value,
  onChange,
  options = [],
  placeholder = "Seleccionar...",
  helperText,
  error,
  icon,
}) {
  return (
    <Box sx={{ mb: 3 }}>
      {label && (
        <Typography
          sx={{ mb: 0.5, color: "#585858", fontWeight: 500, fontSize: "0.95rem" }}
        >
          {label}
        </Typography>
      )}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          backgroundColor: "#FFFFFF",
          border: "1px solid #E2E1E1",
          borderRadius: 2,
          boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
          px: 1.5,
          py: 0.5,
        }}
      >
        {icon && <Box sx={{ mr: 1, color: "#7FC6BA" }}>{icon}</Box>}

        <FormControl fullWidth variant="standard" sx={{ border: "none" }}>
          <Select
            disableUnderline
            displayEmpty
            value={value}
            onChange={onChange}
            sx={{
              color: "#585858",
              fontSize: "0.95rem",
              "& .MuiSelect-icon": { color: "#7FC6BA" },
            }}
          >
            <MenuItem disabled value="">
              <em style={{ color: "#B0B0B0" }}>{placeholder}</em>
            </MenuItem>
            {options.map((opt, i) => (
              <MenuItem key={i} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {helperText && (
        <Typography
          sx={{
            mt: 0.5,
            fontSize: "0.8rem",
            color: error ? "#FF6B6B" : "#999",
          }}
        >
          {helperText}
        </Typography>
      )}
    </Box>
  );
}
