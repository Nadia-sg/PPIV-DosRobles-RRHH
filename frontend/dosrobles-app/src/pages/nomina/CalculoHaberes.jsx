// src/pages/nomina/CalculoHaberes.jsx
// Pantalla para que el administrativo calcule los haberes de los empleados

import { useState, useEffect } from "react";
import { Box, Typography, Chip, MenuItem, Select, FormControl, CircularProgress, Alert } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import CalculateIcon from "@mui/icons-material/Calculate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ModalCalculoDetalle from "../../components/nomina/ModalCalculoDetalle";
import { nominaService } from "../../services/nominaService";
import { empleadosService } from "../../services/empleadosService";

export default function CalculoHaberes() {
  // Estados
  const [busqueda, setBusqueda] = useState("");
  const [periodoSeleccionado, setPeriodoSeleccionado] = useState("2025-10");
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [empleadoSeleccionado, setEmpleadoSeleccionado] = useState(null);
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Lista de períodos disponibles
  const periodos = [
    { value: "2025-10", label: "Octubre 2025" },
    { value: "2025-09", label: "Septiembre 2025" },
    { value: "2025-08", label: "Agosto 2025" },
    { value: "2025-07", label: "Julio 2025" },
  ];

  // Cargar datos al montar o cambiar período
  useEffect(() => {
    cargarDatos();
  }, [periodoSeleccionado]);

  // Función para cargar empleados y sus nóminas
  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError(null);

      // Obtener empleados activos
      const respuestaEmpleados = await empleadosService.obtenerEmpleadosActivos();
      const empleadosActivos = respuestaEmpleados.data || [];

      // Obtener nóminas del período seleccionado
      const respuestaNominas = await nominaService.obtenerNominas({
        periodo: periodoSeleccionado,
      });
      const nominas = respuestaNominas.data || [];

      // Combinar información de empleados con sus nóminas
      const empleadosConNomina = empleadosActivos.map((emp) => {
        // Buscar nómina - considerar que empleadoId puede ser un objeto (populate)
        const nomina = nominas.find((n) => {
          const nominaEmpleadoId = typeof n.empleadoId === 'object'
            ? n.empleadoId._id.toString()
            : n.empleadoId.toString();
          return nominaEmpleadoId === emp._id.toString();
        });

        if (nomina) {
          // Si existe nómina, usar esos datos
          const totalHaberes = nomina.haberes?.totalHaberes || 0;
          const totalDeducciones = nomina.deducciones?.totalDeducciones || 0;

          return {
            id: emp._id,
            legajo: emp.legajo,
            nombre: `${emp.nombre} ${emp.apellido}`,
            cargo: emp.puesto,
            estado: nomina.estado,
            horasTrabajadas: nomina.horasTrabajadas || 0,
            horasExtras: nomina.horasExtras || 0,
            diasAusencia: nomina.diasAusencia || 0,
            diasTrabajados: nomina.diasTrabajados || 0,
            sueldoBasico: nomina.sueldoBasico || emp.sueldoBasico,
            totalHaberes: totalHaberes,
            totalDeducciones: totalDeducciones,
            totalNeto: nomina.totalNeto || 0,
            nominaId: nomina._id,
            nomina: nomina, // Guardar referencia completa
          };
        } else {
          // Si no existe nómina, mostrar empleado como pendiente
          return {
            id: emp._id,
            legajo: emp.legajo,
            nombre: `${emp.nombre} ${emp.apellido}`,
            cargo: emp.puesto,
            estado: "pendiente",
            horasTrabajadas: 0,
            horasExtras: 0,
            diasAusencia: 0,
            diasTrabajados: 0,
            sueldoBasico: emp.sueldoBasico,
            totalHaberes: 0,
            totalDeducciones: 0,
            totalNeto: 0,
            nominaId: null,
            nomina: null,
          };
        }
      });

      setEmpleados(empleadosConNomina);
    } catch (err) {
      console.error("Error al cargar datos:", err);
      setError("No se pudieron cargar los datos. Por favor, intenta de nuevo.");
      setEmpleados([]);
    } finally {
      setCargando(false);
    }
  };

  // Calcular totales para un empleado
  const calcularTotales = (emp) => {
    return {
      haberes: emp.totalHaberes || 0,
      deducciones: emp.totalDeducciones || 0,
      neto: emp.totalNeto || 0,
    };
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
  const handleCalcular = async (empleado) => {
    try {
      setCargando(true);
      // Llamar a la API para calcular la nómina
      const respuesta = await nominaService.calcularNomina(
        empleado.id,
        periodoSeleccionado
      );

      if (respuesta.data) {
        const nomina = respuesta.data.nomina || respuesta.data;
        const totalHaberes = nomina.haberes?.totalHaberes || 0;
        const totalDeducciones = nomina.deducciones?.totalDeducciones || 0;

        // Actualizar el empleado con los datos calculados
        const empleadoActualizado = {
          ...empleado,
          estado: nomina.estado,
          diasTrabajados: nomina.diasTrabajados || 0,
          horasTrabajadas: nomina.horasTrabajadas || 0,
          horasExtras: nomina.horasExtras || 0,
          diasAusencia: nomina.diasAusencia || 0,
          sueldoBasico: nomina.sueldoBasico || empleado.sueldoBasico,
          totalHaberes: totalHaberes,
          totalDeducciones: totalDeducciones,
          totalNeto: nomina.totalNeto || 0,
          nominaId: nomina._id,
          nomina: nomina,
        };

        setEmpleados(
          empleados.map((emp) =>
            emp.id === empleado.id ? empleadoActualizado : emp
          )
        );
      }
    } catch (err) {
      console.error("Error al calcular nómina:", err);
      alert("Error al calcular la nómina. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Manejar cálculo masivo
  const handleCalcularTodos = async () => {
    const pendientes = empleados.filter((emp) => emp.estado === "pendiente");
    if (pendientes.length === 0) {
      alert("No hay empleados pendientes de cálculo");
      return;
    }

    try {
      setCargando(true);
      const empleadoIds = pendientes.map((emp) => emp.id);

      // Llamar a la API para calcular múltiples nóminas
      const respuesta = await nominaService.calcularNominasMultiples(
        empleadoIds,
        periodoSeleccionado
      );

      if (respuesta.data && respuesta.data.resultados) {
        // Actualizar los empleados que fueron calculados
        const empleadosActualizados = empleados.map((emp) => {
          const resultado = respuesta.data.resultados.find(
            (r) => r.empleadoId === emp.id
          );
          if (resultado && resultado.exito) {
            return {
              ...emp,
              estado: "calculado",
              nominaId: resultado.nominaId,
            };
          }
          return emp;
        });

        setEmpleados(empleadosActualizados);
        alert(`Se calcularon ${respuesta.data.resultados.length} empleados`);
      }
    } catch (err) {
      console.error("Error al calcular nóminas masivamente:", err);
      alert("Error al calcular las nóminas. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Manejar aprobación
  const handleAprobar = async (empleado) => {
    try {
      setCargando(true);
      // TODO: Obtener userId del contexto
      const aprobadoPor = "69013e9b612504e825813aee"; // ID de prueba

      const respuesta = await nominaService.aprobarNomina(
        empleado.nominaId,
        aprobadoPor
      );

      if (respuesta.data) {
        setEmpleados(
          empleados.map((emp) =>
            emp.id === empleado.id
              ? { ...emp, estado: respuesta.data.estado }
              : emp
          )
        );
      }
    } catch (err) {
      console.error("Error al aprobar nómina:", err);
      alert("Error al aprobar la nómina. Por favor, intenta de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  // Ver detalle del cálculo
  const handleVerDetalle = async (empleado) => {
    try {
      // Si tiene nominaId, cargar los detalles completos
      if (empleado.nominaId) {
        const respuesta = await nominaService.obtenerNominaById(empleado.nominaId);
        if (respuesta.data && respuesta.data.nomina) {
          const nominaCompleta = respuesta.data.nomina;
          // Enriquecer el empleado con datos de nómina
          const empleadoConDetalles = {
            ...empleado,
            horasTrabajadas: nominaCompleta.horasTrabajadas || 0,
            horasExtras: nominaCompleta.horasExtras || 0,
            diasTrabajados: nominaCompleta.diasTrabajados || 0,
            diasAusencia: nominaCompleta.diasAusencia || 0,
            totalHaberes: nominaCompleta.haberes?.totalHaberes || 0,
            totalDeducciones: nominaCompleta.deducciones?.totalDeducciones || 0,
            totalNeto: nominaCompleta.totalNeto || 0,
            calculoDetalle: {
              sueldoBasico: nominaCompleta.haberes?.sueldoBasico || 0,
              antiguedad: nominaCompleta.haberes?.antiguedad || 0,
              presentismo: nominaCompleta.haberes?.presentismo || 0,
              horasExtras: nominaCompleta.haberes?.horasExtras || 0,
              viaticos: nominaCompleta.haberes?.viaticos || 0,
              jubilacion: nominaCompleta.deducciones?.jubilacion || 0,
              obraSocial: nominaCompleta.deducciones?.obraSocial || 0,
              ley19032: nominaCompleta.deducciones?.ley19032 || 0,
              sindicato: nominaCompleta.deducciones?.sindicato || 0,
            }
          };
          setEmpleadoSeleccionado(empleadoConDetalles);
        } else {
          setEmpleadoSeleccionado(empleado);
        }
      } else {
        // Sin nómina, mostrar datos básicos
        setEmpleadoSeleccionado({
          ...empleado,
          calculoDetalle: {
            sueldoBasico: empleado.sueldoBasico || 0,
            antiguedad: 0,
            presentismo: 0,
            horasExtras: 0,
            viaticos: 0,
            jubilacion: 0,
            obraSocial: 0,
            ley19032: 0,
            sindicato: 0,
          }
        });
      }
      setModalDetalleOpen(true);
    } catch (err) {
      console.error("Error al cargar detalles:", err);
      // Abrir modal igualmente con los datos básicos
      setEmpleadoSeleccionado({
        ...empleado,
        calculoDetalle: {
          sueldoBasico: empleado.sueldoBasico || 0,
          antiguedad: 0,
          presentismo: 0,
          horasExtras: 0,
          viaticos: 0,
          jubilacion: 0,
          obraSocial: 0,
          ley19032: 0,
          sindicato: 0,
        }
      });
      setModalDetalleOpen(true);
    }
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
    const botonesAccion = (
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
    );

    // Crear fila con propiedades EN EL ORDEN EXACTO DE LAS COLUMNAS
    // Columnas: ["Legajo", "Empleado", "Cargo", "Estado", "Días Trab.", "Ausencias", "Neto Estimado", "Acciones"]
    return {
      legajo: emp.legajo,
      empleado: emp.nombre,
      cargo: emp.cargo,
      estado: getEstadoChip(emp.estado),
      diasTrabajados: emp.diasTrabajados || 0,
      ausencias: emp.diasAusencia || 0,
      netoEstimado: emp.totalNeto > 0 ? formatMonto(emp.totalNeto) : "$0",
      acciones: botonesAccion,
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

      {/* Mostrar mensajes de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estado de cargando */}
      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
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
              disabled={cargando}
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
          {empleados.length === 0 ? (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 3 }}>
              No hay empleados para el período seleccionado
            </Typography>
          ) : (
            <CustomTable
              columns={columnas}
              rows={filas}
              headerColor="#7FC6BA"
              headerTextColor="#FFFFFF"
            />
          )}
        </>
      )}

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
