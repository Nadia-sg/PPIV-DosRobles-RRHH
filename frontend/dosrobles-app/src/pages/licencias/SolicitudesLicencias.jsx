// src/pages/licencias/SolicitudesLicencias.jsx
// Pantalla para gestión de solicitudes de licencias de todos los empleados (solo admin/gerente/rrhh)

import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { PrimaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import ModalDetallesLicencia from "../../components/licencias/ModalDetallesLicencia";
import { licenciasService } from "../../services/licenciasService";
import { useUser } from "../../context/userContextHelper";

export default function SolicitudesLicencias() {
  const { user, loading: userLoading } = useUser();

  // Estados para licencias
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [licencias, setLicencias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Función auxiliar para formatear fechas
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
      // Si es una string en formato ISO (YYYY-MM-DD o YYYY-MM-DDTHH:mm:ss)
      if (typeof fecha === 'string' && fecha.includes('-')) {
        const partes = fecha.split('T')[0].split('-');
        if (partes.length === 3) {
          // Parsear manualmente como DD/MM/YYYY para evitar problemas de timezone
          return `${partes[2].padStart(2, '0')}/${partes[1].padStart(2, '0')}/${partes[0]}`;
        }
      }
      const date = new Date(fecha);
      return date.toLocaleDateString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return fecha;
    }
  };

  // Obtener texto del tipo de licencia
  const getTipoTexto = (tipo) => {
    const tipos = {
      vacaciones: "Vacaciones",
      enfermedad: "Enfermedad",
      asuntos_personales: "Asuntos personales",
      capacitacion: "Capacitación",
      licencia_medica: "Licencia médica",
      otro: "Otro",
      examen: "Licencia por examen",
      cita_medica: "Licencia por cita médica",
      ausencia_justificada: "Ausencia justificada",
      razones_particulares: "Razones particulares",
    };
    return tipos[tipo] || tipo;
  };

  // Cargar licencias cuando el usuario esté disponible
  useEffect(() => {
    if (!userLoading && user?.empleadoId) {
      cargarLicencias();
    }
  }, [userLoading, user?.empleadoId]);

  // Función para cargar todas las licencias desde la API
  const cargarLicencias = async () => {
    try {
      setCargando(true);
      setError(null);

      // Cargar todas las licencias (parámetro todas=true para admin)
      const respuesta = await licenciasService.obtenerLicencias({ todas: "true" });

      // Transformar datos de la API al formato del componente
      const licenciasTransformadas = (respuesta.data || []).map((lic) => {
        const empleado = lic.empleadoId || {};
        return {
          id: lic._id,
          fecha: formatearFecha(lic.fechaSolicitud),
          tipoLicencia: lic.tipoLicencia,
          tipoTexto: getTipoTexto(lic.tipoLicencia),
          estado: lic.estado,
          fechaSolicitud: formatearFecha(lic.fechaSolicitud),
          fechaInicio: formatearFecha(lic.fechaInicio),
          fechaFin: formatearFecha(lic.fechaFin),
          motivo: lic.motivo || lic.descripcion || "",
          empleado: `${empleado.nombre || ""} ${empleado.apellido || ""}`.trim() || "N/A",
          empleadoId: empleado._id,
          diasTotales: lic.diasTotales,
          comentarioGerente: lic.comentarioGerente || "",
          gerenteId: lic.gerenteId?._id,
        };
      });

      setLicencias(licenciasTransformadas);
    } catch (err) {
      console.error("Error al cargar licencias:", err);
      setError("No se pudieron cargar las licencias. Por favor, intenta de nuevo.");
      setLicencias([]); // Mantener lista vacía en caso de error
    } finally {
      setCargando(false);
    }
  };

  // Ver detalles de una licencia
  const handleVerDetalles = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalDetallesOpen(true);
  };

  // Aprobar licencia
  const handleAprobar = async (licenciaId, comentario = "Aprobado") => {
    try {
      const gerenteId = user?.empleadoId;
      if (!gerenteId) {
        alert("Error: No se pudo obtener el ID del gerente.");
        return;
      }
      await licenciasService.aprobarLicencia(licenciaId, gerenteId, comentario);

      // Actualizar el estado local
      setLicencias(
        licencias.map((lic) =>
          lic.id === licenciaId ? { ...lic, estado: "aprobado", comentarioGerente: comentario } : lic
        )
      );
    } catch (err) {
      console.error("Error al aprobar licencia:", err);
      const mensajeError = err.message || "Error al aprobar la licencia. Por favor, intenta de nuevo.";
      alert(mensajeError);
    }
  };

  // Rechazar licencia
  const handleRechazar = async (licenciaId, comentario = "") => {
    try {
      const gerenteId = user?.empleadoId;
      if (!gerenteId) {
        alert("Error: No se pudo obtener el ID del gerente.");
        return;
      }
      await licenciasService.rechazarLicencia(licenciaId, gerenteId, comentario);

      // Actualizar el estado local
      setLicencias(
        licencias.map((lic) =>
          lic.id === licenciaId
            ? { ...lic, estado: "rechazado", comentarioGerente: comentario }
            : lic
        )
      );
    } catch (err) {
      console.error("Error al rechazar licencia:", err);
      const mensajeError = err.message || "Error al rechazar la licencia. Por favor, intenta de nuevo.";
      alert(mensajeError);
    }
  };

  // Filtrar licencias según búsqueda
  const licenciasFiltradas = licencias.filter((lic) => {
    const searchLower = busqueda.toLowerCase();
    return (
      lic.tipoTexto.toLowerCase().includes(searchLower) ||
      lic.fecha.includes(searchLower) ||
      lic.estado.toLowerCase().includes(searchLower) ||
      lic.empleado.toLowerCase().includes(searchLower)
    );
  });

  // Obtener color del chip según el estado
  const getEstadoColor = (estado) => {
    switch (estado) {
      case "aprobado":
        return { bg: "#4CAF50", text: "#FFFFFF" };
      case "rechazado":
        return { bg: "#FF7779", text: "#FFFFFF" };
      case "pendiente":
        return { bg: "#FFA726", text: "#FFFFFF" };
      case "cancelado":
        return { bg: "#9E9E9E", text: "#FFFFFF" };
      default:
        return { bg: "#808080", text: "#FFFFFF" };
    }
  };

  // Columnas: mostrar "Empleado" siempre
  const columnas = ["Fecha", "Empleado", "Tipo de Licencia", "Estado", ""];

  const filas = licenciasFiltradas.map((lic) => {
    const colores = getEstadoColor(lic.estado);
    const botonDetalles = (
      <PrimaryButton
        onClick={() => handleVerDetalles(lic)}
        sx={{
          fontSize: "0.85rem",
          px: 2.5,
          py: 0.8,
          minWidth: 120,
        }}
      >
        Ver Detalles
      </PrimaryButton>
    );
    const estadoChip = (
      <Box
        sx={{
          display: "inline-block",
          backgroundColor: colores.bg,
          color: colores.text,
          px: 2,
          py: 0.5,
          borderRadius: 1,
          fontSize: "0.85rem",
          fontWeight: 600,
          textTransform: "capitalize",
        }}
      >
        {lic.estado}
      </Box>
    );

    // Crear la fila con las claves en el orden exacto de las columnas
    return {
      fecha: lic.fecha,
      empleado: lic.empleado,
      tipo: lic.tipoTexto,
      estado: estadoChip,
      acciones: botonDetalles,
    };
  });

  // Almacenar las licencias originales para acceso en modales
  const licenciasMap = {};
  licenciasFiltradas.forEach((lic) => {
    licenciasMap[lic.id] = lic;
  });

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{ fontWeight: 600, color: "#585858", mb: 1 }}
          >
            Solicitudes de Ausencias
          </Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>
            Gestión de solicitudes de licencias y ausencias de todos los empleados.
          </Typography>
        </Box>
      </Box>

      {/* Mostrar mensajes de error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Estado de cargando */}
      {cargando ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Buscador */}
          <Box sx={{ mb: 3, maxWidth: 400 }}>
            <SearchBar
              placeholder="Buscar por empleado, tipo o estado..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Box>

          {/* Tabla de Solicitudes */}
          {licencias.length === 0 ? (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 3 }}>
              No hay solicitudes de licencias registradas
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

      {/* Modal de Detalles de Licencia */}
      <ModalDetallesLicencia
        open={modalDetallesOpen}
        onClose={() => setModalDetallesOpen(false)}
        licencia={licenciaSeleccionada}
        esGerente={true}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </Box>
  );
}
