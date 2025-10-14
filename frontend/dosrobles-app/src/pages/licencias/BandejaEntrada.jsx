// src/pages/licencias/BandejaEntrada.jsx
// Pantalla de Bandeja de Entrada para gerente/administrador

import { useState } from "react";
import { Box, Typography, Card, CardContent, Collapse, IconButton } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import ModalAprobacionLicencia from "../../components/licencias/ModalAprobacionLicencia";

export default function BandejaEntrada() {
  const [expandedId, setExpandedId] = useState(null);
  const [modalAprobacionOpen, setModalAprobacionOpen] = useState(false);
  const [solicitudSeleccionada, setSolicitudSeleccionada] = useState(null);

  const [solicitudes, setSolicitudes] = useState([
    {
      id: 1,
      empleado: "Lautaro Gallo",
      legajo: "Nº 026",
      tipo: "Petición de ausencia",
      tipoAusencia: "Vacaciones",
      fecha: "27/08",
      fechaInicio: "22 de Diciembre 2025",
      fechaFin: "05 de Enero de 2026",
      comentario: "Vacaciones de verano",
      mensaje: "Lautaro Gallo ha enviado esta petición de ausencia",
      estado: "pendiente",
    },
    {
      id: 2,
      empleado: "Lucas Rodríguez",
      legajo: "Nº 015",
      tipo: "Recordatorio: Taller de seguridad",
      tipoAusencia: "Capacitación",
      fecha: "15/08",
      fechaInicio: "20 de Agosto 2025",
      fechaFin: "20 de Agosto 2025",
      comentario: "Asistencia obligatoria al taller",
      mensaje: "Lucas Rodríguez ha solicitado ausencia por capacitación",
      estado: "pendiente",
    },
    {
      id: 3,
      empleado: "Luis Jara",
      legajo: "Nº 042",
      tipo: "Nuevo proyecto",
      tipoAusencia: "Asuntos personales",
      fecha: "01/08",
      fechaInicio: "10 de Agosto 2025",
      fechaFin: "10 de Agosto 2025",
      comentario: "Trámite personal urgente",
      mensaje: "Luis Jara ha solicitado ausencia por asuntos personales",
      estado: "pendiente",
    },
    {
      id: 4,
      empleado: "Tamara Guido",
      legajo: "Nº 018",
      tipo: "Consulta recibo de sueldo",
      tipoAusencia: "Licencia médica",
      fecha: "28/07",
      fechaInicio: "02 de Agosto 2025",
      fechaFin: "03 de Agosto 2025",
      comentario: "Control médico",
      mensaje: "Tamara Guido ha solicitado licencia médica",
      estado: "pendiente",
    },
  ]);

  const handleToggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleResponder = (solicitud) => {
    setSolicitudSeleccionada(solicitud);
    setModalAprobacionOpen(true);
  };

  const handleAprobarRechazar = (solicitudId, accion, motivo = "") => {
    // Actualizar el estado de la solicitud
    setSolicitudes(
      solicitudes.map((sol) =>
        sol.id === solicitudId
          ? { ...sol, estado: accion, motivoRechazo: motivo }
          : sol
      )
    );
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 3 }}>
        Bandeja De Entrada
      </Typography>

      {/* Título de la tabla */}
      <Box
        sx={{
          backgroundColor: "#817A6F",
          color: "#FFFFFF",
          p: 2,
          borderRadius: "8px 8px 0 0",
          mb: 0,
        }}
      >
        <Typography sx={{ fontWeight: 600, textAlign: "center" }}>
          Bandeja De Entrada
        </Typography>
      </Box>

      {/* Lista de solicitudes */}
      <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: "0 0 8px 8px", overflow: "hidden" }}>
        {solicitudes
          .filter((sol) => sol.estado === "pendiente")
          .map((solicitud, index) => (
            <Box key={solicitud.id}>
              {/* Fila principal */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  p: 2,
                  borderBottom:
                    expandedId === solicitud.id ? "none" : "1px solid #E0E0E0",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#F5F5F5",
                  },
                }}
                onClick={() => handleToggleExpand(solicitud.id)}
              >
                <Box sx={{ display: "flex", gap: 3, flex: 1 }}>
                  <Typography sx={{ minWidth: 150, color: "#585858", fontWeight: 500 }}>
                    {solicitud.empleado}
                  </Typography>
                  <Typography sx={{ flex: 1, color: "#808080" }}>
                    {solicitud.tipo}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography sx={{ color: "#808080", minWidth: 50 }}>
                    {solicitud.fecha}
                  </Typography>
                  <IconButton
                    size="small"
                    sx={{
                      transform:
                        expandedId === solicitud.id ? "rotate(180deg)" : "rotate(0deg)",
                      transition: "transform 0.3s",
                    }}
                  >
                    <ExpandMoreIcon />
                  </IconButton>
                </Box>
              </Box>

              {/* Detalle expandido */}
              <Collapse in={expandedId === solicitud.id}>
                <Box
                  sx={{
                    p: 3,
                    backgroundColor: "#FAFAFA",
                    borderBottom: "1px solid #E0E0E0",
                  }}
                >
                  {/* Encabezado con nombre */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: "1.1rem", color: "#585858" }}>
                      {solicitud.empleado}
                    </Typography>
                    <Typography sx={{ color: "#808080" }}>{solicitud.fecha}</Typography>
                  </Box>

                  <Typography sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
                    {solicitud.tipo}
                  </Typography>

                  {/* Mensaje */}
                  <Typography sx={{ color: "#808080", mb: 2 }}>
                    Hola Mariana,
                  </Typography>
                  <Typography sx={{ color: "#808080", mb: 2 }}>
                    {solicitud.mensaje}
                  </Typography>

                  {/* Detalles */}
                  <Typography sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
                    Detalles:
                  </Typography>
                  <Typography sx={{ color: "#808080", mb: 1 }}>
                    {solicitud.tipoAusencia} desde el {solicitud.fechaInicio} hasta el{" "}
                    {solicitud.fechaFin}.
                  </Typography>

                  {/* Comentario */}
                  <Typography sx={{ fontWeight: 600, color: "#585858", mb: 1, mt: 2 }}>
                    Comentario:
                  </Typography>
                  <Typography sx={{ color: "#808080", mb: 3 }}>
                    {solicitud.comentario}
                  </Typography>

                  {/* Botón Ver los detalles */}
                  <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                    <PrimaryButton
                      onClick={() => handleResponder(solicitud)}
                      sx={{ px: 3 }}
                    >
                      Ver los detalles
                    </PrimaryButton>
                  </Box>

                  {/* Botones Responder y Reenviar */}
                  <Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
                    <SecondaryButton
                      onClick={() => handleResponder(solicitud)}
                      sx={{ px: 4, minWidth: 150 }}
                    >
                      Responder
                    </SecondaryButton>
                    <SecondaryButton sx={{ px: 4, minWidth: 150 }}>
                      Reenviar
                    </SecondaryButton>
                  </Box>
                </Box>
              </Collapse>
            </Box>
          ))}
      </Box>

      {/* Modal de Aprobación */}
      <ModalAprobacionLicencia
        open={modalAprobacionOpen}
        onClose={() => setModalAprobacionOpen(false)}
        solicitud={solicitudSeleccionada}
        onAprobar={(id) => handleAprobarRechazar(id, "aprobado")}
        onRechazar={(id, motivo) => handleAprobarRechazar(id, "rechazado", motivo)}
      />
    </Box>
  );
}
