// src/pages/empleados/HistorialFichajes.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useParams, useLocation } from "react-router-dom";
import CustomTable from "../../components/ui/CustomTable";
import { getFichajesPorEmpleado } from "../../services/fichajesService";
import { getEmpleadoPorId } from "../../services/empleadosService";

const HistorialFichajes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [empleado, setEmpleado] = useState(null);

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
        console.log("📦 Datos recibidos del backend:", data);

        // ✅ Traer nombre y apellido del empleado desde la API
        const API_BASE =
          import.meta.env.VITE_API_URL || "http://localhost:4000";
        const empleadoResponse = await fetch(
          `${API_BASE}/empleados/${idFinal}`
        );
        const empleadoData = await empleadoResponse.json();

        console.log("👤 Datos del empleado:", empleadoData);
        setEmpleado({
          nombre: empleadoData.nombre || "Empleado",
          apellido: empleadoData.apellido || "",
        });

        if (Array.isArray(data) && data.length > 0) {
          const formattedRows = data.map((fichaje) => {
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
              horaIngreso: fichaje.horaEntrada
                ? `${fichaje.horaEntrada} hs`
                : "-",
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
                    onClick={() => console.log("Editar", fichaje._id)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="small"
                    onClick={() => console.log("Eliminar", fichaje._id)}
                  >
                    Eliminar
                  </Button>
                </Box>
              );
            }

            return baseRow;
          });

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
                empleado && empleado.data
                  ? `${empleado.data.nombre} ${empleado.data.apellido}`
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
    </Box>
  );
};

export default HistorialFichajes;
