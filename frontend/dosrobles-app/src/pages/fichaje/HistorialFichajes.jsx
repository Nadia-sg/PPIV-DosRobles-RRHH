// src/pages/empleados/HistorialFichajes.jsx
// src/pages/empleados/HistorialFichajes.jsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import CustomTable from "../../components/ui/CustomTable";
import ModalCard from "../../components/ui/ModalCard";
import { PrimaryButton } from "../../components/ui/Buttons";
import {
  getFichajesPorEmpleado,
  updateFichaje,
  deleteFichaje,
  crearFichaje,
} from "../../services/fichajesService";

const HistorialFichajes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empleado, setEmpleado] = useState(null);
  const [openCreateModal, setOpenCreateModal] = useState(false);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [fichajeEdit, setFichajeEdit] = useState(null);

  const { empleadoId } = useParams();
  const location = useLocation();
  const isAdminView =
    new URLSearchParams(location.search).get("admin") === "true";

  const idFinal = empleadoId || "6912a5168034733944baedcb";

  // ===== Toast
  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const columns = [
    "Fecha",
    "Hora Ingreso",
    "Hora Salida",
    "Hs Trabajadas",
    "Hs Estimadas",
    ...(isAdminView ? ["Acciones"] : []),
  ];

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const data = await getFichajesPorEmpleado(idFinal);

        const API_BASE =
          import.meta.env.VITE_API_URL || "http://localhost:4000";
        const empleadoResponse = await fetch(
          `${API_BASE}/empleados/${idFinal}`
        );
        const empleadoData = await empleadoResponse.json();

        setEmpleado({
          nombre: empleadoData.nombre || "Empleado",
          apellido: empleadoData.apellido || "",
        });

        if (Array.isArray(data) && data.length > 0) {
          const formattedRows = data.map((fichaje) => formatRow(fichaje));
          setRows(formattedRows);
        } else {
          setError("No hay fichajes registrados para este empleado");
        }
      } catch (err) {
        console.error(err);
        setError("Error al cargar los fichajes");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [idFinal, isAdminView]);

  // === Formateador de filas ===
  const formatRow = (fichaje) => {
    const fechaObj = new Date(fichaje.fecha);
    const opcionesDia = { weekday: "short" };
    const opcionesMes = { day: "2-digit", month: "short" };

    return {
      fecha: (
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>
            {fechaObj.toLocaleDateString("es-AR", opcionesMes)}
          </Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>
            {fechaObj.toLocaleDateString("es-AR", opcionesDia)}
          </Typography>
        </Box>
      ),
      horaIngreso: fichaje.horaEntrada ? `${fichaje.horaEntrada} hs` : "-",
      horaSalida: fichaje.horaSalida ? `${fichaje.horaSalida} hs` : "-",
      hsTrabajadas: fichaje.totalTrabajado || "-",
      hsEstimadas: "08:00 hs",
      ...(isAdminView && {
        acciones: (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => handleEdit(fichaje)}
            >
              Editar
            </Button>
            <Button
              variant="outlined"
              color="error"
              size="small"
              onClick={() => handleDelete(fichaje._id)}
            >
              Eliminar
            </Button>
          </Box>
        ),
      }),
    };
  };

  // === Abrir modal de edición ===
  const handleEdit = (fichaje) => {
    setFichajeEdit(fichaje);
    setOpenModal(true);
  };

  // === Guardar cambios del modal ===
  const handleSave = async (e) => {
    e.preventDefault();

    const updatedData = {
      fecha: new Date(e.target.fecha?.value + "T00:00:00").toISOString(),
      horaEntrada: e.target.horaEntrada.value.trim(),
      horaSalida: e.target.horaSalida.value.trim(),
      tipoFichaje: e.target.tipoFichaje.value.trim(),
    };

    if (!updatedData.horaEntrada || !updatedData.horaSalida) {
      setToast({
        open: true,
        message: "Debes completar las horas de entrada y salida.",
        severity: "warning",
      });
      return;
    }

    try {
      await updateFichaje(fichajeEdit._id, updatedData);
      setOpenModal(false);

      const refreshed = await getFichajesPorEmpleado(idFinal);
      setRows(refreshed.map((f) => formatRow(f)));
      setToast({
        open: true,
        message: "Fichaje actualizado con éxito",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error al actualizar fichaje:", err);
      setToast({
        open: true,
        message: "Error al actualizar el fichaje",
        severity: "error",
      });
    }
  };

  // === Eliminar fichaje ===
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que querés eliminar este fichaje?")) {
      try {
        await deleteFichaje(id);
        setRows((prev) => prev.filter((f) => f._id !== id));
        setToast({
          open: true,
          message: "✅ Fichaje eliminado correctamente",
          severity: "success",
        });
      } catch (err) {
        console.error(err);
        setToast({
          open: true,
          message:
            "❌ Error al eliminar el fichaje. Ver consola para más detalles.",
          severity: "error",
        });
      }
    }
  };

  //=====Crear fichaje manual=====
  const handleCreate = async (e) => {
    e.preventDefault();

    const tipoFichaje = e.target.tipoFichaje.value.trim().toLowerCase();
    const horaEntrada = e.target.horaEntrada.value.trim();
    const horaSalida = e.target.horaSalida.value.trim();
    let fechaInput = e.target.fecha?.value; // formato YYYY-MM-DD

    if (!horaEntrada || !horaSalida) {
      alert("⚠️ Debes completar las horas de entrada y salida.");
      return;
    }

    // Ajuste de fecha para que no reste un día
    const fecha = fechaInput ? new Date(fechaInput + "T00:00:00") : new Date();
    const fechaISO = fecha.toISOString(); // enviamos ISO al backend

    // Definir ubicación según tipo
    const ubicacion =
      tipoFichaje === "oficina"
        ? { lat: -34.61, lon: -58.38 }
        : { lat: undefined, lon: undefined };

    const nuevoFichaje = {
      empleadoId: idFinal,
      fecha: fechaISO,
      horaEntrada,
      horaSalida,
      tipoFichaje,
      ubicacion,
      ubicacionSalida: { lat: null, lon: null },
      pausas: [],
    };

    try {
      await crearFichaje(nuevoFichaje);
      setOpenCreateModal(false);

      const refreshed = await getFichajesPorEmpleado(idFinal);
      setRows(refreshed.map((f) => formatRow(f)));
      setError(null);
      setToast({
        open: true,
        message: "Fichaje creado con éxito",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Error al crear fichaje:", err);
      setToast({
        open: true,
        message: "Error al crear el fichaje",
        severity: "error",
      });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* === Encabezado === */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "#585858", mb: 1 }}
        >
          {isAdminView
            ? `Historial de ${
                empleado
                  ? `${empleado.nombre} ${empleado.apellido}`
                  : "Empleado"
              }`
            : "Mis Fichajes"}
        </Typography>
        {isAdminView ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#808080",
            }}
          >
            <Typography variant="body2">
              Podés revisar y editar los fichajes del personal.
            </Typography>
            {empleado && (
              <Typography
                variant="body2"
                sx={{ fontStyle: "italic", fontWeight: 500 }}
              >
                Empleado: {empleado.nombre} {empleado.apellido}
              </Typography>
            )}
          </Box>
        ) : (
          <Typography variant="body2" sx={{ color: "#808080" }}>
            Visualizá tu historial de fichajes recientes y compará las horas
            trabajadas con las estimadas.
          </Typography>
        )}
      </Box>

      {/* === Contenido Dinámico === */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : rows.length > 0 ? (
        <CustomTable columns={columns} rows={rows} maxHeight="600px" />
      ) : (
        <Typography sx={{ color: "error.main", mt: 2, textAlign: "center" }}>
          {error || "No hay fichajes registrados para este empleado."}
        </Typography>
      )}

      {/* === Modal de edición === */}
      {openModal && (
        <ModalCard
          open={openModal}
          onClose={() => setOpenModal(false)}
          title="Editar Fichaje"
        >
          <form onSubmit={handleSave}>
            <TextField
              name="fecha"
              label="Fecha"
              type="date"
              defaultValue={
                fichajeEdit.fecha
                  ? new Date(fichajeEdit.fecha).toISOString().split("T")[0]
                  : new Date().toISOString().split("T")[0]
              }
              fullWidth
              margin="normal"
            />
            <TextField
              name="horaEntrada"
              label="Hora de entrada"
              defaultValue={fichajeEdit.horaEntrada}
              fullWidth
              margin="normal"
            />
            <TextField
              name="horaSalida"
              label="Hora de salida"
              defaultValue={fichajeEdit.horaSalida}
              fullWidth
              margin="normal"
            />
            <TextField
              name="tipoFichaje"
              label="Tipo de fichaje"
              defaultValue={fichajeEdit.tipoFichaje}
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpenModal(false)} sx={{ mr: 2 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </Box>
          </form>
        </ModalCard>
      )}

      {/* === Modal de creación === */}
      {openCreateModal && (
        <ModalCard
          open={openCreateModal}
          onClose={() => setOpenCreateModal(false)}
          title="Nuevo Fichaje"
        >
          <form onSubmit={handleCreate}>
            <TextField
              name="fecha"
              label="Fecha"
              type="date"
              defaultValue={new Date().toISOString().split("T")[0]}
              fullWidth
              margin="normal"
            />
            <TextField
              name="horaEntrada"
              label="Hora de entrada"
              fullWidth
              margin="normal"
            />
            <TextField
              name="horaSalida"
              label="Hora de salida"
              fullWidth
              margin="normal"
            />
            <TextField
              name="tipoFichaje"
              label="Tipo de fichaje (oficina / remoto)"
              defaultValue="oficina"
              fullWidth
              margin="normal"
            />
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button onClick={() => setOpenCreateModal(false)} sx={{ mr: 2 }}>
                Cancelar
              </Button>
              <Button type="submit" variant="contained">
                Guardar
              </Button>
            </Box>
          </form>
        </ModalCard>
      )}

      {/* === Botón Agregar Fichaje === */}
      <Box sx={{ mt: 3 }}>
        <PrimaryButton fullWidth onClick={() => setOpenCreateModal(true)}>
          Agregar fichaje
        </PrimaryButton>
      </Box>

      {/* === Snackbar Toast === */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }} // <- aquí
        sx={{
          position: "absolute",
          top: 50,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 2000,
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
  );
};

export default HistorialFichajes;
