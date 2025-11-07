/* src/pages/Home.jsx */

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  CircularProgress,
  Chip,
  Badge,
} from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CakeIcon from "@mui/icons-material/Cake";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import {
  PrimaryButton,
  SecondaryButton,
  IconNextButton,
} from "../components/ui/Buttons";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { licenciasService } from "../services/licenciasService";
import { notificacionesService } from "../services/notificacionesService";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const { user, loading: userLoading } = useUser();
  const [seconds, setSeconds] = useState(0);
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargandoNotificaciones, setCargandoNotificaciones] = useState(false);

  // Obtener empleadoId del contexto de autenticación
  const empleadoId = user?.empleadoId;
  const esEmpleado = user?.rol === "empleado";
  const esGerente = ["gerente", "rrhh", "admin"].includes(user?.rol);

  // Simulador de fichaje
  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Cargar notificaciones no leídas
  useEffect(() => {
    if (!userLoading && empleadoId) {
      cargarNotificacionesNoLeidas();
    }
  }, [userLoading, empleadoId]);

  const cargarNotificacionesNoLeidas = async () => {
    try {
      setCargandoNotificaciones(true);
      let respuesta;

      // Si es empleado, cargar solo sus notificaciones no leídas
      if (esEmpleado) {
        respuesta = await notificacionesService.obtenerNotificacionesNoLeidas(
          empleadoId
        );
      }
      // Si es gerente/admin/rrhh, cargar todas las notificaciones pero filtrar según corresponda
      else if (esGerente) {
        respuesta = await notificacionesService.obtenerTodasLasNotificaciones();
        // Filtrar notificaciones:
        // 1. Mostrar todas de "ausencia", "aprobacion", "rechazo" (ignorar otros tipos)
        // 2. Filtrar solo aquellas donde el gerente es el receptor (empleadoId coincide)
        const notificacionesFiltradas = (respuesta.data || []).filter(
          (notif) => {
            // Convertir empleadoId a string para comparación
            const receptorId = notif.empleadoId?._id?.toString() || notif.empleadoId?.toString() || notif.empleadoId;
            const esReceptor = receptorId === empleadoId;

            // Mostrar si es destinada a este gerente Y es uno de estos tipos
            return esReceptor && (notif.tipo === "ausencia" || notif.tipo === "aprobacion" || notif.tipo === "rechazo");
          }
        );
        respuesta.data = notificacionesFiltradas;
      }

      setNotificaciones(respuesta.data || []);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    } finally {
      setCargandoNotificaciones(false);
    }
  };

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);

  const navigate = useNavigate();

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
          CUADRANTE 3 BANDEJA DE ENTRADA (Para todos los usuarios)
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
            backgroundColor: notificaciones.length > 0 ? "#FFF8F0" : "#FFFFFF",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" fontWeight="bold" color="#808080">
                Notificaciones
              </Typography>
              {notificaciones.length > 0 && (
                <Badge badgeContent={notificaciones.length} color="error">
                  <NotificationsIcon sx={{ color: "#FF6B6B" }} />
                </Badge>
              )}
            </Box>
            <IconNextButton onClick={() => navigate("/bandeja-entrada")}>
              <ArrowForwardIosIcon />
            </IconNextButton>
          </Box>

          {/* Notificaciones */}
          {cargandoNotificaciones ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notificaciones.length > 0 ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, overflowY: "auto" }}>
              {notificaciones.slice(0, 3).map((notif, i) => {
                const colorMap = {
                  ausencia: "#FFE8D6",
                  mensaje: "#E8F5E9",
                  alerta: "#FFF3E0",
                  aprobacion: "#E8F5E9",
                  rechazo: "#FFEBEE",
                  evento: "#E3F2FD",
                  otro: "#F5F5F5",
                };
                return (
                  <Box
                    key={notif._id || i}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      backgroundColor: colorMap[notif.tipo] || colorMap.otro,
                      borderRadius: 1,
                      p: 1.5,
                      mb: 1,
                      cursor: "pointer",
                      borderLeft: "4px solid #7FC6BA",
                      "&:hover": { opacity: 0.8 },
                    }}
                  >
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                      <Typography variant="body2" fontWeight="bold" sx={{ color: "#585858", flex: 1 }}>
                        {notif.asunto}
                      </Typography>
                      {notif.prioridad && (
                        <Chip
                          label={notif.prioridad.toUpperCase()}
                          size="small"
                          sx={{
                            fontSize: "0.65rem",
                            height: "20px",
                            ml: 1,
                          }}
                        />
                      )}
                    </Box>
                    <Typography
                      variant="caption"
                      sx={{
                        color: "#808080",
                        mt: 0.5,
                        display: "-webkit-box",
                        WebkitLineClamp: 1,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {notif.descripcion}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          ) : (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
              <Typography variant="body2" color="#808080">
                No tienes notificaciones
              </Typography>
            </Box>
          )}

          {/* Botón para ver todas */}
          {notificaciones.length > 3 && (
            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography
                variant="caption"
                sx={{
                  color: "#7FC6BA",
                  cursor: "pointer",
                  fontWeight: 600,
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => navigate("/bandeja-entrada")}
              >
                Ver todas ({notificaciones.length})
              </Typography>
            </Box>
          )}
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
            justifyContent: "",
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
