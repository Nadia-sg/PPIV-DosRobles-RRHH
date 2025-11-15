// src/pages/licencias/LicenciasList.jsx
// Pantalla principal de gestión de licencias/ausencias

import { useState, useEffect, useRef } from "react";
import { Box, Typography, CircularProgress, Alert } from "@mui/material";
import { PrimaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import ModalSolicitudLicencia from "../../components/licencias/ModalSolicitudLicencia";
import ModalDetallesLicencia from "../../components/licencias/ModalDetallesLicencia";
import ModalConfirmacion from "../../components/licencias/ModalConfirmacion";
import ModalError from "../../components/licencias/ModalError";
import { licenciasService } from "../../services/licenciasService";
import { useUser } from "../../context/userContextHelper";

export default function LicenciasList() {
  const { user, loading: userLoading } = useUser();
  const modalSolicitudRef = useRef(null);

  // Estados para licencias
  const [modalSolicitudOpen, setModalSolicitudOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [modalErrorOpen, setModalErrorOpen] = useState(false);
  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);
  const [errorMensaje, setErrorMensaje] = useState("");
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  // Siempre mostrar solo las licencias del usuario logueado
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
    console.log("🔄 [LicenciasList] useEffect ejecutado. userLoading:", userLoading, "user:", user);
    if (!userLoading && user?.empleadoId) {
      console.log("✅ [LicenciasList] Llamando cargarLicencias()");
      cargarLicencias();
    } else {
      console.log("⏸️ [LicenciasList] No se llama cargarLicencias. userLoading:", userLoading, "user?.empleadoId:", user?.empleadoId);
    }
  }, [userLoading, user?.empleadoId]);

  // Función para cargar licencias desde la API
  const cargarLicencias = async () => {
    try {
      setCargando(true);
      setError(null);

      // El backend filtra automáticamente por empleadoId del token
      const respuesta = await licenciasService.obtenerLicencias();

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

  // Manejar nueva solicitud de licencia
  const handleSolicitudSubmit = async (nuevaLicencia) => {
    try {
      // Preparar datos para enviar a la API
      // El empleadoId se obtiene del token en el backend
      const datosLicencia = {
        tipoLicencia: nuevaLicencia.tipoLicencia,
        fechaInicio: nuevaLicencia.fechaInicio,
        fechaFin: nuevaLicencia.fechaFin,
        motivo: nuevaLicencia.motivo,
        descripcion: nuevaLicencia.descripcion || "",
      };

      const respuesta = await licenciasService.solicitarLicencia(datosLicencia);

      // Agregar la nueva licencia a la lista
      if (respuesta.data) {
        const licenciaAgregada = {
          id: respuesta.data._id,
          fecha: formatearFecha(respuesta.data.fechaSolicitud),
          tipoLicencia: respuesta.data.tipoLicencia,
          tipoTexto: getTipoTexto(respuesta.data.tipoLicencia),
          estado: respuesta.data.estado,
          fechaSolicitud: formatearFecha(respuesta.data.fechaSolicitud),
          fechaInicio: formatearFecha(respuesta.data.fechaInicio),
          fechaFin: formatearFecha(respuesta.data.fechaFin),
          motivo: respuesta.data.motivo || "",
          empleado: "Juan Pérez",
          diasTotales: respuesta.data.diasTotales,
        };

        setLicencias([licenciaAgregada, ...licencias]);
        // Resetear formulario
        modalSolicitudRef.current?.resetForm();
        // Cerrar modal de solicitud SOLO si fue exitoso
        setModalSolicitudOpen(false);
        // Mostrar modal de confirmación
        setModalConfirmacionOpen(true);
      }
    } catch (err) {
      console.error("Error al solicitar licencia:", err);
      // Mostrar el mensaje de error específico del servidor en un modal
      const mensajeError = err.message || "Error al solicitar la licencia. Por favor, intenta de nuevo.";
      setErrorMensaje(mensajeError);
      setModalErrorOpen(true);
      // NO cerrar el modal de solicitud para que el usuario pueda reintentar
    }
  };

  // Ver detalles de una licencia
  const handleVerDetalles = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalDetallesOpen(true);
  };

  // Aprobar licencia (solo gerente)
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
      alert("Error al aprobar la licencia. Por favor, intenta de nuevo.");
    }
  };

  // Rechazar licencia (solo gerente)
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
      alert("Error al rechazar la licencia. Por favor, intenta de nuevo.");
    }
  };

  // Filtrar licencias según búsqueda
  const licenciasFiltradas = licencias.filter((lic) => {
    const searchLower = busqueda.toLowerCase();
    return (
      lic.tipoTexto.toLowerCase().includes(searchLower) ||
      lic.fecha.includes(searchLower) ||
      lic.estado.toLowerCase().includes(searchLower)
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

  // Columnas: mostrar sin la columna de empleado (son solo las licencias del usuario)
  const columnas = ["Fecha", "Tipo de Licencia", "Estado", ""];

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
            Ausencias
          </Typography>
          <Typography variant="body2" sx={{ color: "#808080" }}>
            Historial de licencias y ausencias solicitadas.
          </Typography>
        </Box>

        {/* Botón para solicitar ausencia */}
        <PrimaryButton
          onClick={() => setModalSolicitudOpen(true)}
          sx={{ px: 3, py: 1 }}
        >
          Solicitar Ausencia
        </PrimaryButton>
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
              placeholder="Buscar..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Box>

          {/* Tabla de Ausencias */}
          {licencias.length === 0 ? (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 3 }}>
              No hay licencias registradas
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

      {/* Modal de Solicitud de Licencia */}
      <ModalSolicitudLicencia
        ref={modalSolicitudRef}
        open={modalSolicitudOpen}
        onClose={() => setModalSolicitudOpen(false)}
        onSubmit={handleSolicitudSubmit}
      />

      {/* Modal de Detalles de Licencia */}
      <ModalDetallesLicencia
        open={modalDetallesOpen}
        onClose={() => setModalDetallesOpen(false)}
        licencia={licenciaSeleccionada}
        esGerente={false}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />

      {/* Modal de Error */}
      <ModalError
        open={modalErrorOpen}
        onClose={() => setModalErrorOpen(false)}
        error={errorMensaje}
      />

      {/* Modal de Confirmación */}
      <ModalConfirmacion
        open={modalConfirmacionOpen}
        onClose={() => setModalConfirmacionOpen(false)}
        mensaje="Su solicitud ha sido enviada para revisión"
      />
    </Box>
  );
}
