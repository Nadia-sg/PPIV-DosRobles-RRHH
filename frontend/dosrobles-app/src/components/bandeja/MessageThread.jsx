import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Avatar,
  Chip,
  Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { notificacionesService } from "../../services/notificacionesService";
import { useUser } from "../../context/userContextHelper";

const MessageThread = ({
  mensaje,
  onReplyAdded,
  getColorPrioridad,
  getIconoTipo,
  formatearFecha
}) => {
  const { user } = useUser();
  const [expanded, setExpanded] = useState(false);
  const [respuestas, setRespuestas] = useState([]);
  const [loadingRespuestas, setLoadingRespuestas] = useState(false);
  const [respuestaText, setRespuestaText] = useState("");
  const [enviando, setEnviando] = useState(false);

  // Determinar quién envió el mensaje original
  const remiteNombre = mensaje.remitenteId?.nombre
    ? `${mensaje.remitenteId.nombre} ${mensaje.remitenteId.apellido || ""}`
    : mensaje.empleadoId?.nombre
    ? `${mensaje.empleadoId.nombre} ${mensaje.empleadoId.apellido || ""}`
    : "Sistema";

  const handleExpandClick = async () => {
    if (!expanded && respuestas.length === 0) {
      // Cargar respuestas cuando se expande por primera vez
      await cargarRespuestas();
    }
    setExpanded(!expanded);
  };

  const cargarRespuestas = async () => {
    try {
      setLoadingRespuestas(true);
      // Obtener todas las notificaciones para este usuario
      const notifs = await notificacionesService.obtenerNotificaciones(user?.empleadoId);

      // Filtrar respuestas relacionadas a este mensaje
      // Buscar por: respuestaA coincide con el ID del mensaje, O tienen la misma conversacionId pero son respuestas
      const respuestasRelacionadas = (notifs || []).filter((n) => {
        // Buscar notificaciones que respondan a este mensaje
        if (n.respuestaA === mensaje._id || n.respuestaA?.toString() === mensaje._id.toString()) {
          return true;
        }
        // O que pertenezcan a la misma conversación Y sean respuestas (tengan respuestaA)
        if ((n.conversacionId === mensaje.conversacionId || n.conversacionId?.toString() === mensaje.conversacionId?.toString()) && n.respuestaA) {
          return true;
        }
        return false;
      });

      setRespuestas(respuestasRelacionadas);
    } catch (err) {
      console.error("Error al cargar respuestas:", err);
    } finally {
      setLoadingRespuestas(false);
    }
  };

  const handleEnviarRespuesta = async () => {
    if (!respuestaText.trim()) return;

    try {
      setEnviando(true);

      // Obtener el usuario logueado del localStorage
      const currentUser = JSON.parse(localStorage.getItem("user"));

      // Determinar a quién enviar la respuesta
      // Si el mensaje tiene remitenteId, responder al remitente
      // Si no, responder al empleadoId original
      const receptorId = mensaje.remitenteId?._id || mensaje.remitenteId || mensaje.empleadoId?._id;

      const respuestaData = {
        empleadoId: receptorId,
        asunto: `Re: ${mensaje.asunto}`,
        descripcion: respuestaText.trim(),
        tipo: "mensaje", // Usar 'mensaje' como tipo válido
        prioridad: "media",
        conversacionId: mensaje.conversacionId || mensaje._id,
        respuestaA: mensaje._id, // Campo para rastrear que es respuesta
        remitenteId: currentUser?.empleadoId, // Quien responde (del usuario logueado)
      };

      await notificacionesService.crearNotificacion(respuestaData);

      setRespuestaText("");
      await cargarRespuestas(); // Recargar respuestas

      if (onReplyAdded) {
        onReplyAdded();
      }
    } catch (err) {
      console.error("Error al enviar respuesta:", err);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <Box sx={{ mb: 0, borderBottom: "1px solid #E0E0E0" }}>
      {/* Encabezado del mensaje */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 2,
          backgroundColor: mensaje.leida ? "#FFFFFF" : "#FFFBF7",
          cursor: "pointer",
          transition: "background-color 0.2s",
          "&:hover": {
            backgroundColor: mensaje.leida ? "#F5F5F5" : "#FFFAF5",
          },
        }}
        onClick={handleExpandClick}
      >
        {/* Avatar/Icono */}
        <Avatar
          sx={{
            width: 40,
            height: 40,
            mr: 2,
            backgroundColor: "#F0F0F0",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {getIconoTipo(mensaje.tipo)}
        </Avatar>

        {/* Contenido principal */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
            <Typography
              sx={{
                fontWeight: mensaje.leida ? 400 : 600,
                color: "#585858",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {mensaje.asunto}
            </Typography>
            {mensaje.prioridad && (
              <Chip
                label={mensaje.prioridad.toUpperCase()}
                size="small"
                sx={{
                  ...getColorPrioridad(mensaje.prioridad),
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
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >
            {remiteNombre}: {mensaje.descripcion}
          </Typography>

          <Box sx={{ display: "flex", gap: 2, mt: 0.5, fontSize: "0.8rem", color: "#A0A0A0" }}>
            <Typography sx={{ fontSize: "inherit" }}>{mensaje.tipo}</Typography>
            <Typography sx={{ fontSize: "inherit" }}>{formatearFecha(mensaje.createdAt)}</Typography>
          </Box>
        </Box>

        {/* Botón expandir */}
        <IconButton size="small" sx={{ ml: 1 }}>
          {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </IconButton>
      </Box>

      {/* Contenido expandido */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ p: 2, backgroundColor: "#F9F9F9", borderTop: "1px solid #E0E0E0" }}>
          {/* Mensaje original */}
          <Box sx={{ mb: 2, p: 2, backgroundColor: "#FFFFFF", borderRadius: 1, borderLeft: "4px solid #7FC6BA" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
              <Typography sx={{ fontWeight: 600, color: "#585858" }}>
                {remiteNombre}
              </Typography>
              <Typography sx={{ fontSize: "0.85rem", color: "#A0A0A0" }}>
                {formatearFecha(mensaje.createdAt)}
              </Typography>
            </Box>
            <Typography sx={{ color: "#585858", whiteSpace: "pre-wrap" }}>
              {mensaje.descripcion}
            </Typography>
          </Box>

          {/* Respuestas anteriores */}
          {loadingRespuestas ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : respuestas.length > 0 ? (
            <Box sx={{ mb: 2 }}>
              {respuestas.map((respuesta) => (
                <Box
                  key={respuesta._id}
                  sx={{
                    mb: 1,
                    p: 2,
                    backgroundColor: "#FFFFFF",
                    borderRadius: 1,
                    borderLeft: "4px solid #FFD700",
                  }}
                >
                  <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                    <Typography sx={{ fontWeight: 600, color: "#585858" }}>
                      {respuesta.remitenteId?.nombre ? `${respuesta.remitenteId.nombre} ${respuesta.remitenteId.apellido || ""}` : (respuesta.empleadoId?.nombre ? `${respuesta.empleadoId.nombre}` : "Usuario")}
                    </Typography>
                    <Typography sx={{ fontSize: "0.85rem", color: "#A0A0A0" }}>
                      {formatearFecha(respuesta.createdAt)}
                    </Typography>
                  </Box>
                  <Typography sx={{ color: "#585858", whiteSpace: "pre-wrap" }}>
                    {respuesta.descripcion}
                  </Typography>
                </Box>
              ))}
            </Box>
          ) : null}

          {/* Input para responder */}
          <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
            <TextField
              fullWidth
              placeholder="Escribe tu respuesta..."
              value={respuestaText}
              onChange={(e) => setRespuestaText(e.target.value)}
              disabled={enviando}
              size="small"
              multiline
              maxRows={4}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 1,
                },
              }}
            />
            <IconButton
              onClick={handleEnviarRespuesta}
              disabled={enviando || !respuestaText.trim()}
              sx={{
                alignSelf: "flex-end",
                color: "#7FC6BA",
                "&:hover": { backgroundColor: "#F0F0F0" },
              }}
            >
              {enviando ? <CircularProgress size={24} /> : <SendIcon />}
            </IconButton>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );
};

export default MessageThread;
