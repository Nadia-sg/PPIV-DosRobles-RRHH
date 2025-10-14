// src/pages/nomina/CalculoHaberes.jsx
// Pantalla para que el administrativo calcule los haberes de los empleados

import { useState } from "react";
import { Box, Typography, Chip, MenuItem, Select, FormControl } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import CalculateIcon from "@mui/icons-material/Calculate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ModalCalculoDetalle from "../../components/nomina/ModalCalculoDetalle";

export default function CalculoHaberes() {
  const [busqueda, setBusqueda] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("2025-10");
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);

  // Lista de períodos disponibles
  const periodos = [
    { value: "2025-10", label: "Octubre 2025" },
    { value: "2025-09", label: "Septiembre 2025" },
    { value: "2025-08", label: "Agosto 2025" },
    { value: "2025-07", label: "Julio 2025" },
  ];

  // Datos de ejemplo de empleados para cálculo
  const [empleados, setEmpleados] = useState([
    {
      id: 1,
      legajo: "026",
      nombre: "Juan Pérez",
      cargo: "Desarrollador Senior",
      estado: "pendiente",
      horasTrabajadas: 176,
      horasExtras: 8,
      diasAusencia: 0,
      diasTrabajados: 22,
      sueldoBasico: 800000,
      calculoDetalle: {
        antiguedad: 200000,
        presentismo: 100000,
        horasExtras: 50000,
        viaticos: 100000,
        jubilacion: 120000,
        obraSocial: 80000,
        ley19032: 50000,
        sindicato: 100000,
      },
    },
    {
      id: 2,
      legajo: "015",
      nombre: "María González",
      cargo: "Diseñadora UX/UI",
      estado: "calculado",
      horasTrabajadas: 176,
      horasExtras: 4,
      diasAusencia: 0,
      diasTrabajados: 22,
      sueldoBasico: 750000,
      calculoDetalle: {
        antiguedad: 150000,
        presentismo: 80000,
        horasExtras: 25000,
        viaticos: 80000,
        jubilacion: 110000,
        obraSocial: 75000,
        ley19032: 45000,
        sindicato: 90000,
      },
    },
    {
      id: 3,
      legajo: "042",
      nombre: "Carlos Rodríguez",
      cargo: "QA Tester",
      estado: "aprobado",
      horasTrabajadas: 168,
      horasExtras: 0,
      diasAusencia: 1,
      diasTrabajados: 21,
      sueldoBasico: 650000,
      calculoDetalle: {
        antiguedad: 120000,
        presentismo: 0,
        horasExtras: 0,
        viaticos: 70000,
        jubilacion: 95000,
        obraSocial: 65000,
        ley19032: 40000,
        sindicato: 75000,
      },
    },
    {
      id: 4,
      legajo: "018",
      nombre: "Ana Martínez",
      cargo: "Project Manager",
      estado: "pendiente",
      horasTrabajadas: 176,
      horasExtras: 12,
      diasAusencia: 0,
      diasTrabajados: 22,
      sueldoBasico: 900000,
      calculoDetalle: {
        antiguedad: 250000,
        presentismo: 120000,
        horasExtras: 75000,
        viaticos: 120000,
        jubilacion: 140000,
        obraSocial: 90000,
        ley19032: 55000,
        sindicato: 110000,
      },
    },
    {
      id: 5,
      legajo: "033",
      nombre: "Luis Torres",
      cargo: "Backend Developer",
      estado: "calculado",
      horasTrabajadas: 176,
      horasExtras: 6,
      diasAusencia: 0,
      diasTrabajados: 22,
      sueldoBasico: 820000,
      calculoDetalle: {
        antiguedad: 180000,
        presentismo: 90000,
        horasExtras: 40000,
        viaticos: 100000,
        jubilacion: 125000,
        obraSocial: 82000,
        ley19032: 52000,
        sindicato: 105000,
      },
    },
  ]);

  // Calcular totales para un empleado
  const calcularTotales = (emp) => {
    const haberes =
      emp.sueldoBasico +
      emp.calculoDetalle.antiguedad +
      emp.calculoDetalle.presentismo +
      emp.calculoDetalle.horasExtras +
      emp.calculoDetalle.viaticos;

    const deducciones =
      emp.calculoDetalle.jubilacion +
      emp.calculoDetalle.obraSocial +
      emp.calculoDetalle.ley19032 +
      emp.calculoDetalle.sindicato;

    const neto = haberes - deducciones;

    return { haberes, deducciones, neto };
  };

  // Filtrar empleados según búsqueda
  const empleadosFiltrados = empleados.filter((emp) => {
    const searchLower = busqueda.toLowerCase();
    return (
      emp.nombre.toLowerCase().includes(searchLower) ||
      emp.legajo.includes(searchLower) ||
      emp.cargo.toLowerCase().includes(searchLower)
    );
  });

  // Manejar cálculo individual
  const handleCalcular = (empleado) => {
    setEmpleados(
      empleados.map((emp) =>
        emp.id === empleado.id ? { ...emp, estado: "calculado" } : emp
      )
    );
    alert(`Cálculo realizado para ${empleado.nombre}`);
  };

  // Manejar cálculo masivo
  const handleCalcularTodos = () => {
    const pendientes = empleados.filter((emp) => emp.estado === "pendiente");
    if (pendientes.length === 0) {
      alert("No hay empleados pendientes de cálculo");
      return;
    }

    setEmpleados(
      empleados.map((emp) =>
        emp.estado === "pendiente" ? { ...emp, estado: "calculado" } : emp
      )
    );
    alert(`Se calcularon ${pendientes.length} empleados`);
  };

  // Manejar aprobación
  const handleAprobar = (empleado) => {
    setEmpleados(
      empleados.map((emp) =>
        emp.id === empleado.id ? { ...emp, estado: "aprobado" } : emp
      )
    );
    alert(`Liquidación aprobada para ${empleado.nombre}`);
  };

  // Ver detalle del cálculo
  const handleVerDetalle = (empleado) => {
    setEmpleadoSeleccionado(empleado);
    setModalDetalleOpen(true);
  };

  // Obtener color según estado
  const getEstadoChip = (estado) => {
    const configs = {
      pendiente: { label: "PENDIENTE", bg: "#FFF3E0", color: "#FFA726" },
      calculado: { label: "CALCULADO", bg: "#E3F2FD", color: "#2196F3" },
      aprobado: { label: "APROBADO", bg: "#E8F5E9", color: "#4CAF50" },
    };
    const config = configs[estado] || configs.pendiente;
    return (
      <Chip
        label={config.label}
        sx={{
          backgroundColor: config.bg,
          color: config.color,
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      />
    );
  };

  // Formatear moneda
  const formatMonto = (num) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(num);
  };

  // Preparar datos para la tabla
  const columnas = ["Legajo", "Empleado", "Cargo", "Estado", "Días Trab.", "Ausencias", "Neto Estimado", "Acciones"];

  const filas = empleadosFiltrados.map((emp) => {
    const totales = calcularTotales(emp);
    return {
      legajo: emp.legajo,
      nombre: emp.nombre,
      cargo: emp.cargo,
      estado: getEstadoChip(emp.estado),
      diasTrabajados: emp.diasTrabajados,
      diasAusencia: emp.diasAusencia,
      netoEstimado: formatMonto(totales.neto),
      acciones: (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
          <SecondaryButton
            startIcon={<VisibilityIcon />}
            onClick={() => handleVerDetalle(emp)}
            sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5, minWidth: 80 }}
          >
            Ver
          </SecondaryButton>
          {emp.estado === "pendiente" && (
            <PrimaryButton
              startIcon={<CalculateIcon />}
              onClick={() => handleCalcular(emp)}
              sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5, minWidth: 100 }}
            >
              Calcular
            </PrimaryButton>
          )}
          {emp.estado === "calculado" && (
            <PrimaryButton
              startIcon={<CheckCircleIcon />}
              onClick={() => handleAprobar(emp)}
              sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5, minWidth: 100, bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" } }}
            >
              Aprobar
            </PrimaryButton>
          )}
        </Box>
      ),
    };
  });

  // Estadísticas
  const stats = {
    total: empleados.length,
    pendientes: empleados.filter((e) => e.estado === "pendiente").length,
    calculados: empleados.filter((e) => e.estado === "calculado").length,
    aprobados: empleados.filter((e) => e.estado === "aprobado").length,
  };

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
          Cálculo de Haberes
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Calculá automáticamente los haberes según horas trabajadas, ausencias y reglas establecidas
        </Typography>
      </Box>

      {/* Filtros y Acciones */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", alignItems: "center" }}>
        {/* Selector de Período */}
        <FormControl sx={{ minWidth: 200 }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#808080", mb: 0.5 }}>
            Período
          </Typography>
          <Select
            value={periodoSeleccionado}
            onChange={(e) => setPeriodoSeleccionado(e.target.value)}
            size="small"
            sx={{
              backgroundColor: "#FFFFFF",
              borderRadius: 2,
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#7FC6BA",
              },
            }}
          >
            {periodos.map((per) => (
              <MenuItem key={per.value} value={per.value}>
                {per.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Buscador */}
        <Box sx={{ flex: 1, minWidth: 300, maxWidth: 400 }}>
          <SearchBar
            placeholder="Buscar empleado..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </Box>

        {/* Botón Calcular Todos */}
        <PrimaryButton
          startIcon={<CalculateIcon />}
          onClick={handleCalcularTodos}
          sx={{ px: 3, py: 1 }}
        >
          Calcular Todos ({stats.pendientes})
        </PrimaryButton>
      </Box>

      {/* Estadísticas */}
      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Box sx={{ flex: 1, p: 2, backgroundColor: "#FFF3E0", borderRadius: 2, border: "1px solid #FFE0B2" }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Pendientes</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#FFA726" }}>
            {stats.pendientes}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: "#E3F2FD", borderRadius: 2, border: "1px solid #BBDEFB" }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Calculados</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#2196F3" }}>
            {stats.calculados}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: "#E8F5E9", borderRadius: 2, border: "1px solid #C8E6C9" }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Aprobados</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#4CAF50" }}>
            {stats.aprobados}
          </Typography>
        </Box>
        <Box sx={{ flex: 1, p: 2, backgroundColor: "#F5F5F5", borderRadius: 2, border: "1px solid #E0E0E0" }}>
          <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Total Empleados</Typography>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#585858" }}>
            {stats.total}
          </Typography>
        </Box>
      </Box>

      {/* Tabla de Empleados */}
      <CustomTable
        columns={columnas}
        rows={filas}
        headerColor="#7FC6BA"
        headerTextColor="#FFFFFF"
      />

      {/* Modal de Detalle de Cálculo */}
      <ModalCalculoDetalle
        open={modalDetalleOpen}
        onClose={() => setModalDetalleOpen(false)}
        empleado={empleadoSeleccionado}
        onCalcular={handleCalcular}
        onAprobar={handleAprobar}
      />
    </Box>
  );
}
