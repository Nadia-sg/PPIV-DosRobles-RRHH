/* src/pages/Home.jsx */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CakeIcon from "@mui/icons-material/Cake";
import StopIcon from "@mui/icons-material/Stop";
import {
  PrimaryButton,
  SecondaryButton,
  IconNextButton,
} from "../components/ui/Buttons";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../components/ui/ModalDialog";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [seconds, setSeconds] = useState(0);
  const [estadoFichaje, setEstadoFichaje] = useState("inactivo");
  const [openInicio, setOpenInicio] = useState(false);
  const [openSalida, setOpenSalida] = useState(false);

  //  Simulador de tiempo activo
  useEffect(() => {
    if (estadoFichaje !== "activo") return;
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, [estadoFichaje]);

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);
  const navigate = useNavigate();

  const eventos = [
    {
      fecha: "25 Oct",
      hora: "14:00",
      nombre: "Cumpleaños Erica",
      icono: <CakeIcon />,
    },
    {
      fecha: "27 Oct",
      hora: "09:30",
      nombre: "Reunión de equipo",
      icono: <EmojiEventsIcon />,
    },
    {
      fecha: "29 Oct",
      hora: "16:00",
      nombre: "Entrega de proyecto",
      icono: <EmojiEventsIcon />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: isMobile ? "auto" : "100dvh",
        overflow: "hidden",
        backgroundColor: "#f5f5f5",
        gap: 2,
        boxSizing: "border-box",
        padding: 4,
      }}
    >
      {/* ===================
          FILA SUPERIOR
          =================== */}
      <Box
        sx={{
          display: "flex",
          flex: isMobile ? "0 0 auto" : "0 0 30%",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* ===================
            CUADRANTE 1 FICHAJE
            =================== */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            p: 2,
            height: isMobile ? "auto" : "98%",
            position: "relative",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Fichaje
            </Typography>
            <IconNextButton onClick={() => navigate("/fichaje/historial")}>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          {/* Cuerpo */}
          <Box
            sx={{
              display: "flex",
              flex: 1,
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            {/* --- ESTADOS --- */}
            <Box
              sx={{
                flex: "1 1 50%",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                marginLeft: 1.5,
              }}
            >
              {/* Botón principal */}
              <PrimaryButton
                startIcon={
                  estadoFichaje === "inactivo" ? (
                    <PlayArrowIcon />
                  ) : (
                    <StopIcon />
                  )
                }
                onClick={() => {
                  if (estadoFichaje === "inactivo") setOpenInicio(true);
                  else if (estadoFichaje === "activo") setOpenSalida(true);
                }}
                disabled={estadoFichaje === "pausado"}
                sx={{
                  bgcolor:
                    estadoFichaje === "inactivo"
                      ? "#7FC6BA"
                      : estadoFichaje === "pausado"
                      ? "#ccc"
                      : "#F28B82",
                  color: estadoFichaje === "pausado" ? "#666" : "white",
                  "&:hover": {
                    bgcolor:
                      estadoFichaje === "inactivo"
                        ? "#68b0a4"
                        : estadoFichaje === "pausado"
                        ? "#ccc"
                        : "#e57373",
                  },
                  transition: "background-color 0.3s ease",
                }}
              >
                {estadoFichaje === "inactivo"
                  ? "Fichar entrada"
                  : "Registrar salida"}
              </PrimaryButton>

              {/* Botón Pausar / Reanudar */}
              {estadoFichaje !== "inactivo" && (
                <SecondaryButton
                  onClick={() => {
                    if (estadoFichaje === "activo") {
                      setEstadoFichaje("pausado");
                      setToast({
                        open: true,
                        message: "Jornada pausada",
                        severity: "warning",
                      });
                    } else if (estadoFichaje === "pausado") {
                      setEstadoFichaje("activo");
                      setToast({
                        open: true,
                        message: "Jornada reanudada",
                        severity: "info",
                      });
                    }
                  }}
                >
                  {estadoFichaje === "pausado" ? "Reanudar" : "Pausar"}
                </SecondaryButton>
              )}

              <Typography
                sx={{
                  textDecoration: "underline",
                  cursor: "pointer",
                  color: "primary.main",
                  "&:hover": { color: "primary.dark" },
                  mt: 1,
                }}
              >
                Solicitar corrección
              </Typography>
            </Box>

            {/* Temporizador */}
            <Box
              sx={{
                flex: "1 1 50%",
                display: "flex",
                justifyContent: "center",
                alignItems: "start",
              }}
            >
              <Box sx={{ position: "relative", display: "inline-flex" }}>
                <CircularProgress
                  variant="determinate"
                  value={100}
                  size={100}
                  thickness={5}
                  sx={{ color: "#e0e0e0" }}
                />
                <CircularProgress
                  variant="determinate"
                  value={progress}
                  size={100}
                  thickness={5}
                  sx={{ color: "#817A6F", position: "absolute", left: 0 }}
                />
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography variant="caption">
                    {Math.floor(seconds / 3600)}h{" "}
                    {Math.floor((seconds % 3600) / 60)}m
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Modal INICIO */}
            <ModalDialog
              open={openInicio}
              onClose={() => setOpenInicio(false)}
              title="Iniciar jornada"
              content={
                <Typography sx={{ whiteSpace: "pre-line" }}>
                  {
                    "Estás a punto de iniciar tu jornada laboral.\nEl tiempo comenzará a medirse ahora."
                  }
                </Typography>
              }
              actions={[
                {
                  label: "Cancelar",
                  variant: "outlined",
                  onClick: () => setOpenInicio(false),
                },
                {
                  label: "Iniciar",
                  onClick: () => {
                    setOpenInicio(false);
                    setEstadoFichaje("activo");
                    setToast({
                      open: true,
                      message: "Jornada iniciada con éxito",
                      severity: "info",
                    });
                    setSeconds(0);
                  },
                },
              ]}
            />

            {/* Modal SALIDA */}
            <ModalDialog
              open={openSalida}
              onClose={() => setOpenSalida(false)}
              title="Registrar salida"
              content="¿Quieres registrar la salida y finalizar tu jornada laboral?"
              actions={[
                {
                  label: "Cancelar",
                  variant: "outlined",
                  onClick: () => setOpenSalida(false),
                },
                {
                  label: "Confirmar",
                  onClick: () => {
                    setOpenSalida(false);
                    setEstadoFichaje("inactivo");
                    setSeconds(0);
                    setToast({
                      open: true,
                      message: "Jornada finalizada correctamente",
                      severity: "success",
                    });
                  },
                },
              ]}
            />

            <Snackbar 
              open={toast.open}
              autoHideDuration={3000}
              onClose={() => setToast({ ...toast, open: false })}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              sx={{
                position: "absolute",
                bottom: 0,
                right: 16,
              }}
            >
              <Alert
                onClose={() => setToast({ ...toast, open: false })}
                severity={toast.severity}
                sx={{ width: "100%" }}
              >
                {toast.message}
              </Alert>
            </Snackbar>
          </Box>
        </Card>

        {/* ===========================
            CUADRANTE 2 ESTADO DEL EQUIPO
            ============================== */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            p: 2,
            height: isMobile ? "auto" : "98%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Estado del Equipo
            </Typography>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {[
              { color: "#FFD0D0", title: "Ausentes", count: 3 },
              { color: "#8EC6BA", title: "Fichados", count: 12 },
            ].map((item, idx) => (
              <Box
                key={idx}
                sx={{ display: "flex", alignItems: "center", gap: 2 }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: "50%",
                    backgroundColor: item.color,
                    flexShrink: 0,
                  }}
                />
                <Box>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    color="#808080"
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="#A0A0A0">
                    {item.count} empleados
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>

      {/* ===================
          FILA INFERIOR
          =================== */}
      <Box
        sx={{
          display: "flex",
          flex: isMobile ? "0 0 auto" : "0 0 40%",
          gap: 2,
          flexWrap: isMobile ? "wrap" : "nowrap",
        }}
      >
        {/* Bandeja de entrada */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            p: 2,
            height: isMobile ? "auto" : "100%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Bandeja de entrada
            </Typography>
            <IconNextButton onClick={() => navigate("/bandeja-entrada")}>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 1,
              flex: 1,
              overflowY: "auto",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  flexDirection: { xs: "column", md: "row" },
                  justifyContent: { xs: "flex-start", md: "space-between" },
                  alignItems: { xs: "flex-start", md: "center" },
                  backgroundColor: "#E9E9E9",
                  borderRadius: 1,
                  p: 1.5,
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#dcdcdc" },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: { xs: "space-between", md: "flex-start" },
                    width: "100%",
                    mb: { xs: 0.5, md: 0 },
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    Fecha {i + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Remitente {i + 1}
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{ width: "100%" }}
                >
                  Asunto del mail {i + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

        {/* Eventos */}
        <Card
          sx={{
            flex: isMobile ? "0 0 100%" : "0 0 50%",
            borderRadius: 3,
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            display: "flex",
            flexDirection: "column",
            p: 2,
            height: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography
              variant={isMobile ? "subtitle1" : "h6"}
              fontWeight="bold"
              color="#808080"
            >
              Eventos
            </Typography>
            <SecondaryButton
              startIcon={<EditCalendarIcon />}
              sx={{
                fontSize: isMobile ? "0.7rem" : "0.85rem",
                p: isMobile ? "0.3rem 0.6rem" : "0.4rem 0.8rem",
                borderRadius: 2,
              }}
            >
              Añadir evento
            </SecondaryButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {eventos.map((evento, i) => (
              <Box
                key={i}
                sx={{
                  display: "grid",
                  gridTemplateColumns: "60px 1fr 40px",
                  backgroundColor: "#F7F9E3",
                  color: "#808080",
                  borderRadius: 1,
                  p: 1,
                  alignItems: "center",
                  "&:hover": { backgroundColor: "#f1f3d6" },
                }}
              >
                <Box
                  sx={{
                    borderRight: "1px solid #ccc",
                    pr: 1,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Typography fontWeight="bold" variant="body2">
                    {evento.fecha}
                  </Typography>
                  <Typography variant="caption" color="#808080">
                    {evento.hora}
                  </Typography>
                </Box>
                <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {evento.nombre}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  {evento.icono}
                </Box>
              </Box>
            ))}
          </Box>
        </Card>
      </Box>
    </Box>
  );
}
