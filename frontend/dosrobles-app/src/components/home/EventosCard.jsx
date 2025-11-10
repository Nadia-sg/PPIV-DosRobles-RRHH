/* src/components/home/EventosCard.jsx*/

import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  Typography,
  IconButton,
  TextField,
  useMediaQuery,
  Snackbar,
  Alert,
} from "@mui/material";
import EditCalendarIcon from "@mui/icons-material/EditCalendar";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { SecondaryButton } from "../ui/Buttons";
import ModalCard from "../ui/ModalCard";

export default function EventosCard({ API_BASE }) {
  const isMobile = useMediaQuery("(max-width:900px)");

  const [eventos, setEventos] = useState([]);
  const [openModalEvento, setOpenModalEvento] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [formEvento, setFormEvento] = useState({
    fecha: "",
    hora: "",
    detalle: "",
  });
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Cargar eventos al montar
  useEffect(() => {
    async function fetchEventos() {
      try {
        const res = await fetch(`${API_BASE}/eventos`);
        const data = await res.json();
        if (res.ok) setEventos(data.data || []);
      } catch (err) {
        console.error("Error cargando eventos", err);
      }
    }
    fetchEventos();
  }, [API_BASE]);

  // Manejar cambios en formulario
  function handleChangeForm(e) {
    const { name, value } = e.target;
    setFormEvento((prev) => ({ ...prev, [name]: value }));
  }

  // Guardar o actualizar evento
  async function handleGuardarEvento() {
    if (!formEvento.fecha || !formEvento.hora || !formEvento.detalle.trim()) {
      setToast({
        open: true,
        message: "Completa todos los campos",
        severity: "warning",
      });
      return;
    }

    try {
      if (editIndex !== null) {
        // --- MODO EDICIÓN ---
        const eventoEditado = { ...formEvento, _id: eventos[editIndex]._id };
        const res = await fetch(`${API_BASE}/eventos/${eventoEditado._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(eventoEditado),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Error al actualizar evento");

        const nuevosEventos = [...eventos];
        nuevosEventos[editIndex] = data.data;
        setEventos(nuevosEventos);
        setEditIndex(null);
        setToast({
          open: true,
          message: "Evento actualizado correctamente",
          severity: "info",
        });
      } else {
        // --- MODO CREACIÓN ---
        const res = await fetch(`${API_BASE}/eventos`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formEvento),
        });
        const data = await res.json();
        if (!res.ok)
          throw new Error(data?.message || "Error al crear el evento");

        setEventos((prev) => [...prev, data.data]);
        setToast({
          open: true,
          message: "Evento agregado correctamente",
          severity: "success",
        });
      }

      // Reset y cerrar modal
      setFormEvento({ fecha: "", hora: "", detalle: "" });
      setOpenModalEvento(false);
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: err.message || "Error al guardar evento",
        severity: "error",
      });
    }
  }

  // Editar evento
  const handleEditarEvento = (index) => {
    setFormEvento({ ...eventos[index] }); // 🔑 clonar objeto
    setEditIndex(index);
    setOpenModalEvento(true);
  };

  // Eliminar evento
  async function handleEliminarEvento(index) {
    const eventoAEliminar = eventos[index];
    const confirmacion = window.confirm(
      `¿Seguro que deseas eliminar el evento "${eventoAEliminar.detalle}"?`
    );
    if (!confirmacion) return;

    try {
      const res = await fetch(`${API_BASE}/eventos/${eventoAEliminar._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error al eliminar evento");

      setEventos((prev) => prev.filter((_, i) => i !== index));
      setToast({
        open: true,
        message: "Evento eliminado correctamente",
        severity: "success",
      });
    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: err.message || "Error al eliminar evento",
        severity: "error",
      });
    }
  }

  return (
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
          onClick={() => setOpenModalEvento(true)}
        >
          Añadir evento
        </SecondaryButton>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 1,
          maxHeight: 300, // ajusta según lo que quieras mostrar
          overflowY: "auto", // permite scroll vertical
          pr: 1, // padding a la derecha para que no tape la scrollbar
        }}
      >
        {eventos.map((evento, i) => {
          const fechaStr = new Date(evento.fecha).toLocaleDateString(
            undefined,
            { day: "2-digit", month: "short" }
          );
          return (
            <Box
              key={evento._id || i}
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
                  {fechaStr}
                </Typography>
                <Typography variant="caption" color="#808080">
                  {evento.hora}
                </Typography>
              </Box>
              <Box sx={{ pl: 2, display: "flex", alignItems: "center" }}>
                <Typography variant="body2" fontWeight="bold">
                  {evento.detalle}
                </Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                <IconButton size="small" onClick={() => handleEditarEvento(i)}>
                  <EditIcon fontSize="small" sx={{ color: "#808080" }} />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => handleEliminarEvento(i)}
                >
                  <DeleteIcon fontSize="small" sx={{ color: "#808080" }} />
                </IconButton>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Modal agregar/editar evento */}
      <ModalCard
        open={openModalEvento}
        onClose={() => {
          setOpenModalEvento(false);
          setEditIndex(null);
        }}
        title={editIndex !== null ? "Editar evento" : "Agregar evento"}
        actions={[
          {
            label: "Cancelar",
            onClick: () => setOpenModalEvento(false),
            variant: "outlined",
          },
          {
            label: "Guardar",
            onClick: handleGuardarEvento,
            variant: "contained",
          },
        ]}
      >
        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            label="Fecha"
            type="date"
            name="fecha"
            value={formEvento.fecha}
            onChange={handleChangeForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Hora"
            type="time"
            name="hora"
            value={formEvento.hora}
            onChange={handleChangeForm}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Detalle"
            name="detalle"
            value={formEvento.detalle}
            onChange={handleChangeForm}
            multiline
            rows={3}
          />
        </Box>
      </ModalCard>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setToast({ ...toast, open: false })}
          severity={toast.severity}
          sx={{ width: "100%" }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </Card>
  );
}
