/* src/components/home/BandejaEntradaCard.jsx*/

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  Typography,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import { IconNextButton } from "../../components/ui/Buttons";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { notificacionesService } from "../../services/notificacionesService";
import { useUser } from "../../context/userContextHelper";

export default function BandejaEntradaCard() {
  const isMobile = useMediaQuery("(max-width:900px)");
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();

  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);

  // Cargar notificaciones cuando el usuario esté disponible
  useEffect(() => {
    if (!userLoading && user?.empleadoId) {
      cargarNotificaciones();
    }
  }, [userLoading, user?.empleadoId]);

  const cargarNotificaciones = async () => {
    try {
      setCargando(true);
      const respuesta = await notificacionesService.obtenerNotificaciones(user.empleadoId);
      // Tomar solo las primeras 5 notificaciones
      setNotificaciones((respuesta.data || []).slice(0, 5));
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  };

  // Formatear fecha
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      const date = new Date(fecha);
      return date.toLocaleDateString("es-AR", { month: "short", day: "numeric" });
    } catch {
      return fecha;
    }
  };

  return (
    <>
      {/* ===========================
          CUADRANTE 3 BANDEJA ENTRADA
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
          {cargando ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={30} />
            </Box>
          ) : notificaciones.length > 0 ? (
            notificaciones.map((notif, i) => (
              <Box
                key={notif._id || i}
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
                {/* Nombre */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: "100px", fontWeight: 500 }}
                >
                  {notif.remitenteId?.nombre || notif.empleadoId?.nombre || "Sistema"}
                </Typography>

                {/* Asunto/Mensaje */}
                <Typography
                  variant="body2"
                  fontWeight="bold"
                  sx={{
                    flex: 1,
                    ml: { xs: 0, md: 2 },
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap"
                  }}
                >
                  {notif.asunto}
                </Typography>

                {/* Fecha */}
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ minWidth: "80px", textAlign: "right", ml: { xs: 0, md: 2 } }}
                >
                  {formatearFecha(notif.createdAt)}
                </Typography>
              </Box>
            ))
          ) : (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 2 }}>
              Sin notificaciones
            </Typography>
          )}
        </Box>
      </Card>
    </>
  );
}
