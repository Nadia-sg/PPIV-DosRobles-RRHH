// src/components/licencias/ModalError.jsx
// Modal para mostrar errores en solicitudes de ausencia

import { Box, Typography, Dialog } from "@mui/material";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalError({ open, onClose, error }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#FFFFFF",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          position: "relative",
          overflow: "visible",
          width: 450,
        },
      }}
    >
      {/* Franja superior roja (error) */}
      <Box
        sx={{
          width: "100%",
          height: 60,
          backgroundColor: "#FF7779",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* Contenido */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          gap: 3,
        }}
      >
        {/* Título */}
        <Typography
          sx={{
            fontSize: "1.3rem",
            fontWeight: 600,
            color: "#585858",
            textAlign: "center",
          }}
        >
          Error en la Solicitud
        </Typography>

        {/* Mensaje de error */}
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#808080",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {error || "Ocurrió un error al procesar tu solicitud"}
        </Typography>

        {/* Botón Aceptar */}
        <PrimaryButton
          onClick={onClose}
          sx={{
            width: 200,
            height: 40,
            fontSize: "0.95rem",
            fontWeight: 600,
          }}
        >
          Aceptar
        </PrimaryButton>
      </Box>
    </Dialog>
  );
}
