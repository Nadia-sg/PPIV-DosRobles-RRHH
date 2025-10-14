// src/components/licencias/ModalDetallesLicencia.jsx
// Modal para ver los detalles de una licencia (empleado y gerente)

import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import { PrimaryButton, RejectButton } from "../ui/Buttons";

export default function ModalDetallesLicencia({
  open,
  onClose,
  licencia,
  esGerente = false,
  onAprobar,
  onRechazar,
}) {
  if (!licencia) return null;

  // Mapeo de tipos de licencia para mostrar texto legible
  const tiposLicenciaMap = {
    examen: "Licencia por examen",
    cita_medica: "Licencia por cita médica",
    ausencia_justificada: "Ausencia justificada",
    razones_particulares: "Razones particulares",
    enfermedad: "Licencia por enfermedad",
    vacaciones: "Licencia por vacaciones",
  };

  // Colores según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "aprobado":
        return "#4CAF50";
      case "rechazado":
        return "#FF7779";
      case "pendiente":
        return "#FFA726";
      default:
        return "#808080";
    }
  };

  // Calcular días de ausencia
  const calcularDias = () => {
    if (!licencia.fechaInicio || !licencia.fechaFin) return 0;
    const inicio = new Date(licencia.fechaInicio);
    const fin = new Date(licencia.fechaFin);
    const diffTime = Math.abs(fin - inicio);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays;
  };

  // Acciones del modal según el rol y estado
  const getActions = () => {
    const baseActions = [
      {
        label: "Cerrar",
        variant: "outlined",
        onClick: onClose,
      },
    ];

    // Si es gerente y la licencia está pendiente, mostrar botones de aprobar/rechazar
    if (esGerente && licencia.estado === "pendiente") {
      return [
        ...baseActions,
        {
          label: "Aprobar",
          variant: "contained",
          onClick: () => {
            onAprobar(licencia.id);
            onClose();
          },
        },
      ];
    }

    return baseActions;
  };

  return (
    <ModalCard
      open={open}
      onClose={onClose}
      title="Detalles de la Ausencia"
      width={550}
      actions={getActions()}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        {/* Estado */}
        <Box>
          <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
            Estado
          </Typography>
          <Chip
            label={licencia.estado.toUpperCase()}
            sx={{
              backgroundColor: getEstadoColor(licencia.estado),
              color: "#FFFFFF",
              fontWeight: 600,
              fontSize: "0.85rem",
            }}
          />
        </Box>

        {/* Empleado (solo si es gerente) */}
        {esGerente && licencia.empleado && (
          <Box>
            <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
              Empleado
            </Typography>
            <Typography sx={{ fontSize: "1rem", color: "#585858", fontWeight: 500 }}>
              {licencia.empleado}
            </Typography>
          </Box>
        )}

        {/* Tipo de Licencia */}
        <Box>
          <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
            Tipo de Licencia
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#585858", fontWeight: 500 }}>
            {tiposLicenciaMap[licencia.tipoLicencia] || licencia.tipoLicencia}
          </Typography>
        </Box>

        {/* Fecha de Solicitud */}
        <Box>
          <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
            Fecha de Solicitud
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#585858" }}>
            {licencia.fechaSolicitud}
          </Typography>
        </Box>

        {/* Período de Ausencia */}
        <Box>
          <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
            Período de Ausencia
          </Typography>
          <Typography sx={{ fontSize: "1rem", color: "#585858" }}>
            Del {licencia.fechaInicio} al {licencia.fechaFin}
          </Typography>
          <Typography sx={{ fontSize: "0.85rem", color: "#7FC6BA", mt: 0.5 }}>
            ({calcularDias()} {calcularDias() === 1 ? "día" : "días"})
          </Typography>
        </Box>

        {/* Motivo */}
        {licencia.motivo && (
          <Box>
            <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
              Motivo
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", color: "#585858", lineHeight: 1.6 }}>
              {licencia.motivo}
            </Typography>
          </Box>
        )}

        {/* Comentario del gerente (si existe) */}
        {licencia.comentarioGerente && (
          <Box
            sx={{
              mt: 1,
              p: 2,
              backgroundColor: "#F5F5F5",
              borderRadius: 2,
              borderLeft: "4px solid #7FC6BA",
            }}
          >
            <Typography sx={{ fontSize: "0.9rem", color: "#808080", mb: 0.5 }}>
              Comentario del Gerente
            </Typography>
            <Typography sx={{ fontSize: "0.95rem", color: "#585858" }}>
              {licencia.comentarioGerente}
            </Typography>
          </Box>
        )}

        {/* Botón de rechazar (solo si es gerente y está pendiente) */}
        {esGerente && licencia.estado === "pendiente" && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <RejectButton
              onClick={() => {
                onRechazar(licencia.id);
                onClose();
              }}
              sx={{ width: "100%" }}
            >
              Rechazar Solicitud
            </RejectButton>
          </Box>
        )}
      </Box>
    </ModalCard>
  );
}
