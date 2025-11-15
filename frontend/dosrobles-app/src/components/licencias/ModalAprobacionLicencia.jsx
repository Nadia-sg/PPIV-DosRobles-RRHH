// src/components/licencias/ModalAprobacionLicencia.jsx
// Modal para que el gerente apruebe o rechace una solicitud de licencia

import { useState } from "react";
import { Box, Typography, Dialog, IconButton, TextField } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryButton, RejectButton } from "../ui/Buttons";
import ModalConfirmacionGerente from "./ModalConfirmacionGerente";
import { useUser } from "../../context/userContextHelper";

export default function ModalAprobacionLicencia({ open, onClose, solicitud, onAprobar, onRechazar, onConfirmacion }) {
  const { user } = useUser();
  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);
  const [accionRealizada, setAccionRealizada] = useState(null);
  const [comentario, setComentario] = useState("");

  if (!solicitud) return null;

  // Mapeo de tipos de licencia para mostrar texto legible
  const tiposLicenciaMap = {
    examen: "Licencia por examen",
    cita_medica: "Licencia por cita médica",
    ausencia_justificada: "Ausencia justificada",
    razones_particulares: "Razones particulares",
    enfermedad: "Licencia por enfermedad",
    vacaciones: "Licencia por vacaciones",
    asuntos_personales: "Asuntos personales",
    capacitacion: "Capacitación",
    licencia_medica: "Licencia médica",
    otro: "Otro",
  };

  const handleAprobar = () => {
    onAprobar(solicitud.id, comentario || "Aprobado");
    setAccionRealizada("aprobado");
    setComentario("");
    onClose();
    setModalConfirmacionOpen(true);
  };

  const handleRechazar = () => {
    onRechazar(solicitud.id, comentario || "No aprobado por el gerente");
    setAccionRealizada("rechazado");
    setComentario("");
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
            Hola, {user?.nombre || "Gerente"}
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
              <strong>{solicitud.empleado} - Legajo</strong>
            </Typography>

            <Typography sx={{ color: "#585858", fontWeight: 600, mb: 1 }}>
              DETALLES:
            </Typography>

            <Typography sx={{ color: "#585858", mb: 0.5 }}>
              Tipo de ausencia: <strong>{tiposLicenciaMap[solicitud.tipoLicencia] || solicitud.tipoTexto || solicitud.tipoLicencia}</strong>
            </Typography>
            {solicitud.motivo && (
              <Typography sx={{ color: "#585858", mb: 0.5 }}>
                Motivo: <strong>{solicitud.motivo}</strong>
              </Typography>
            )}
            <Typography sx={{ color: "#585858", mb: 0.5 }}>
              Empieza el: <strong>{solicitud.fechaInicio}</strong>
            </Typography>
            <Typography sx={{ color: "#585858" }}>
              Termina el: <strong>{solicitud.fechaFin}</strong>
            </Typography>
          </Box>

          {/* Campo de comentario del gerente */}
          <Box sx={{ mb: 3 }}>
            <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 1, fontWeight: 600 }}>
              Comentario (Opcional)
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              variant="outlined"
              sx={{
                backgroundColor: "#FFFFFF",
                borderRadius: 1,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#D0D0D0",
                  },
                  "&:hover fieldset": {
                    borderColor: "#7FC6BA",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#7FC6BA",
                  },
                },
              }}
            />
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
        onClose={() => {
          setModalConfirmacionOpen(false);
          // Cerrar también los modales de aprobación y detalles
          if (onConfirmacion) {
            onConfirmacion();
          }
        }}
        accion={accionRealizada}
      />
    </>
  );
}
