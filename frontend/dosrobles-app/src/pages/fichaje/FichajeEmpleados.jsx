// src/pages/fichajes/FichajeEmpleados.jsx


import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Avatar,
  Stack,
  TextField,
  MenuItem,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { NextButton, PrimaryButton } from "../../components/ui/Buttons";
import CheckBoxInput from "../../components/ui/CheckBoxInput";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

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
  const fechaActual = new Date();
  const mesActual = meses[fechaActual.getMonth()];
  const anioActual = fechaActual.getFullYear();

  const [mes, setMes] = useState(mesActual);
  const [anio, setAnio] = useState(anioActual);
  const [search, setSearch] = useState("");
  const [fichajes, setFichajes] = useState([]);
  const [loading, setLoading] = useState(true);

  // empleados seleccionados
  const [selected, setSelected] = useState({});

  // empleados aprobados visualmente
  const [aprobados, setAprobados] = useState({});

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const navigate = useNavigate();

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

 
  async function aprobarFichajeService(payload) {
    const res = await fetch(`${API_URL}/fichajes/aprobaciones`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error("Error al aprobar fichaje");
    }

    return res.json();
  }

  // Obtener fichajes
 useEffect(() => {
  const fetchFichajes = async () => {
    setLoading(true);
    try {
      const mesNumero = meses.indexOf(mes) + 1;
      const res = await fetch(
        `${API_URL}/fichajes/empleados-mes?mes=${mesNumero}&anio=${anio}`
      );

      if (!res.ok) throw new Error("Error al obtener fichajes");
      const data = await res.json();

      setFichajes(data);

      if (data.length > 0) {
        console.log("🔎 Primer fichaje recibido:", data[0]);
      } else {
        console.log("🔎 No llegaron fichajes desde el backend.");
      }

    } catch (err) {
      console.error(err);
      setToast({
        open: true,
        message: "Error al cargar fichajes",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  fetchFichajes();
}, [mes, anio]);

  // Filtrar empleados
  const filtered = fichajes.filter((f) =>
    f.nombre.toLowerCase().includes(search.toLowerCase())
  );

  // Columnas
  const columns = [
    "Fichaje mensual",
    "Empleado",
    "Hs Previstas",
    "Hs Trabajadas",
    "Más Info",
  ];

  //  Filas
  const rows = filtered.map((f) => ({
    check: aprobados[f.idEmpleado] ? (
      <Typography sx={{ color: "primary.main", fontWeight: 600 }}>
        Aprobado
      </Typography>
    ) : (
      <CheckBoxInput
        checked={!!selected[f.idEmpleado]}
        onChange={(e) =>
          setSelected((prev) => ({
            ...prev,
            [f.idEmpleado]: e.target.checked,
          }))
        }
      />
    ),
    empleado: (
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Avatar src={f.fotoPerfil || ""} sx={{ width: 40, height: 40 }} />
        <Typography>{`${f.nombre} ${f.apellido}`}</Typography>
      </Box>
    ),
    hsPrevistas: f.hsPrevistas || 0,
    hsTrabajadas: f.hsTrabajadas || 0,
    masInfo: (
      <NextButton
        onClick={() =>
          navigate(`/fichaje/historial/${f.idEmpleado}?admin=true`)
        }
        endIcon={<ArrowForwardIcon />}
      />
    ),
  }));

  // =====================================================
  // APROBAR FICHAJES SELECCIONADOS
  // =====================================================
  const handleAprobar = async () => {
  try {
    const seleccionadosIds = Object.keys(selected).filter(
      (id) => selected[id] === true
    );

    if (seleccionadosIds.length === 0) {
      setToast({
        open: true,
        message: "No seleccionaste ningún empleado",
        severity: "warning",
      });
      return;
    }

    const mesNumero = meses.indexOf(mes) + 1;
    const mesFormateado = `${anio}-${String(mesNumero).padStart(2, "0")}`;

    for (const idEmpleado of seleccionadosIds) {
      const emp = fichajes.find((f) => f.idEmpleado === idEmpleado);
      if (!emp) continue;

      // Convertir hsPrevistas → número
      const hsPrevistasNum = parseInt(emp.hsPrevistas.replace("h", ""), 10);

      // Convertir hsTrabajadas "9h 0m" → horas decimales
      const [horasStr, minutosStr] = emp.hsTrabajadas.split(" ");
      const horasNum = parseInt(horasStr.replace("h", ""), 10);
      const minutosNum = parseInt(minutosStr.replace("m", ""), 10);
      const hsTrabajadasNum = horasNum + minutosNum / 60;

      const payload = {
        empleadoId: idEmpleado,
        mes: mesFormateado,
        horasTrabajadas: hsTrabajadasNum,
        horasExtras: Math.max(0, hsTrabajadasNum - hsPrevistasNum),
        horasDescuento: Math.max(0, hsPrevistasNum - hsTrabajadasNum),
      };

      await aprobarFichajeService(payload);
    }

    // Actualizar visual
    const nuevosAprobados = {};
    seleccionadosIds.forEach((id) => {
      nuevosAprobados[id] = true;
    });

    setAprobados((prev) => ({ ...prev, ...nuevosAprobados }));
    setSelected({});

    setToast({
      open: true,
      message: "Fichajes aprobados correctamente",
      severity: "success",
    });
  } catch (error) {
    console.error(error);
    setToast({
      open: true,
      message: "Error al aprobar fichajes",
      severity: "error",
    });
  }
};

  return (
    <Box sx={{ p: 4, overflow: "hidden" }}>
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
        <TextField select label="Mes" value={mes} onChange={(e) => setMes(e.target.value)}>
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

      {/* Botón Aprobar */}
      <Box sx={{ mt: 3 }}>
        <PrimaryButton fullWidth onClick={handleAprobar}>
          Aprobar los fichajes de los empleados
        </PrimaryButton>
      </Box>

      {/* Toast */}
      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast({ ...toast, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
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

export default FichajeEmpleados;
