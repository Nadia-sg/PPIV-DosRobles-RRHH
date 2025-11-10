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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import {
  PrimaryButton,
  SecondaryButton,
  IconNextButton,
} from "../components/ui/Buttons";
import { useNavigate } from "react-router-dom";
import ModalDialog from "../components/ui/ModalDialog";
import ModalCard from "../components/ui/ModalCard";
import TextField from "@mui/material/TextField";

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

  const [fichajeActivo, setFichajeActivo] = useState(null); // guardará el fichaje devuelto por el backend

  const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const totalSeconds = 8 * 3600;
  const progress = Math.min((seconds / totalSeconds) * 100, 100);
  const navigate = useNavigate();

  // id del empleado (temporal: reemplazar por el id real desde el contexto/login)
  const empleadoId = "690a9f5cd37450b870dc39fe";

  function formatHHMM(date = new Date()) {
    const hh = String(date.getHours()).padStart(2, "0");
    const mm = String(date.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }

  // Usa comparación simple en grados con umbral pequeño (~0.001 => aprox 100m)
  function determinarTipoFichaje(lat, lon) {
    const oficinaLat = -34.6259206;
    const oficinaLon = -58.4549131;
    const distancia = Math.sqrt(
      (lat - oficinaLat) ** 2 + (lon - oficinaLon) ** 2
    );
    return distancia < 0.001 ? "oficina" : "remoto";
  }

  async function iniciarJornadaConGeo() {
    if (!navigator.geolocation) {
      setToast({
        open: true,
        message: "GPS no disponible en este dispositivo",
        severity: "warning",
      });
      return;
    }

    // pedimos ubicación actual
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const tipoFichaje = determinarTipoFichaje(lat, lon);
        const horaEntrada = formatHHMM();

        try {
          const res = await fetch(`${API_BASE}/fichajes/inicio`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              empleadoId,
              horaEntrada,
              ubicacion: { lat, lon },
              tipoFichaje,
            }),
          });

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data?.message || "Error al iniciar fichaje");
          }

          // guardamos el fichaje activo (para usar fichaje._id al cerrar)
          setFichajeActivo(data.data); // asume que backend responde { data: nuevoFichaje }
          setEstadoFichaje("activo");
          setToast({
            open: true,
            message: "Jornada iniciada con éxito",
            severity: "info",
          });
          setSeconds(0);
        } catch (err) {
          console.error(err);
          setToast({
            open: true,
            message: err.message || "Error al iniciar jornada",
            severity: "error",
          });
        }
      },
      (err) => {
        console.error("Geo error:", err);
        setToast({
          open: true,
          message: "No se pudo obtener la ubicación (permiso denegado?)",
          severity: "warning",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  async function registrarSalidaConGeo() {
    if (!fichajeActivo || !fichajeActivo._id) {
      setToast({
        open: true,
        message: "No hay fichaje activo para cerrar",
        severity: "warning",
      });
      return;
    }

    if (!navigator.geolocation) {
      setToast({
        open: true,
        message: "GPS no disponible",
        severity: "warning",
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const horaSalida = formatHHMM();

        try {
          const res = await fetch(`${API_BASE}/fichajes/salida`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              fichajeId: fichajeActivo._id,
              horaSalida,
              ubicacionSalida: { lat, lon },
            }),
          });

          const data = await res.json();
          if (!res.ok)
            throw new Error(data?.message || "Error al registrar salida");

          setFichajeActivo(null);
          setEstadoFichaje("inactivo");
          setToast({
            open: true,
            message: "Jornada finalizada correctamente",
            severity: "success",
          });
          setSeconds(0);
        } catch (err) {
          console.error(err);
          setToast({
            open: true,
            message: err.message || "Error al registrar salida",
            severity: "error",
          });
        }
      },
      (err) => {
        console.error("Geo error:", err);
        setToast({
          open: true,
          message: "No se pudo obtener la ubicación al salir",
          severity: "warning",
        });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }

  const [estadoEquipo, setEstadoEquipo] = useState({
    fichados: 0,
    ausentes: 0,
  });

  useEffect(() => {
    async function fetchEstado() {
      try {
        const res = await fetch(`${API_BASE}/fichajes/estado`);
        const data = await res.json();
        if (res.ok) setEstadoEquipo(data);
      } catch (error) {
        console.error("Error al obtener estado del equipo:", error);
      }
    }
    fetchEstado();
  }, []);

  // estado de eventos y modal
  const [eventos, setEventos] = useState([]);
  const [openModalEvento, setOpenModalEvento] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [formEvento, setFormEvento] = useState({
    fecha: "",
    hora: "",
    detalle: "",
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
  }, []);

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
    setFormEvento(eventos[index]);
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
                    iniciarJornadaConGeo();
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
                    registrarSalidaConGeo();
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
              {
                color: "#FFD0D0",
                title: "Ausentes",
                count: estadoEquipo.ausentes,
              },
              {
                color: "#8EC6BA",
                title: "Fichados",
                count: estadoEquipo.fichados,
              },
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
      {/* ===========================
            CUADRANTE 3 BANDEJA DE ENTRADA
            ============================== */}
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

        {/* ===========================
            CUADRANTE 4 EVENTOS
            ============================== */}

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
              onClick={() => setOpenModalEvento(true)}
            >
              Añadir evento
            </SecondaryButton>
          </Box>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
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
                  <Box
                    sx={{ display: "flex", justifyContent: "center", gap: 1 }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => handleEditarEvento(i)}
                    >
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
        </Card>
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
      </Box>
    </Box>
  );
}
