// src/pages/fichaje/FichajeEmpleados.jsx
import React, { useState } from "react";
import { Box, Typography, Avatar, Stack, TextField, MenuItem } from "@mui/material";
import { NextButton, PrimaryButton } from "../../components/ui/Buttons";
import CheckboxInput from "../../components/ui/CheckboxInput";
import CustomTable from "../../components/ui/CustomTable";
import Empleado2 from "../../assets/empleados/empleado2.png";
import Empleado1 from "../../assets/empleados/empleado1.png";
import SearchBar from "../../components/ui/SearchBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const meses = [
  "Enero","Febrero","Marzo","Abril","Mayo","Junio",
  "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"
];

const FichajeEmpleados = () => {
  const [mes, setMes] = useState("Agosto");
  const [anio, setAnio] = useState(2025);
  const [search, setSearch] = useState("");

  const empleados = [
    { id: 1, nombre: "Juan Pérez", foto: Empleado2, hsPrevistas: "192h", hsTrabajadas: "196h 2m" },
    { id: 2, nombre: "Mariana Gómez", foto: Empleado1, hsPrevistas: "160h", hsTrabajadas: "158h 30m" },
  ];

  const filtered = empleados.filter(emp => 
    emp.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const columns = ["", "Empleado", "Hs Previstas", "Hs Trabajadas", "Más Info"];
  const rows = filtered.map(emp => ({
    check: <CheckboxInput />,
    empleado: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={emp.foto} sx={{ width: 40, height: 40 }} />
        <Typography>{emp.nombre}</Typography>
      </Box>
    ),
    hsPrevistas: emp.hsPrevistas,
    hsTrabajadas: emp.hsTrabajadas,
    masInfo: <NextButton onClick={() => console.log("Ver detalle", emp.id)} endIcon={<ArrowForwardIcon />} />
  }));

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
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
            <MenuItem key={m} value={m}>{m}</MenuItem>
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
      <CustomTable
        columns={columns}
        rows={rows}
      />

      {/* Botón Aprobar */}
      <Box sx={{ mt: 3 }}>
        <PrimaryButton fullWidth onClick={() => console.log("Aprobar fichajes")}>
          Aprobar los fichajes de los empleados
        </PrimaryButton>
      </Box>
    </Box>
  );
};

export default FichajeEmpleados;
