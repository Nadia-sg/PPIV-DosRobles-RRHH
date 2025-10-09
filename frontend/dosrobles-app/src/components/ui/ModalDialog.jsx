// src/components/ui/ModalDialog.jsx
import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryButton, SecondaryButton, CloseButton } from "./Buttons";

export default function ModalDialog({
  open,
  onClose,
  title,
  content,
  actions,
  maxWidth = "sm",
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#E9E9E9",
          borderRadius: 3,
          boxShadow: "0px 4px 20px rgba(0,0,0,0.1)",
          position: "relative",
          overflow: "visible",
        },
      }}
    >
      {/* Línea decorativa superior */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "40px",
          bgcolor: "#7FC6BA",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* Botón de cierre */}
      <IconButton
        onClick={onClose}
        sx={{
          position: "absolute",
          top: 0,
          right: 8,
          color: "#808080",
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogTitle
        sx={{ color: "#333", fontWeight: 600, mt: 5, textAlign: "center" }}
      >
        {title}
      </DialogTitle>

      <DialogContent>
        <Typography sx={{ color: "#808080", textAlign: "center" }}>
          {content}
        </Typography>
      </DialogContent>

      {actions && (
        <DialogActions sx={{ justifyContent: "center", gap: 2, p: 2 }}>
          {actions.map((action, i) => {
            if (React.isValidElement(action)) {
              return <Box key={i}>{action}</Box>;
            }

            const ButtonComponent =
              action.variant === "outlined" ? SecondaryButton : PrimaryButton;

            return (
              <ButtonComponent
                key={i}
                onClick={action.onClick}
                sx={{ width: "25%" }}
              >
                {action.label}
              </ButtonComponent>
            );
          })}
        </DialogActions>
      )}
    </Dialog>
  );
}
