// src/components/licencias/ModalAprobacionLicencia.jsx
// Modal para que el gerente apruebe o rechace una solicitud de licencia

import { useState } from "react";
import { Box, Typography, Dialog, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryButton, RejectButton } from "../ui/Buttons";
import ModalConfirmacionGerente from "./ModalConfirmacionGerente";

export default function ModalAprobacionLicencia({ open, onClose, solicitud, onAprobar, onRechazar }) {
  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);
  const [accionRealizada, setAccionRealizada] = useState(null);

  if (!solicitud) return null;

  const handleAprobar = () => {
    onAprobar(solicitud.id);
    setAccionRealizada("aprobado");
    onClose();
    setModalConfirmacionOpen(true);
  };

  const handleRechazar = () => {
    onRechazar(solicitud.id, "No aprobado por el gerente");
    setAccionRealizada("rechazado");
    onClose();
    setModalConfirmacionOpen(true);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            bgcolor: "#F5F5F5",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            position: "relative",
            overflow: "visible",
            width: 650,
          },
        }}
      >
        {/* Header con título y botón cerrar */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 3,
            pb: 2,
          }}
        >
          <Typography
            sx={{
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#585858",
            }}
          >
            Petición de ausencia
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#808080" }}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Contenido */}
        <Box sx={{ px: 3, pb: 3 }}>
          {/* Saludo */}
          <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#585858", mb: 2 }}>
            Hola, Mariana
          </Typography>

          {/* Cuadro con detalles */}
          <Box
            sx={{
              backgroundColor: "#FFFFFF",
              border: "2px solid #7FC6BA",
              borderRadius: 3,
              p: 3,
              mb: 3,
            }}
          >
            <Typography sx={{ color: "#585858", mb: 2, lineHeight: 1.8 }}>
              <strong>{solicitud.empleado} - Legajo {solicitud.legajo}</strong>
            </Typography>

            <Typography sx={{ color: "#585858", fontWeight: 600, mb: 1 }}>
              DETALLES:
            </Typography>

            <Typography sx={{ color: "#585858", mb: 0.5 }}>
              Tipo de ausencia: <strong>{solicitud.tipoAusencia}</strong>
            </Typography>
            <Typography sx={{ color: "#585858", mb: 0.5 }}>
              Comentario: {solicitud.comentario}
            </Typography>
            <Typography sx={{ color: "#585858", mb: 0.5 }}>
              Empieza el: <strong>{solicitud.fechaInicio}</strong>
            </Typography>
            <Typography sx={{ color: "#585858" }}>
              Termina el: <strong>{solicitud.fechaFin}</strong>
            </Typography>
          </Box>

          {/* Botones de acción */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              gap: 3,
              mt: 3,
            }}
          >
            <RejectButton
              onClick={handleRechazar}
              sx={{
                px: 5,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: 600,
                minWidth: 160,
              }}
            >
              Rechazar
            </RejectButton>
            <PrimaryButton
              onClick={handleAprobar}
              sx={{
                px: 5,
                py: 1.2,
                fontSize: "1rem",
                fontWeight: 600,
                minWidth: 160,
              }}
            >
              Aprobar
            </PrimaryButton>
          </Box>
        </Box>
      </Dialog>

      {/* Modal de Confirmación */}
      <ModalConfirmacionGerente
        open={modalConfirmacionOpen}
        onClose={() => setModalConfirmacionOpen(false)}
        accion={accionRealizada}
      />
    </>
  );
}
