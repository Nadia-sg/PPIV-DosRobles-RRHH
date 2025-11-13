// src/pages/empleados/HistorialFichajes.jsx

import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button, TextField } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import CustomTable from "../../components/ui/CustomTable";
import ModalCard from "../../components/ui/ModalCard";
import { getFichajesPorEmpleado, updateFichaje, deleteFichaje } from "../../services/fichajesService";

const HistorialFichajes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empleado, setEmpleado] = useState(null);

  // Modal
  const [openModal, setOpenModal] = useState(false);
  const [fichajeEdit, setFichajeEdit] = useState(null);

  const { empleadoId } = useParams();
  const location = useLocation();
  const isAdminView =
    new URLSearchParams(location.search).get("admin") === "true";

  // Si no hay ID en la URL, usamos el de Mariana (vista personal)
  const idFinal = empleadoId || "6912a5168034733944baedcb";

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
        console.log("Datos recibidos del backend:", data);

        const API_BASE =
          import.meta.env.VITE_API_URL || "http://localhost:4000";
        const empleadoResponse = await fetch(`${API_BASE}/empleados/${idFinal}`);
        const empleadoData = await empleadoResponse.json();

        console.log("👤 Datos del empleado:", empleadoData);
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

    const baseRow = {
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
    };

    if (isAdminView) {
      baseRow.acciones = (
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
      );
    }
    return baseRow;
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
      horaEntrada: e.target.horaEntrada.value.trim(),
      horaSalida: e.target.horaSalida.value.trim(),
      tipoFichaje: e.target.tipoFichaje.value.trim(),
    };

    // Validación mínima
    if (!updatedData.horaEntrada || !updatedData.horaSalida) {
      alert("⚠️ Debes completar las horas de entrada y salida.");
      return;
    }

    try {
      await updateFichaje(fichajeEdit._id, updatedData);
      setOpenModal(false);

      // Recargar datos actualizados
      const refreshed = await getFichajesPorEmpleado(idFinal);
      setRows(refreshed.map((f) => formatRow(f)));
    } catch (err) {
      console.error("❌ Error al actualizar fichaje:", err);
    }
  };

  // === Eliminar fichaje ===
  const handleDelete = async (id) => {
    if (confirm("¿Seguro que querés eliminar este fichaje?")) {
      try {
        await deleteFichaje(id);
        setRows((prev) => prev.filter((f) => f._id !== id));
      } catch (err) {
        console.error("❌ Error al eliminar fichaje:", err);
      }
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
      ) : error ? (
        <Typography sx={{ color: "error.main", mt: 2, textAlign: "center" }}>
          {error}
        </Typography>
      ) : (
        <CustomTable columns={columns} rows={rows} maxHeight="600px" />
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
    </Box>
  );
};

export default HistorialFichajes;
