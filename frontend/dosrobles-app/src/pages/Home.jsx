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
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { notificacionesService } from "../services/notificacionesService";

export default function Home() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const [seconds, setSeconds] = useState(0);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  // Simulador de fichaje
  useEffect(() => {
    const interval = setInterval(() => setSeconds((prev) => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  // Leer rol del token (si existe)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUserRole(payload.role);
      } catch (e) {
        console.error("Error decodificando token:", e);
      }
    }
  }, []);

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);

  const eventos = [
    { fecha: "25 Oct", hora: "14:00", nombre: "Cumpleaños Erica", icono: <CakeIcon /> },
    { fecha: "27 Oct", hora: "09:30", nombre: "Reunión de equipo", icono: <EmojiEventsIcon /> },
    { fecha: "29 Oct", hora: "16:00", nombre: "Entrega de proyecto", icono: <EmojiEventsIcon /> },
  ];

  if (!userRole) return null;

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
      {userRole === "admin" ? (
        <>
          {/* ADMIN */}
          <Box
            sx={{
              display: "flex",
              flex: isMobile ? "0 0 auto" : "0 0 30%",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <FichajeCard
              isMobile={isMobile}
              progress={progress}
              seconds={seconds}
              navigate={navigate}
            />
            <EstadoEquipoCard isMobile={isMobile} />
          </Box>

          <Box
            sx={{
              display: "flex",
              flex: isMobile ? "0 0 auto" : "0 0 40%",
              gap: 2,
              flexWrap: isMobile ? "wrap" : "nowrap",
            }}
          >
            <BandejaEntradaCard isMobile={isMobile} navigate={navigate} />
            <EventosCard isMobile={isMobile} eventos={eventos} />
          </Box>
        </>
      ) : (
        /* EMPLEADO */
        <Box
          sx={{
            display: "flex",
            flex: 1,
            gap: 2,
            flexWrap: isMobile ? "wrap" : "nowrap",
          }}
        >
          {/* Columna izquierda (idéntica al admin) */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              flex: isMobile ? "0 0 100%" : "0 0 50%",
            }}
          >
            <FichajeCard
              isMobile={isMobile}
              progress={progress}
              seconds={seconds}
              navigate={navigate}
            />
            <BandejaEntradaCard isMobile={isMobile} navigate={navigate} />
          </Box>

          {/* Columna derecha — eventos ocupa todo el alto */}
          <Box
            sx={{
              flex: isMobile ? "0 0 100%" : "0 0 50%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
            }}
          >
            <EventosCard
              isMobile={isMobile}
              eventos={eventos}
              fullHeight
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

/* ==================================================
   COMPONENTES REUTILIZABLES
================================================== */

function FichajeCard({ isMobile, progress, seconds, navigate }) {
  return (
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
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h6" fontWeight="bold" color="#808080">
          Fichaje
        </Typography>
        <IconNextButton onClick={() => navigate("/fichaje/historial")}>
          <ArrowForwardIosIcon />
        </IconNextButton>
      </Box>

      <Box sx={{ display: "flex", flex: 1, gap: 2, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        <Box
          sx={{
            flex: "1 1 50%",
            display: "flex",
            flexDirection: "column",
            gap: 1.5,
            marginLeft: 1.5,
          }}
        >
          <PrimaryButton startIcon={<PlayArrowIcon />}>Fichaje oficina</PrimaryButton>
          <SecondaryButton startIcon={<PlayArrowIcon />}>Fichaje remoto</SecondaryButton>
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

        <Box sx={{ flex: "1 1 50%", display: "flex", justifyContent: "center", alignItems: "start" }}>
          <Box sx={{ position: "relative", display: "inline-flex" }}>
            <CircularProgress variant="determinate" value={100} size={100} thickness={5} sx={{ color: "#e0e0e0" }} />
            <CircularProgress variant="determinate" value={progress} size={100} thickness={5} sx={{ color: "#817A6F", position: "absolute", left: 0 }} />
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
                {Math.floor(seconds / 3600)}h {Math.floor((seconds % 3600) / 60)}m
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Card>
  );
}

function EstadoEquipoCard({ isMobile }) {
  return (
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
      <Typography variant="h6" fontWeight="bold" color="#808080" mb={1}>
        Estado del Equipo
      </Typography>
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
  );
}

function BandejaEntradaCard({ isMobile, navigate }) {
  const { user, loading: userLoading } = useUser();
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  const esEmpleado = user?.role === "empleado";
  const esAdmin = ["admin"].includes(user?.role);
  const empleadoId = user?.empleadoId;

  useEffect(() => {
    if (!userLoading && empleadoId) {
      cargarNotificaciones();
    }
  }, [userLoading, empleadoId]);

  const cargarNotificaciones = async () => {
    console.log("🚀 [BandejaEntradaCard] Cargando notificaciones. esEmpleado:", esEmpleado, "esAdmin:", esAdmin);
    try {
      setCargando(true);

      let respuesta;

      if (esEmpleado) {
        console.log("👤 [BandejaEntradaCard] Eres empleado, obteniendo tus notificaciones...");
        respuesta = await notificacionesService.obtenerNotificaciones(empleadoId);
      } else if (esAdmin) {
        console.log("👨‍💼 [BandejaEntradaCard] Eres admin, obteniendo TODAS las notificaciones...");
        respuesta = await notificacionesService.obtenerTodasLasNotificaciones();

        const notificacionesFiltradas = (respuesta.data || []).filter((notif) => {
          const receptorId = notif.empleadoId?._id?.toString() || notif.empleadoId?.toString() || notif.empleadoId;
          const esReceptor = receptorId === empleadoId;
          return esReceptor && (notif.tipo === "ausencia" || notif.tipo === "aprobacion" || notif.tipo === "rechazo");
        });
        respuesta.data = notificacionesFiltradas;
      }

      console.log("📬 [BandejaEntradaCard] Notificaciones cargadas:", respuesta?.data?.length || 0);
      // Mostrar solo las últimas 3 notificaciones
      const ultimasNotificaciones = (respuesta?.data || []).slice(0, 3);
      setNotificaciones(ultimasNotificaciones);
    } catch (err) {
      console.error("❌ [BandejaEntradaCard] Error al cargar:", err);
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      if (typeof fecha === 'string' && fecha.includes('-')) {
        const partes = fecha.split('T')[0].split('-');
        if (partes.length === 3) {
          const [year, month, day] = partes.map(p => parseInt(p, 10));
          const hoy = new Date();
          const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
          const ayerSinHora = new Date(hoySinHora);
          ayerSinHora.setDate(ayerSinHora.getDate() - 1);
          const fechaComparada = new Date(year, month - 1, day);

          if (fechaComparada.getTime() === hoySinHora.getTime()) {
            const date = new Date(fecha);
            return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
          } else if (fechaComparada.getTime() === ayerSinHora.getTime()) {
            return "Ayer";
          } else {
            return `${day}/${month}`;
          }
        }
      }
      const date = new Date(fecha);
      return date.toLocaleDateString("es-AR", { month: "short", day: "numeric" });
    } catch {
      return fecha;
    }
  };

  return (
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

      <Box sx={{ display: "flex", flexDirection: "column", gap: 1, flex: 1, overflowY: "auto" }}>
        {cargando ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={30} />
          </Box>
        ) : notificaciones.length > 0 ? (
          notificaciones.map((notif, i) => (
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
                  {formatearFecha(notif.createdAt)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {notif.empleadoId?.nombre || "Sistema"}
                </Typography>
              </Box>
              <Typography variant="body2" fontWeight="bold" sx={{ width: "100%" }}>
                {notif.asunto}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", py: 2 }}>
            Sin notificaciones
          </Typography>
        )}
      </Box>
    </Card>
  );
}

function EventosCard({ isMobile, eventos }) {
  return (
    <Card
      sx={{
        flex: 1,
        borderRadius: 3,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        p: 2,
        height: "100%",
      }}
    >
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

            <Box sx={{ display: "flex", justifyContent: "center" }}>{evento.icono}</Box>
          </Box>
        ))}
      </Box>
    </Card>
  );
}

