import React, { useState } from "react";
import { Box, TextField, Alert, CircularProgress } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import { notificacionesService } from "../../services/notificacionesService";

const SendMessageModal = ({ open, onClose, empleado, onMessageSent }) => {
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [prioridad, setPrioridad] = useState("media");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleReset = () => {
    setAsunto("");
    setMensaje("");
    setPrioridad("media");
    setError(null);
    setSuccess(false);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleSend = async () => {
    // Validación
    if (!asunto.trim()) {
      setError("El asunto es obligatorio");
      return;
    }
    if (!mensaje.trim()) {
      setError("El mensaje es obligatorio");
      return;
    }

    try {
      setSending(true);
      setError(null);

      // Obtener el ID del usuario logueado
      const user = JSON.parse(localStorage.getItem("user"));

      // Crear un ID único para la conversación
      const conversacionId = `conv_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      // Crear notificación
      const notificacionData = {
        empleadoId: empleado._id,
        asunto: asunto.trim(),
        descripcion: mensaje.trim(),
        tipo: "mensaje",
        prioridad: prioridad,
        conversacionId: conversacionId,
        remitenteId: user?.empleadoId, // Quien envía el mensaje
      };

      console.log("📤 [SendMessageModal] Enviando notificación:", notificacionData);

      await notificacionesService.crearNotificacion(notificacionData);

      setSuccess(true);
      console.log("✅ [SendMessageModal] Mensaje enviado exitosamente");

      // Limpiar después de 1.5 segundos
      setTimeout(() => {
        handleReset();
        onClose();
        if (onMessageSent) onMessageSent();
      }, 1500);
    } catch (err) {
      console.error("❌ [SendMessageModal] Error al enviar mensaje:", err);
      setError(err.message || "Error al enviar el mensaje");
    } finally {
      setSending(false);
    }
  };

  if (!open) return null;

  return (
    <ModalCard
      open={open}
      onClose={handleClose}
      title={`Enviar mensaje a ${empleado?.nombre || "empleado"}`}
      width={600}
      actions={[
        {
          label: success ? "✓ Enviado" : sending ? "Enviando..." : "Enviar",
          onClick: handleSend,
          variant: "contained",
          disabled: sending || success,
        },
        {
          label: "Cancelar",
          onClick: handleClose,
          variant: "outlined",
          disabled: sending,
        },
      ]}
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Mostrar mensaje de éxito */}
        {success && (
          <Alert severity="success" sx={{ mb: 1 }}>
            Mensaje enviado exitosamente a {empleado?.nombre}
          </Alert>
        )}

        {/* Mostrar errores */}
        {error && (
          <Alert severity="error" sx={{ mb: 1 }}>
            {error}
          </Alert>
        )}

        {/* Información del empleado */}
        <Box sx={{ p: 2, backgroundColor: "#F5F5F5", borderRadius: 1 }}>
          <TextField
            fullWidth
            label="Para"
            value={`${empleado?.nombre || ""} ${empleado?.apellido || ""} (${empleado?.email || ""})`}
            disabled
            size="small"
            variant="outlined"
          />
        </Box>

        {/* Asunto */}
        <TextField
          fullWidth
          label="Asunto"
          placeholder="Ej: Recordatorio de reunión"
          value={asunto}
          onChange={(e) => setAsunto(e.target.value)}
          disabled={sending || success}
          variant="outlined"
          size="small"
        />

        {/* Prioridad */}
        <TextField
          select
          fullWidth
          label="Prioridad"
          value={prioridad}
          onChange={(e) => setPrioridad(e.target.value)}
          disabled={sending || success}
          variant="outlined"
          size="small"
          SelectProps={{
            native: true,
          }}
        >
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </TextField>

        {/* Mensaje */}
        <TextField
          fullWidth
          label="Mensaje"
          placeholder="Escribe tu mensaje aquí..."
          value={mensaje}
          onChange={(e) => setMensaje(e.target.value)}
          disabled={sending || success}
          variant="outlined"
          multiline
          rows={6}
          sx={{
            "& .MuiOutlinedInput-root": {
              fontFamily: "inherit",
            },
          }}
        />

        {/* Mostrar loading */}
        {sending && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </Box>
    </ModalCard>
  );
};

export default SendMessageModal;
