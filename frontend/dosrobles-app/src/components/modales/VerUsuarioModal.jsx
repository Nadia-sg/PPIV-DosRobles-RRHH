// src/components/modales/VerUsuarioModal.jsx
import React from "react";
import { Box, Stack, Divider } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import { PrimaryButton, SecondaryButton } from "../ui/Buttons";
import BaseInput from "../ui/BaseInput";
import SelectInput from "../ui/SelectInput";

const VerUsuarioModal = ({ open, onClose, usuario, onEditar, onEliminar }) => {
  if (!usuario) return null;

  return (
    <ModalCard open={open} onClose={onClose} title="Detalle del Usuario" width={500}>
      <Box sx={{ mt: 2 }}>
        <Stack spacing={2}>
          <BaseInput label="Número de legajo" value={usuario.legajo || "—"} fullWidth disabled />
          <BaseInput label="Nombre de usuario" value={usuario.username} fullWidth disabled />
          <SelectInput
            label="Rol"
            value={usuario.role}
            options={[
              { label: "Admin", value: "admin" },
              { label: "Empleado", value: "empleado" },
            ]}
            fullWidth
            disabled
          />
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
          <SecondaryButton onClick={onEliminar} color="error">
            Eliminar
          </SecondaryButton>
          <PrimaryButton onClick={onEditar}>
            Editar
          </PrimaryButton>
        </Box>
      </Box>
    </ModalCard>
  );
};

export default VerUsuarioModal;
