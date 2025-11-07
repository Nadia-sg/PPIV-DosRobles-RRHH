// src/pages/empleados/HistorialFichajes.jsx
import React, { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import CustomTable from "../../components/ui/CustomTable";
import { getFichajesPorEmpleado } from "../../services/fichajesService";

const HistorialFichajes = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ID del empleado logueado
  const empleadoId = "690a9f5cd37450b870dc39fe";

  const columns = ["Fecha", "Hora Ingreso", "Hora Salida", "Hs Trabajadas", "Hs Estimadas"];

  useEffect(() => {
    const cargarFichajes = async () => {
      try {
        const data = await getFichajesPorEmpleado(empleadoId);

        if (Array.isArray(data) && data.length > 0) {
          const formattedRows = data.map((fichaje) => {
            const fechaObj = new Date(fichaje.fecha);
            const opcionesDia = { weekday: "short" };
            const opcionesMes = { day: "2-digit", month: "short" };

            return {
              fecha: (
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
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
              hsEstimadas: "08:00 hs", //  ajustar con el dato en backend
            };
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

    cargarFichajes();
  }, [empleadoId]);

  return (
    <Box sx={{ p: 4 }}>
      {/* === Encabezado === */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
          Mis Fichajes
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Visualizá tu historial de fichajes recientes y compará las horas trabajadas con las estimadas.
        </Typography>
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
        <CustomTable columns={columns} rows={rows} />
      )}
    </Box>
  );
};

export default HistorialFichajes;
