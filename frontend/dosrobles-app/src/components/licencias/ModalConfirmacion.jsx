// src/components/licencias/ModalConfirmacion.jsx
// Modal de confirmación después de enviar una solicitud de ausencia

import { Box, Typography, Dialog } from "@mui/material";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalConfirmacion({ open, onClose, mensaje }) {
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
      {/* Franja superior verde agua */}
      <Box
        sx={{
          width: "100%",
          height: 60,
          backgroundColor: "#7FC6BA",
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
          Solicitud de Ausencia
        </Typography>

        {/* Mensaje */}
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#808080",
            textAlign: "center",
            lineHeight: 1.6,
          }}
        >
          {mensaje || "Su solicitud ha sido enviada para revisión"}
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
