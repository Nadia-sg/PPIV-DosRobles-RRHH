// src/components/licencias/ModalConfirmacionGerente.jsx
// Modal de confirmación después de aprobar/rechazar una solicitud (vista gerente)

import { Box, Typography, Dialog } from "@mui/material";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalConfirmacionGerente({ open, onClose, accion }) {
  const getMensaje = () => {
    if (accion === "aprobado") {
      return "Se ha aprobado la solicitud de ausencia. Se notificará al destinatario.";
    } else if (accion === "rechazado") {
      return "Se ha rechazado la solicitud de ausencia. Se notificará al destinatario.";
    }
    return "Acción completada con éxito.";
  };

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
        {/* Mensaje */}
        <Typography
          sx={{
            fontSize: "1rem",
            color: "#808080",
            textAlign: "center",
            lineHeight: 1.8,
            px: 2,
          }}
        >
          {getMensaje()}
        </Typography>

        {/* Botón Aceptar */}
        <PrimaryButton
          onClick={onClose}
          sx={{
            width: 180,
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
