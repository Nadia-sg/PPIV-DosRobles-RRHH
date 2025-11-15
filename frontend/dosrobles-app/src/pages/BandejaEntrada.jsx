// src/pages/BandejaEntrada.jsx
// Bandeja de Entrada - Sistema general de notificaciones para todos los usuarios

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import InfoIcon from "@mui/icons-material/Info";
import WarningIcon from "@mui/icons-material/Warning";
import MailIcon from "@mui/icons-material/Mail";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { PrimaryButton, SecondaryButton } from "../components/ui/Buttons";
import { notificacionesService } from "../services/notificacionesService";
import { useUser } from "../context/userContextHelper";
import MessageThread from "../components/bandeja/MessageThread";

export default function BandejaEntrada() {
  const { user, loading: userLoading } = useUser();

  // Estados
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("todas"); // todas, no-leidas, leidas
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificacionSeleccionada, setNotificacionSeleccionada] =
    useState(null);

  // Determinar si es empleado o gerente
  const esEmpleado = user?.role === "empleado";
  const esGerente = ["admin"].includes(user?.role); // Ahora solo hay admin (antes era gerente, rrhh, admin)
  const empleadoId = user?.empleadoId;

  console.log("🔍 [BandejaEntrada] user:", user);
  console.log("🔍 [BandejaEntrada] esEmpleado:", esEmpleado, "esGerente:", esGerente, "empleadoId:", empleadoId);

  // Cargar notificaciones cuando el usuario está disponible
  useEffect(() => {
    if (!userLoading && empleadoId) {
      cargarNotificaciones();
    }
  }, [userLoading, empleadoId]);

  const cargarNotificaciones = async () => {
    console.log("🚀 [cargarNotificaciones] Iniciando carga. esEmpleado:", esEmpleado, "esGerente:", esGerente);
    try {
      setCargando(true);
      setError(null);

      let respuesta;

      // Si es empleado, cargar solo sus notificaciones
      if (esEmpleado) {
        console.log("👤 [cargarNotificaciones] Eres empleado, obteniendo tus notificaciones...");
        respuesta = await notificacionesService.obtenerNotificaciones(empleadoId);
        console.log("📬 [cargarNotificaciones] Respuesta empleado:", respuesta);
      }
      // Si es gerente/admin, cargar todas las notificaciones pero filtrar según corresponda
      else if (esGerente) {
        console.log("👨‍💼 [cargarNotificaciones] Eres admin, obteniendo TODAS las notificaciones...");
        respuesta = await notificacionesService.obtenerTodasLasNotificaciones();
        console.log("📬 [cargarNotificaciones] Respuesta admin (TODAS):", respuesta);

        // Filtrar notificaciones:
        // 1. Mostrar todas de "ausencia", "aprobacion", "rechazo" (ignorar otros tipos)
        // 2. Filtrar solo aquellas donde el gerente es el receptor (empleadoId coincide)
        const notificacionesFiltradas = (respuesta.data || []).filter(
          (notif) => {
            // Convertir empleadoId a string para comparación
            const receptorId = notif.empleadoId?._id?.toString() || notif.empleadoId?.toString() || notif.empleadoId;
            const esReceptor = receptorId === empleadoId;

            console.log("🔍 Filtrando notif:", notif.tipo, "receptor:", receptorId, "yo:", empleadoId, "match:", esReceptor);

            // Mostrar si es destinada a este gerente Y es uno de estos tipos
            return esReceptor && (notif.tipo === "ausencia" || notif.tipo === "aprobacion" || notif.tipo === "rechazo" || notif.tipo === "mensaje");
          }
        );
        console.log("✅ Notificaciones filtradas para admin:", notificacionesFiltradas.length);
        respuesta.data = notificacionesFiltradas;
      } else {
        console.log("⚠️ No eres empleado ni admin, no se cargan notificaciones");
      }

      console.log("💾 [cargarNotificaciones] Guardando notificaciones:", respuesta?.data?.length || 0);
      setNotificaciones(respuesta?.data || []);
    } catch (err) {
      console.error("❌ Error al cargar notificaciones:", err);
      setError(
        "No se pudieron cargar las notificaciones. Por favor, intenta de nuevo."
      );
      setNotificaciones([]);
    } finally {
      setCargando(false);
    }
  };

  // Obtener icono según el tipo de notificación
  const getIconoTipo = (tipo) => {
    const iconos = {
      ausencia: <EventIcon sx={{ color: "#7FC6BA" }} />,
      mensaje: <MailIcon sx={{ color: "#7FC6BA" }} />,
      alerta: <WarningIcon sx={{ color: "#FF8C42" }} />,
      aprobacion: <CheckCircleIcon sx={{ color: "#4CAF50" }} />,
      rechazo: <WarningIcon sx={{ color: "#FF7779" }} />,
      evento: <EventIcon sx={{ color: "#7FC6BA" }} />,
      otro: <NotificationsIcon sx={{ color: "#808080" }} />,
    };
    return iconos[tipo] || iconos.otro;
  };

  // Obtener color del chip según prioridad
  const getColorPrioridad = (prioridad) => {
    const colores = {
      baja: { bg: "#D4E6E2", text: "#2E7D76" },
      media: { bg: "#FFE8D6", text: "#D97706" },
      alta: { bg: "#FFD4D4", text: "#991B1B" },
    };
    return colores[prioridad] || colores.media;
  };

  // Marcar notificación como leída
  const handleMarcarComoLeida = async (notificacionId, leida) => {
    try {
      if (!leida) {
        await notificacionesService.marcarComoLeida(notificacionId);
        setNotificaciones(
          notificaciones.map((notif) =>
            notif._id === notificacionId ? { ...notif, leida: true } : notif
          )
        );
      }
    } catch (err) {
      console.error("Error al marcar como leída:", err);
    }
  };

  // Eliminar notificación
  const handleEliminarNotificacion = async (notificacionId) => {
    try {
      await notificacionesService.eliminarNotificacion(notificacionId);
      setNotificaciones(
        notificaciones.filter((notif) => notif._id !== notificacionId)
      );
      setAnchorEl(null);
    } catch (err) {
      console.error("Error al eliminar notificación:", err);
    }
  };

  // Marcar todas como leídas
  const handleMarcarTodasComoLeidas = async () => {
    try {
      await notificacionesService.marcarTodasComoLeidas(empleadoId);
      setNotificaciones(
        notificaciones.map((notif) => ({ ...notif, leida: true }))
      );
    } catch (err) {
      console.error("Error al marcar todas como leídas:", err);
    }
  };

  // Eliminar todas las leídas
  const handleEliminarTodasLasLeidas = async () => {
    try {
      await notificacionesService.eliminarNotificacionesLeidas(empleadoId);
      setNotificaciones(notificaciones.filter((notif) => !notif.leida));
    } catch (err) {
      console.error("Error al eliminar leídas:", err);
    }
  };

  // Filtrar notificaciones según el filtro seleccionado
  const notificacionesFiltradas = notificaciones.filter((notif) => {
    if (filtro === "no-leidas") return !notif.leida;
    if (filtro === "leidas") return notif.leida;
    return true; // todas
  });

  // Agrupar mensajes por conversación - mostrar solo los mensajes principales (no respuestas)
  const mensajesPrincipales = notificacionesFiltradas.filter((notif) => {
    // Mostrar: ausencias, aprobaciones, rechazos, y mensajes principales (no respuestas)
    // Las respuestas tienen el campo respuestaA relleno
    if (notif.respuestaA) return false; // Las respuestas no se muestran aquí
    return true;
  });

  // Contar notificaciones no leídas
  const noLeidas = notificaciones.filter((notif) => !notif.leida).length;

  // Formatear fecha (manejo correcto de timezones)
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      // Si es una string en formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
      if (typeof fecha === 'string' && fecha.includes('-')) {
        const partes = fecha.split('T')[0].split('-');
        if (partes.length === 3) {
          // Parsear manualmente para evitar problemas de timezone
          const [year, month, day] = partes.map(p => parseInt(p, 10));

          // Crear fecha sin timezone issues
          const hoy = new Date();
          const hoySinHora = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
          const ayerSinHora = new Date(hoySinHora);
          ayerSinHora.setDate(ayerSinHora.getDate() - 1);

          const fechaComparada = new Date(year, month - 1, day);

          if (fechaComparada.getTime() === hoySinHora.getTime()) {
            // Es hoy, mostrar hora
            const date = new Date(fecha);
            return date.toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            });
          } else if (fechaComparada.getTime() === ayerSinHora.getTime()) {
            return "Ayer";
          } else {
            // Es otro día, mostrar fecha corta
            return `${day}/${month}`;
          }
        }
      }

      // Fallback para otros formatos
      const date = new Date(fecha);
      return date.toLocaleDateString("es-AR", {
        month: "short",
        day: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
          <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858" }}>
            Bandeja de Entrada
          </Typography>
          {noLeidas > 0 && (
            <Badge
              badgeContent={noLeidas}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  backgroundColor: "#FF6B6B",
                  color: "#FF6B6B",
                },
              }}
            >
              <Box />
            </Badge>
          )}
        </Box>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Gestiona tus notificaciones y mensajes
        </Typography>
      </Box>

      {/* Mostrar error si existe */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estado de cargando */}
      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Controles */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            {/* Filtros */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <SecondaryButton
                onClick={() => setFiltro("todas")}
                sx={{
                  backgroundColor:
                    filtro === "todas" ? "#7FC6BA" : "transparent",
                  color: filtro === "todas" ? "#FFFFFF" : "#7FC6BA",
                  borderColor: "#7FC6BA",
                  "&:hover": {
                    backgroundColor:
                      filtro === "todas" ? "#6DB5AA" : "#F5F5F5",
                  },
                }}
              >
                Todas
              </SecondaryButton>
              <SecondaryButton
                onClick={() => setFiltro("no-leidas")}
                sx={{
                  backgroundColor:
                    filtro === "no-leidas" ? "#7FC6BA" : "transparent",
                  color: filtro === "no-leidas" ? "#FFFFFF" : "#7FC6BA",
                  borderColor: "#7FC6BA",
                  "&:hover": {
                    backgroundColor:
                      filtro === "no-leidas" ? "#6DB5AA" : "#F5F5F5",
                  },
                }}
              >
                No leídas ({noLeidas})
              </SecondaryButton>
              <SecondaryButton
                onClick={() => setFiltro("leidas")}
                sx={{
                  backgroundColor:
                    filtro === "leidas" ? "#7FC6BA" : "transparent",
                  color: filtro === "leidas" ? "#FFFFFF" : "#7FC6BA",
                  borderColor: "#7FC6BA",
                  "&:hover": {
                    backgroundColor:
                      filtro === "leidas" ? "#6DB5AA" : "#F5F5F5",
                  },
                }}
              >
                Leídas
              </SecondaryButton>
            </Box>

            {/* Acciones rápidas */}
            {noLeidas > 0 && (
              <PrimaryButton onClick={handleMarcarTodasComoLeidas}>
                Marcar todas como leídas
              </PrimaryButton>
            )}
          </Box>

          {/* Lista de notificaciones */}
          <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 2, overflow: "hidden" }}>
            {mensajesPrincipales.length > 0 ? (
              mensajesPrincipales.map((notificacion, index) =>
                notificacion.tipo === "mensaje" ? (
                  <MessageThread
                    key={notificacion._id || index}
                    mensaje={notificacion}
                    onReplyAdded={cargarNotificaciones}
                    getColorPrioridad={getColorPrioridad}
                    getIconoTipo={getIconoTipo}
                    formatearFecha={formatearFecha}
                  />
                ) : (
                  <Box
                  key={notificacion._id || index}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    p: 2,
                    borderBottom:
                      index < mensajesPrincipales.length - 1
                        ? "1px solid #E0E0E0"
                        : "none",
                    backgroundColor: notificacion.leida ? "#FFFFFF" : "#FFFBF7",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    "&:hover": {
                      backgroundColor: notificacion.leida
                        ? "#F5F5F5"
                        : "#FFFAF5",
                    },
                  }}
                  onClick={() =>
                    handleMarcarComoLeida(notificacion._id, notificacion.leida)
                  }
                >
                  {/* Icono del tipo */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      minWidth: 48,
                      minHeight: 48,
                      backgroundColor: "#F0F0F0",
                      borderRadius: "50%",
                      mr: 2,
                      flexShrink: 0,
                    }}
                  >
                    {getIconoTipo(notificacion.tipo)}
                  </Box>

                  {/* Contenido de la notificación */}
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        sx={{
                          fontWeight: notificacion.leida ? 400 : 600,
                          color: "#585858",
                          flex: 1,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {notificacion.asunto}
                      </Typography>
                      {notificacion.prioridad && (
                        <Chip
                          label={notificacion.prioridad.toUpperCase()}
                          size="small"
                          sx={{
                            ...getColorPrioridad(notificacion.prioridad),
                            fontWeight: 600,
                            fontSize: "0.7rem",
                            flexShrink: 0,
                          }}
                        />
                      )}
                    </Box>

                    <Typography
                      sx={{
                        fontSize: "0.9rem",
                        color: "#808080",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                      }}
                    >
                      {notificacion.descripcion}
                    </Typography>

                    {/* Tipo y fecha */}
                    <Box
                      sx={{
                        display: "flex",
                        gap: 2,
                        mt: 0.5,
                        fontSize: "0.8rem",
                        color: "#A0A0A0",
                      }}
                    >
                      <Typography sx={{ fontSize: "inherit" }}>
                        {notificacion.tipo}
                      </Typography>
                      <Typography sx={{ fontSize: "inherit" }}>
                        {formatearFecha(notificacion.createdAt)}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Indicador de no leída */}
                  {!notificacion.leida && (
                    <Box
                      sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        backgroundColor: "#7FC6BA",
                        mx: 1,
                        flexShrink: 0,
                      }}
                    />
                  )}

                  {/* Menú de acciones */}
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      setAnchorEl(e.currentTarget);
                      setNotificacionSeleccionada(notificacion._id);
                    }}
                    sx={{ ml: 1 }}
                  >
                    <MoreVertIcon sx={{ fontSize: "1.2rem" }} />
                  </IconButton>
                  </Box>
                )
              )
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                {filtro === "no-leidas" ? (
                  <>
                    <NotificationsIcon
                      sx={{ fontSize: "3rem", color: "#D0D0D0", mb: 1 }}
                    />
                    <Typography sx={{ color: "#808080" }}>
                      No tienes notificaciones no leídas
                    </Typography>
                  </>
                ) : (
                  <>
                    <InfoIcon sx={{ fontSize: "3rem", color: "#D0D0D0", mb: 1 }} />
                    <Typography sx={{ color: "#808080" }}>
                      No tienes notificaciones
                    </Typography>
                  </>
                )}
              </Box>
            )}
          </Box>

          {/* Opción para limpiar leídas */}
          {notificaciones.some((notif) => notif.leida) && (
            <Box sx={{ mt: 2, textAlign: "right" }}>
              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#7FC6BA",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={handleEliminarTodasLasLeidas}
              >
                Eliminar todas las leídas
              </Typography>
            </Box>
          )}
        </>
      )}

      {/* Menú de acciones */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem
          onClick={() => {
            handleEliminarNotificacion(notificacionSeleccionada);
          }}
        >
          <DeleteIcon sx={{ mr: 1, fontSize: "1.2rem" }} />
          Eliminar
        </MenuItem>
      </Menu>
    </Box>
  );
}
