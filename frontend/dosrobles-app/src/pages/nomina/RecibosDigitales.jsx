// src/pages/nomina/RecibosDigitales.jsx
// Pantalla para que el empleado consulte y descargue sus recibos de sueldo

import { useState } from "react";
import { Box, Typography, Chip } from "@mui/material";
import { PrimaryButton, SecondaryButton } from "../../components/ui/Buttons";
import CustomTable from "../../components/ui/CustomTable";
import SearchBar from "../../components/ui/SearchBar";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ModalVistaPrevia from "../../components/nomina/ModalVistaPrevia";

export default function RecibosDigitales() {
  const [busqueda, setBusqueda] = useState("");
  const [modalVistaPreviaOpen, setModalVistaPreviaOpen] = useState(false);
  const [reciboSeleccionado, setReciboSeleccionado] = useState(null);

  // Datos de ejemplo de recibos
  const [recibos] = useState([
    {
      id: 1,
      periodo: "Septiembre 2025",
      fechaPago: "05/10/2025",
      montoNeto: "$ 850.000,00",
      montoBruto: "$ 1.200.000,00",
      deducciones: "$ 350.000,00",
      estado: "pagado",
      empleado: {
        nombre: "Juan Pérez",
        legajo: "026",
        cuil: "20-12345678-9",
        cargo: "Desarrollador Senior",
        fechaIngreso: "01/03/2020",
      },
      conceptos: {
        remunerativo: [
          { concepto: "Sueldo Básico", cantidad: 1, unitario: 800000, total: 800000 },
          { concepto: "Antigüedad", cantidad: 1, unitario: 200000, total: 200000 },
          { concepto: "Presentismo", cantidad: 1, unitario: 100000, total: 100000 },
        ],
        noRemunerativo: [
          { concepto: "Viáticos", cantidad: 1, unitario: 100000, total: 100000 },
        ],
        deducciones: [
          { concepto: "Jubilación", cantidad: 1, unitario: 120000, total: 120000 },
          { concepto: "Obra Social", cantidad: 1, unitario: 80000, total: 80000 },
          { concepto: "Ley 19032", cantidad: 1, unitario: 50000, total: 50000 },
          { concepto: "SINDICATO", cantidad: 1, unitario: 100000, total: 100000 },
        ],
      },
    },
    {
      id: 2,
      periodo: "Agosto 2025",
      fechaPago: "05/09/2025",
      montoNeto: "$ 820.000,00",
      montoBruto: "$ 1.150.000,00",
      deducciones: "$ 330.000,00",
      estado: "pagado",
      empleado: {
        nombre: "Juan Pérez",
        legajo: "026",
        cuil: "20-12345678-9",
        cargo: "Desarrollador Senior",
        fechaIngreso: "01/03/2020",
      },
      conceptos: {
        remunerativo: [
          { concepto: "Sueldo Básico", cantidad: 1, unitario: 800000, total: 800000 },
          { concepto: "Antigüedad", cantidad: 1, unitario: 200000, total: 200000 },
          { concepto: "Presentismo", cantidad: 1, unitario: 50000, total: 50000 },
        ],
        noRemunerativo: [
          { concepto: "Viáticos", cantidad: 1, unitario: 100000, total: 100000 },
        ],
        deducciones: [
          { concepto: "Jubilación", cantidad: 1, unitario: 110000, total: 110000 },
          { concepto: "Obra Social", cantidad: 1, unitario: 80000, total: 80000 },
          { concepto: "Ley 19032", cantidad: 1, unitario: 50000, total: 50000 },
          { concepto: "SINDICATO", cantidad: 1, unitario: 90000, total: 90000 },
        ],
      },
    },
    {
      id: 3,
      periodo: "Julio 2025",
      fechaPago: "05/08/2025",
      montoNeto: "$ 800.000,00",
      montoBruto: "$ 1.100.000,00",
      deducciones: "$ 300.000,00",
      estado: "pagado",
      empleado: {
        nombre: "Juan Pérez",
        legajo: "026",
        cuil: "20-12345678-9",
        cargo: "Desarrollador Senior",
        fechaIngreso: "01/03/2020",
      },
      conceptos: {
        remunerativo: [
          { concepto: "Sueldo Básico", cantidad: 1, unitario: 800000, total: 800000 },
          { concepto: "Antigüedad", cantidad: 1, unitario: 200000, total: 200000 },
        ],
        noRemunerativo: [
          { concepto: "Viáticos", cantidad: 1, unitario: 100000, total: 100000 },
        ],
        deducciones: [
          { concepto: "Jubilación", cantidad: 1, unitario: 100000, total: 100000 },
          { concepto: "Obra Social", cantidad: 1, unitario: 80000, total: 80000 },
          { concepto: "Ley 19032", cantidad: 1, unitario: 50000, total: 50000 },
          { concepto: "SINDICATO", cantidad: 1, unitario: 70000, total: 70000 },
        ],
      },
    },
  ]);

  // Filtrar recibos según búsqueda
  const recibosFiltrados = recibos.filter((rec) => {
    const searchLower = busqueda.toLowerCase();
    return (
      rec.periodo.toLowerCase().includes(searchLower) ||
      rec.fechaPago.includes(searchLower) ||
      rec.montoNeto.includes(searchLower)
    );
  });

  // Manejar vista previa
  const handleVerRecibo = (recibo) => {
    setReciboSeleccionado(recibo);
    setModalVistaPreviaOpen(true);
  };

  // Manejar descarga de PDF
  const handleDescargarPDF = (recibo) => {
    // Por ahora solo muestra un alert
    alert(`Descargando recibo de ${recibo.periodo}...\n\nEn una segunda etapa de desarrollo se generaría el PDF aquí.`);
  };

  // Preparar datos para la tabla
  const columnas = ["Período", "Fecha de Pago", "Monto Neto", "Estado", "Acciones"];

  const filas = recibosFiltrados.map((rec) => ({
    periodo: rec.periodo,
    fechaPago: rec.fechaPago,
    montoNeto: rec.montoNeto,
    estado: (
      <Chip
        label={rec.estado === "pagado" ? "PAGADO" : "PENDIENTE"}
        sx={{
          backgroundColor: rec.estado === "pagado" ? "#E8F5E9" : "#FFF3E0",
          color: rec.estado === "pagado" ? "#4CAF50" : "#FFA726",
          fontWeight: 600,
          fontSize: "0.8rem",
        }}
      />
    ),
    acciones: (
      <Box sx={{ display: "flex", gap: 1 }}>
        <SecondaryButton
          startIcon={<VisibilityIcon />}
          onClick={() => handleVerRecibo(rec)}
          sx={{
            fontSize: "0.8rem",
            px: 2,
            py: 0.5,
            minWidth: 100,
          }}
        >
          Ver
        </SecondaryButton>
        <PrimaryButton
          startIcon={<DownloadIcon />}
          onClick={() => handleDescargarPDF(rec)}
          sx={{
            fontSize: "0.8rem",
            px: 2,
            py: 0.5,
            minWidth: 130,
          }}
        >
          Descargar
        </PrimaryButton>
      </Box>
    ),
  }));

  return (
    <Box sx={{ p: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "#585858", mb: 1 }}>
          Mis Recibos de Sueldo
        </Typography>
        <Typography variant="body2" sx={{ color: "#808080" }}>
          Consultá y descargá tus recibos de sueldo en formato PDF
        </Typography>
      </Box>

      {/* Buscador */}
      <Box sx={{ mb: 3, maxWidth: 400 }}>
        <SearchBar
          placeholder="Buscar por período o fecha..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </Box>

      {/* Tabla de Recibos */}
      <CustomTable
        columns={columnas}
        rows={filas}
        headerColor="#7FC6BA"
        headerTextColor="#FFFFFF"
      />

      {/* Modal de Vista Previa */}
      <ModalVistaPrevia
        open={modalVistaPreviaOpen}
        onClose={() => setModalVistaPreviaOpen(false)}
        recibo={reciboSeleccionado}
        onDescargar={handleDescargarPDF}
      />
    </Box>
  );
}
