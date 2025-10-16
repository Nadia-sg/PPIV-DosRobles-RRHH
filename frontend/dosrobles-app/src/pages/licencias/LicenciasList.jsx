// src/pages/licencias/LicenciasList.jsx
// Pantalla principal de gestión de licencias/ausencias

import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { PrimaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import ModalSolicitudLicencia from "../../components/licencias/ModalSolicitudLicencia";
import ModalDetallesLicencia from "../../components/licencias/ModalDetallesLicencia";

export default function LicenciasList() {
  const [modalSolicitudOpen, setModalSolicitudOpen] = useState(false);
  const [modalDetallesOpen, setModalDetallesOpen] = useState(false);
  const [licenciaSeleccionada, setLicenciaSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  const [esGerente] = useState(false); // Cambiar a true para probar vista de gerente

  const [licencias, setLicencias] = useState([
    {
      id: 1,
      fecha: "25/07/2025",
      tipoLicencia: "examen",
      tipoTexto: "Licencia por examen",
      estado: "aprobado",
      fechaSolicitud: "20/07/2025",
      fechaInicio: "25/07/2025",
      fechaFin: "25/07/2025",
      motivo: "Examen final de Programación",
      empleado: "Juan Pérez",
    },
    {
      id: 2,
      fecha: "23/07/2025",
      tipoLicencia: "cita_medica",
      tipoTexto: "Licencia por cita médica",
      estado: "pendiente",
      fechaSolicitud: "18/07/2025",
      fechaInicio: "23/07/2025",
      fechaFin: "23/07/2025",
      motivo: "Control médico de rutina",
      empleado: "Juan Pérez",
    },
    {
      id: 3,
      fecha: "23/06/2025",
      tipoLicencia: "cita_medica",
      tipoTexto: "Licencia por cita médica",
      estado: "aprobado",
      fechaSolicitud: "18/06/2025",
      fechaInicio: "23/06/2025",
      fechaFin: "23/06/2025",
      motivo: "Consulta con especialista",
      empleado: "Juan Pérez",
    },
    {
      id: 4,
      fecha: "23/05/2025",
      tipoLicencia: "ausencia_justificada",
      tipoTexto: "Ausencia justificada",
      estado: "aprobado",
      fechaSolicitud: "20/05/2025",
      fechaInicio: "23/05/2025",
      fechaFin: "23/05/2025",
      motivo: "Asunto familiar urgente",
      empleado: "Juan Pérez",
    },
    {
      id: 5,
      fecha: "23/03/2025",
      tipoLicencia: "razones_particulares",
      tipoTexto: "Razones particulares",
      estado: "aprobado",
      fechaSolicitud: "18/03/2025",
      fechaInicio: "23/03/2025",
      fechaFin: "23/03/2025",
      motivo: "Trámite personal",
      empleado: "Juan Pérez",
    },
    {
      id: 6,
      fecha: "25/02/2025",
      tipoLicencia: "enfermedad",
      tipoTexto: "Licencia por enfermedad",
      estado: "aprobado",
      fechaSolicitud: "25/02/2025",
      fechaInicio: "25/02/2025",
      fechaFin: "27/02/2025",
      motivo: "Gripe severa",
      empleado: "Juan Pérez",
    },
    {
      id: 7,
      fecha: "02/02/2025",
      tipoLicencia: "vacaciones",
      tipoTexto: "Licencia por vacaciones",
      estado: "aprobado",
      fechaSolicitud: "15/01/2025",
      fechaInicio: "02/02/2025",
      fechaFin: "09/02/2025",
      motivo: "Vacaciones anuales",
      empleado: "Juan Pérez",
    },
  ]);

  // Manejar nueva solicitud de licencia
  const handleSolicitudSubmit = (nuevaLicencia) => {
    const nuevaLicenciaCompleta = {
      id: licencias.length + 1,
      fecha: nuevaLicencia.fechaInicio,
      tipoLicencia: nuevaLicencia.tipoLicencia,
      tipoTexto: getTipoTexto(nuevaLicencia.tipoLicencia),
      estado: "pendiente",
      ...nuevaLicencia,
      empleado: "Juan Pérez",
    };

    setLicencias([nuevaLicenciaCompleta, ...licencias]);
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

  // Ver detalles de una licencia
  const handleVerDetalles = (licencia) => {
    setLicenciaSeleccionada(licencia);
    setModalDetallesOpen(true);
  };

  // Aprobar licencia (solo gerente)
  const handleAprobar = (licenciaId) => {
    setLicencias(
      licencias.map((lic) =>
        lic.id === licenciaId ? { ...lic, estado: "aprobado" } : lic
      )
    );
  };

  // Rechazar licencia (solo gerente)
  const handleRechazar = (licenciaId) => {
    setLicencias(
      licencias.map((lic) =>
        lic.id === licenciaId
          ? { ...lic, estado: "rechazado", comentarioGerente: "No aprobado" }
          : lic
      )
    );
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

  const columnas = ["Fecha", "Tipo de Licencia", ""];

  const filas = licenciasFiltradas.map((lic) => ({
    fecha: lic.fecha,
    tipo: lic.tipoTexto,
    acciones: (
      <PrimaryButton
        onClick={() => handleVerDetalles(lic)}
        sx={{
          fontSize: "0.85rem",
          px: 2.5,
          py: 0.8,
          minWidth: 120,
        }}
      >
        Ver_Detalles
      </PrimaryButton>
    ),
    licenciaOriginal: lic, // Guardamos la licencia original para el modal
  }));

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

        {/* Botón para solicitar ausencia (solo empleados) */}
        {!esGerente && (
          <PrimaryButton
            onClick={() => setModalSolicitudOpen(true)}
            sx={{ px: 3, py: 1 }}
          >
            Solicitar Ausencia
          </PrimaryButton>
        )}
      </Box>

      {/* Buscador */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <SearchBar
          placeholder="Buscar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>

      {/* Tabla de Ausencias */}
      <CustomTable
        columns={columnas}
        rows={filas}
        headerColor="#7FC6BA"
        headerTextColor="#FFFFFF"
      />

      {/* Modal de Solicitud de Licencia */}
      <ModalSolicitudLicencia
        open={modalSolicitudOpen}
        onClose={() => setModalSolicitudOpen(false)}
        onSubmit={handleSolicitudSubmit}
      />

      {/* Modal de Detalles de Licencia */}
      <ModalDetallesLicencia
        open={modalDetallesOpen}
        onClose={() => setModalDetallesOpen(false)}
        licencia={licenciaSeleccionada}
        esGerente={esGerente}
        onAprobar={handleAprobar}
        onRechazar={handleRechazar}
      />
    </Box>
  );
}
