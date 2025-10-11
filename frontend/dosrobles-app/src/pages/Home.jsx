/* src/pages/Home.jsx */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CakeIcon from "@mui/icons-material/Cake";
import {
  PrimaryButton,
  SecondaryButton,
  IconNextButton,
} from "../components/ui/Buttons";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [seconds, setSeconds] = useState(0);

  // Simulador de fichaje
  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);

  const eventos = [
    { fecha: "25 Oct", hora: "14:00", nombre: "Cumpleaños Erica", icono: <CakeIcon /> },
    { fecha: "27 Oct", hora: "09:30", nombre: "Reunión de equipo", icono: <EmojiEventsIcon /> },
    { fecha: "29 Oct", hora: "16:00", nombre: "Entrega de proyecto", icono: <EmojiEventsIcon /> },
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
            height: isMobile ? "auto" : "90%",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Fichaje
            </Typography>
            <IconNextButton>
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
            {/* Botones */}
            <Box
              sx={{
                flex: "1 1 50%",
                display: "flex",
                flexDirection: "column",
                gap: 1.5,
                marginLeft: 1.5,
              }}
            >
              <PrimaryButton startIcon={<PlayArrowIcon />}>
                Fichaje oficina
              </PrimaryButton>
              <SecondaryButton startIcon={<PlayArrowIcon />}>
                Fichaje remoto
              </SecondaryButton>
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
            height: isMobile ? "auto" : "90%",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
            <Typography variant="h6" fontWeight="bold" color="#808080">
              Estado del Equipo
            </Typography>
            <IconNextButton>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
            {[
              { color: "#FFD0D0", title: "Ausentes", count: 3 },
              { color: "#8EC6BA", title: "Fichados", count: 12 },
            ].map((item, idx) => (
              <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
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
                  <Typography variant="subtitle1" fontWeight="bold" color="#808080">
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
         {/* ===========================
          CUADRANTE 3 BANDEJA DE ENTRADA
          ============================== */}
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
            <IconNextButton>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          {/* Mails */}
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, overflowY: "auto" }}>
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
                <Box sx={{
                  display: "flex",
                  justifyContent: { xs: "space-between", md: "flex-start" },
                  width: "100%",
                  mb: { xs: 0.5, md: 0 },
                }}>
                  <Typography variant="body2" color="text.secondary">
                    Remitente {i + 1}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fecha {i + 1}
                  </Typography>
                </Box>
                <Typography variant="body2" fontWeight="bold" sx={{ width: "100%" }}>
                  Asunto del mail {i + 1}
                </Typography>
              </Box>
            ))}
          </Box>
        </Card>

         {/* ===========================
          CUADRANTE 4 EVENTOS
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
            height: "100%",
          }}
        >
          {/* Encabezado */}
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" color="#808080">
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

          {/* Tabla de eventos */}
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
                {/* Fecha + hora */}
                <Box sx={{ borderRight: "1px solid #ccc", pr: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <Typography fontWeight="bold" variant="body2">
                    {evento.fecha}
                  </Typography>
                  <Typography variant="caption" color="#808080">
                    {evento.hora}
                  </Typography>
                </Box>

                {/* Nombre evento */}
                <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
                  <Typography variant="body2" fontWeight="bold">
                    {evento.nombre}
                  </Typography>
                </Box>

                {/* Icono */}
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
