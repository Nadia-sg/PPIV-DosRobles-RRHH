// src/components/ui/ModalCard.jsx

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, IconButton, Box, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryButton, SecondaryButton } from "./Buttons";


export default function ModalCard({
  open,
  onClose,
  title,
  children, // contenido: puede ser un formulario u otra cosa
  actions = [], // array de botones con label, onClick y optional sx
  width = 500, // ancho opcional
}) {
  if (!open) return null; // no renderiza si no está abierto

   return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#FFFFFF",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "visible",
          width: width,
        },
      }}
    >
      {/* Header: título + botón de cierre */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          p: 2,
          borderBottom: "1px solid #E0E0E0",
          color: "#808080",
        }}
      >
        <DialogTitle sx={{ m: 0, p: 0, fontWeight: 600 }}>{title}</DialogTitle>
        <IconButton onClick={onClose} sx={{ p: 0 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido */}
      <DialogContent sx={{ p: 3 }}>
        {children}
      </DialogContent>

      {/* Footer: botones */}
      {actions && (
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2,}}>
          {actions.map((action, i) => {
            const ButtonComponent = action.variant === "contained" ? PrimaryButton : SecondaryButton;
            return (
              <ButtonComponent key={i} onClick={action.onClick} sx={{ width: '30%' }}>
                {action.label}
              </ButtonComponent>
            );
          })}
        </DialogActions>
      )}
    </Dialog>
  );
}