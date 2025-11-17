import React, { useState } from "react";
import { Box, Alert } from "@mui/material";
import ModalCard from "./ModalCard";
import LogoutIcon from "@mui/icons-material/Logout";

/**
 * LogoutConfirmationModal
 * Modal de confirmación para cerrar sesión
 * Pide confirmación al usuario antes de desconectarse
 */
export default function LogoutConfirmationModal({ open, onClose, onConfirm }) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirm = async () => {
    try {
      setIsLoggingOut(true);
      if (onConfirm) {
        await onConfirm();
      }
    } catch (error) {
      console.error("Error durante logout:", error);
      setIsLoggingOut(false);
    }
  };

  const handleClose = () => {
    if (!isLoggingOut) {
      onClose();
    }
  };

  return (
    <ModalCard
      open={open}
      onClose={handleClose}
      title="Cerrar sesión"
      width={450}
      actions={[
        {
          label: "Cancelar",
          onClick: handleClose,
          variant: "outlined",
          disabled: isLoggingOut,
        },
        {
          label: isLoggingOut ? "Cerrando..." : "Cerrar sesión",
          onClick: handleConfirm,
          variant: "contained",
          disabled: isLoggingOut,
        },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, alignItems: "center" }}>
        {/* Icono de logout */}
        <LogoutIcon
          sx={{
            fontSize: 60,
            color: "#FF6B6B",
            mb: 1,
          }}
        />

        {/* Mensaje de confirmación */}
        <Alert severity="warning" sx={{ width: "100%" }}>
          ¿Deseas cerrar tu sesión?
        </Alert>

        {/* Texto informativo */}
        <Box
          sx={{
            textAlign: "center",
            color: "#666",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Se cerrará tu sesión y tendrás que volver a iniciar sesión para acceder a la aplicación.
        </Box>
      </Box>
    </ModalCard>
  );
}
