import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { NextButton, PrimaryButton } from "../../components/ui/Buttons";
import CheckBoxInput from "../../components/ui/CheckBoxInput";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const FichajeEmpleados = () => {
  // 📅 Fecha actual
  const fechaActual = new Date();
  const mesActual = meses[fechaActual.getMonth()]; // Ej: "Noviembre"
  const anioActual = fechaActual.getFullYear();    // Ej: 2025

  // 🧩 Estados
  const [mes, setMes] = useState(mesActual);
  const [anio, setAnio] = useState(anioActual);
  const [search, setSearch] = useState("");
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔁 Obtener fichajes
  useEffect(() => {
    const fetchFichajes = async () => {
      setLoading(true);
      try {
        const mesNumero = meses.indexOf(mes) + 1; // Enero=1, Febrero=2...
        const response = await fetch(
          `http://localhost:4000/fichajes/empleados-mes?mes=${mesNumero}&anio=${anio}`
        );
        if (!response.ok) throw new Error("Error al obtener fichajes");
        const data = await response.json();
        setFichajes(data);
      } catch (error) {
        console.error("Error al obtener fichajes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFichajes();
  }, [mes, anio]);

  // 🔍 Filtro de búsqueda
  const filtered = fichajes.filter((f) =>
    f.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // 🧱 Columnas de la tabla
  const columns = ["", "Empleado", "Hs Previstas", "Hs Trabajadas", "Más Info"];

  // 🧾 Filas
  const rows = filtered.map((f) => ({
    check: <CheckBoxInput />,
    empleado: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={f.fotoPerfil || ""} sx={{ width: 40, height: 40 }} />
        <Typography>{`${f.nombre} ${f.apellido}`}</Typography>
      </Box>
    ),
    hsPrevistas: f.hsPrevistas || "—",
    hsTrabajadas: f.hsTrabajadas || "—",
    masInfo: (
      <NextButton
        onClick={() => console.log("Ver detalle", f.idEmpleado)}
        endIcon={<ArrowForwardIcon />}
      />
    ),
  }));

  // 🖥 Render
  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "#585858", mb: 1 }}
        >
          Fichaje de Empleados
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Visualizá las horas trabajadas por mes y empleado
        </Typography>
      </Box>

      {/* Controles */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
        <TextField
          select
          label="Mes"
          value={mes}
          onChange={(e) => setMes(e.target.value)}
        >
          {meses.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          type="number"
          label="Año"
          value={anio}
          onChange={(e) => setAnio(e.target.value)}
        />

        <SearchBar value={search} onChange={(e) => setSearch(e.target.value)} />
      </Stack>

      {/* Tabla */}
   
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
            <CircularProgress />
          </Box>
        ) : (
          <CustomTable columns={columns} rows={rows} />
        )}


      {/* Botón */}
      <Box sx={{ mt: 3 }}>
        <PrimaryButton
          fullWidth
          onClick={() => console.log("Aprobar fichajes")}
        >
          Aprobar los fichajes de los empleados
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default FichajeEmpleados;
