// src/pages/nomina/RecibosDigitales.jsx
// Pantalla para que el empleado consulte recibos de sueldo y docum entos

import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
} from "@mui/material";
import { PrimaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AddIcon from "@mui/icons-material/Add";
import ModalVistaPrevia from "../../components/nomina/ModalVistaPrevia";
import ModalSubirDocumento from "../../components/documentos/ModalSubirDocumento";
import { nominaService } from "../../services/nominaService";
import { documentosService } from "../../services/documentosService";
import { useUser } from "../../context/UserContext";

export default function RecibosDigitales() {
  const { user, loading: userLoading } = useUser();

  // Estados generales
  const [activeTab, setActiveTab] = useState(0);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  // Estados para Recibos de Sueldo
  const [modalVistaPreviaOpen, setModalVistaPreviaOpen] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);
  const [recibos, setRecibos] = useState([]);

  // Estados para Documentos
  const [documentos, setDocumentos] = useState([]);
  const [modalSubirOpen, setModalSubirOpen] = useState(false);

  // Cargar datos al montar el componente - ESPERAR a que UserContext cargue
  useEffect(() => {
    if (!userLoading && user?.empleadoId) {
      cargarRecibos();
      cargarDocumentos();
    }
  }, [userLoading, user?.empleadoId]);

  // Función para cargar recibos desde la API
  const cargarRecibos = async () => {
    try {
      setCargando(true);
      setError(null);

      const empleadoId = user?.empleadoId;

      const respuesta = await nominaService.obtenerNominas({
        empleadoId: empleadoId,
        estado: "aprobado",
      });

      // Transformar nóminas aprobadas a formato de recibos
      const recibosTransformados = (respuesta.data || []).map((nomina) => ({
        id: nomina._id,
        periodo: formatearPeriodo(nomina.periodo),
        fechaPago: formatearFecha(nomina.fechaAprobacion),
        montoNeto: formatMonto(nomina.totalNeto),
        montoBruto: formatMonto(nomina.haberes?.totalHaberes || 0),
        deducciones: formatMonto(nomina.deducciones?.totalDeducciones || 0),
        estado: "pagado",
        empleado: {
          nombre: user?.nombre,
          legajo: "026",
          cuil: "20-12345678-9",
          cargo: "Desarrollador Senior",
          fechaIngreso: "01/03/2020",
        },
      }));

      setRecibos(recibosTransformados);
    } catch (err) {
      console.error("Error al cargar recibos:", err);
      setError(
        "No se pudieron cargar los recibos. Por favor, intenta de nuevo."
      );
      setRecibos([]);
    } finally {
      setCargando(false);
    }
  };

  // Función para cargar documentos
  const cargarDocumentos = async () => {
    try {
      const empleadoId = user?.empleadoId;

      const respuesta = await documentosService.obtenerDocumentos(empleadoId);

      const documentosTransformados = (respuesta.data || []).map((doc) => ({
        id: doc._id,
        tipo: doc.tipoNombre,
        nombre: doc.nombreArchivo,
        fecha: formatearFecha(doc.fechaCarga),
        tamanio: formatearTamanio(doc.tamanio),
        descripcion: doc.descripcion,
      }));

      setDocumentos(documentosTransformados);
    } catch (err) {
      console.error("Error al cargar documentos:", err);
    }
  };

  // Funciones auxiliares de formato
  const formatearFecha = (fecha) => {
    if (!fecha) return "";
    try {
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

  const formatearPeriodo = (periodo) => {
    if (!periodo) return "";
    const [año, mes] = periodo.split("-");
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
    return `${meses[parseInt(mes) - 1]} ${año}`;
  };

  const formatMonto = (num) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
    }).format(num);
  };

  const formatearTamanio = (bytes) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  // Manejadores
  const handleVerRecibo = async (recibo) => {
    try {
      const respuesta = await nominaService.obtenerNominaById(recibo.id);
      const nominaData = respuesta.data.nomina;

      // Transformar la nómina a formato de recibo para el modal
      const haberes = nominaData.haberes || {};
      const deducciones = nominaData.deducciones || {};

      const reciboFormato = {
        id: nominaData._id,
        periodo: nominaData.periodo || "",
        fechaPago: nominaData.fechaAprobacion ? formatearFecha(nominaData.fechaAprobacion) : "",
        empleado: {
          nombre: user?.nombre || "No disponible",
          legajo: nominaData.empleadoId?.legajo || "026",
          cuil: nominaData.empleadoId?.cuil || "20-12345678-9",
          cargo: nominaData.empleadoId?.puesto || "Desarrollador Senior",
          fechaIngreso: "01/03/2020",
        },
        haberes: haberes,
        deducciones: deducciones,
        conceptos: {
          remunerativo: [
            { concepto: "Sueldo Básico", cantidad: 1, unitario: haberes.sueldoBasico || 0, total: haberes.sueldoBasico || 0 },
            { concepto: "Antigüedad", cantidad: 1, unitario: haberes.antiguedad || 0, total: haberes.antiguedad || 0 },
            { concepto: "Presentismo", cantidad: 1, unitario: haberes.presentismo || 0, total: haberes.presentismo || 0 },
            { concepto: "Horas Extras", cantidad: 1, unitario: haberes.horasExtras || 0, total: haberes.horasExtras || 0 },
          ],
          noRemunerativo: [
            { concepto: "Viáticos (No Remunerativo)", cantidad: 1, unitario: haberes.viaticos || 0, total: haberes.viaticos || 0 },
            { concepto: "Otros Haberes", cantidad: 1, unitario: haberes.otrosHaberes || 0, total: haberes.otrosHaberes || 0 },
          ],
          deducciones: [
            { concepto: "Jubilación (11%)", cantidad: 1, unitario: deducciones.jubilacion || 0, total: deducciones.jubilacion || 0 },
            { concepto: "Obra Social (3%)", cantidad: 1, unitario: deducciones.obraSocial || 0, total: deducciones.obraSocial || 0 },
            { concepto: "Ley 19032 (3%)", cantidad: 1, unitario: deducciones.ley19032 || 0, total: deducciones.ley19032 || 0 },
            { concepto: "Sindicato", cantidad: 1, unitario: deducciones.sindicato || 0, total: deducciones.sindicato || 0 },
            { concepto: "Otras Deducciones", cantidad: 1, unitario: deducciones.otrosDes || 0, total: deducciones.otrosDes || 0 },
          ],
        },
      };

      setReciboSeleccionado(reciboFormato);
      setModalVistaPreviaOpen(true);
    } catch (err) {
      console.error("Error al obtener recibo:", err);
    }
  };

  const handleDescargarRecibo = async (recibo) => {
    try {
      await nominaService.descargarReciboPDF(recibo.id);
    } catch (err) {
      console.error("Error al descargar recibo:", err);
      alert("Error al descargar el recibo PDF");
    }
  };

  const handleDescargarDocumento = async (documento) => {
    try {
      const { blob, filename } = await documentosService.descargarDocumento(
        documento.id
      );

      // Crear URL del blob
      const url = window.URL.createObjectURL(blob);

      // Crear elemento de descarga
      const link = document.createElement("a");
      link.href = url;
      link.download = filename || documento.nombre || "documento.pdf";

      // Simular click para descargar
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Limpiar la URL del blob
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error("Error al descargar:", err);
      alert(`Error al descargar el documento: ${err.message}`);
    }
  };

  const handleDocumentoSubido = async () => {
    await cargarDocumentos();
  };

  // Filtrar recibos
  const recibosFiltrados = recibos.filter((recibo) => {
    const searchLower = busqueda.toLowerCase();
    return (
      recibo.periodo.toLowerCase().includes(searchLower) ||
      recibo.montoNeto.toLowerCase().includes(searchLower)
    );
  });

  // Filtrar documentos
  const documentosFiltrados = documentos.filter((doc) => {
    const searchLower = busqueda.toLowerCase();
    return (
      doc.tipo.toLowerCase().includes(searchLower) ||
      doc.nombre.toLowerCase().includes(searchLower)
    );
  });

  // Columnas para recibos
  const columnasRecibos = ["Período", "Monto Bruto", "Deducciones", "Neto", ""];

  const filasRecibos = recibosFiltrados.map((recibo) => ({
    periodo: recibo.periodo,
    bruto: recibo.montoBruto,
    deducciones: recibo.deducciones,
    neto: recibo.montoNeto,
    acciones: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <PrimaryButton
          onClick={() => handleVerRecibo(recibo)}
          sx={{ fontSize: "0.75rem", px: 1.5, py: 0.5 }}
          startIcon={<VisibilityIcon fontSize="small" />}
        >
          Ver
        </PrimaryButton>
        <PrimaryButton
          onClick={() => handleDescargarRecibo(recibo)}
          sx={{
            fontSize: "0.75rem",
            px: 1.5,
            py: 0.5,
            bgcolor: "#4CAF50",
            "&:hover": { bgcolor: "#45A049" },
          }}
          startIcon={<DownloadIcon fontSize="small" />}
        >
          Descargar
        </PrimaryButton>
      </Box>
    ),
  }));

  // Columnas para documentos
  const columnasDocumentos = ["Tipo", "Nombre", "Fecha", ""];

  const filasDocumentos = documentosFiltrados.map((doc) => ({
    tipo: doc.tipo,
    nombre: doc.nombre,
    fecha: doc.fecha,
    acciones: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <PrimaryButton
          onClick={() => handleDescargarDocumento(doc)}
          sx={{
            fontSize: "0.75rem",
            px: 1.5,
            py: 0.5,
            bgcolor: "#4CAF50",
            "&:hover": { bgcolor: "#45A049" },
          }}
          startIcon={<DownloadIcon fontSize="small" />}
        >
          Descargar
        </PrimaryButton>
      </Box>
    ),
  }));

  if (cargando) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 600, color: "#585858", mb: 1 }}
        >
          Mis Documentos
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Gestiona tus recibos de sueldo y documentos personales
        </Typography>
      </Box>

      {/* Tabs */}
      <Box sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          sx={{
            borderBottom: "2px solid #E0E0E0",
            "& .MuiTab-root": {
              fontWeight: 500,
              color: "#808080",
              "&.Mui-selected": {
                color: "#7FC6BA",
              },
            },
            "& .MuiTabs-indicator": {
              backgroundColor: "#7FC6BA",
            },
          }}
        >
          <Tab label="Recibos de Sueldo" />
          <Tab label="Mis Documentos" />
        </Tabs>
      </Box>

      {/* Error */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* TAB 1: Recibos de Sueldo */}
      {activeTab === 0 && (
        <Box>
          <Box sx={{ mb: 3, maxWidth: 400 }}>
            <SearchBar
              placeholder="Buscar por período o monto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </Box>

          {recibos.length === 0 ? (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 4 }}>
              No hay recibos disponibles
            </Typography>
          ) : (
            <CustomTable
              columns={columnasRecibos}
              rows={filasRecibos}
              headerColor="#7FC6BA"
              headerTextColor="#FFFFFF"
            />
          )}
        </Box>
      )}

      {/* TAB 2: Mis Documentos */}
      {activeTab === 1 && (
        <Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
              gap: 2,
            }}
          >
            <Box sx={{ maxWidth: 400, flex: 1 }}>
              <SearchBar
                placeholder="Buscar documentos..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
            </Box>
            <PrimaryButton
              onClick={() => setModalSubirOpen(true)}
              startIcon={<AddIcon />}
              sx={{ px: 3, py: 1 }}
            >
              Nuevo Documento
            </PrimaryButton>
          </Box>

          {documentos.length === 0 ? (
            <Typography sx={{ color: "#808080", textAlign: "center", py: 4 }}>
              No hay documentos subidos
            </Typography>
          ) : (
            <CustomTable
              columns={columnasDocumentos}
              rows={filasDocumentos}
              headerColor="#7FC6BA"
              headerTextColor="#FFFFFF"
            />
          )}
        </Box>
      )}

      {/* Modal Vista Previa Recibo */}
      <ModalVistaPrevia
        open={modalVistaPreviaOpen}
        onClose={() => setModalVistaPreviaOpen(false)}
        recibo={reciboSeleccionado}
        onDescargar={handleDescargarRecibo}
      />

      {/* Modal Subir Documento */}
      <ModalSubirDocumento
        open={modalSubirOpen}
        onClose={() => setModalSubirOpen(false)}
        empleadoId={user?.empleadoId}
        onDocumentoSubido={handleDocumentoSubido}
      />
    </Box>
  );
}
