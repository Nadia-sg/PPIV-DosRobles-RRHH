// src/components/nomina/ModalVistaPrevia.jsx
// Modal para previsualizar el recibo de sueldo antes de descargar

import { Box, Typography, Dialog, IconButton, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalVistaPrevia({ open, onClose, recibo, onDescargar }) {
  if (!recibo) return null;

  // Calcular totales
  const totalRemunerativo = recibo.conceptos.remunerativo.reduce((sum, item) => sum + item.total, 0);
  const totalNoRemunerativo = recibo.conceptos.noRemunerativo.reduce((sum, item) => sum + item.total, 0);
  const totalDeducciones = recibo.conceptos.deducciones.reduce((sum, item) => sum + item.total, 0);
  const totalHaberes = totalRemunerativo + totalNoRemunerativo;
  const netoAPagar = totalHaberes - totalDeducciones;

  // Formatear números
  const formatMonto = (num) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(num);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: "#F5F5F5",
          borderRadius: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: 1000,
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "1px solid #E0E0E0",
          backgroundColor: "#FFFFFF",
        }}
      >
        <Typography sx={{ fontSize: "1.2rem", fontWeight: 600, color: "#585858" }}>
          Recibo de Sueldo - {recibo.periodo}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#808080" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido del Recibo */}
      <Box sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
        {/* Recibo en formato profesional */}
        <Paper sx={{ p: 3, backgroundColor: "#FFFFFF" }}>
          {/* Header Empresa */}
          <Box sx={{ mb: 3, textAlign: "center", borderBottom: "2px solid #7FC6BA", pb: 2 }}>
            <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#585858" }}>
              DOS ROBLES
            </Typography>
            <Typography sx={{ fontSize: "0.9rem", color: "#808080" }}>
              RECIBO DE HABERES
            </Typography>
          </Box>

          {/* Información del Empleado */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 1 }}>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Empleado:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.empleado.nombre}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Legajo:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.empleado.legajo}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>CUIL:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.empleado.cuil}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Cargo:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.empleado.cargo}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Período:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.periodo}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Fecha de Pago:</Typography>
                <Typography sx={{ fontSize: "0.95rem", fontWeight: 600, color: "#585858" }}>
                  {recibo.fechaPago}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Tabla de Conceptos */}
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow sx={{ backgroundColor: "#7FC6BA" }}>
                  <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>Concepto</TableCell>
                  <TableCell align="center" sx={{ color: "#FFFFFF", fontWeight: 600 }}>Cantidad</TableCell>
                  <TableCell align="right" sx={{ color: "#FFFFFF", fontWeight: 600 }}>Unitario</TableCell>
                  <TableCell align="right" sx={{ color: "#FFFFFF", fontWeight: 600 }}>Total</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {/* Conceptos Remunerativos */}
                <TableRow>
                  <TableCell colSpan={4} sx={{ backgroundColor: "#F5F5F5", fontWeight: 600, color: "#585858" }}>
                    HABERES REMUNERATIVOS
                  </TableCell>
                </TableRow>
                {recibo.conceptos.remunerativo.map((item, idx) => (
                  <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
                    <TableCell>{item.concepto}</TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="right">{formatMonto(item.unitario)}</TableCell>
                    <TableCell align="right">{formatMonto(item.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontWeight: 600, color: "#585858" }}>Subtotal Remunerativo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#585858" }}>
                    {formatMonto(totalRemunerativo)}
                  </TableCell>
                </TableRow>

                {/* Conceptos No Remunerativos */}
                <TableRow>
                  <TableCell colSpan={4} sx={{ backgroundColor: "#F5F5F5", fontWeight: 600, color: "#585858" }}>
                    HABERES NO REMUNERATIVOS
                  </TableCell>
                </TableRow>
                {recibo.conceptos.noRemunerativo.map((item, idx) => (
                  <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
                    <TableCell>{item.concepto}</TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="right">{formatMonto(item.unitario)}</TableCell>
                    <TableCell align="right">{formatMonto(item.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontWeight: 600, color: "#585858" }}>Subtotal No Remunerativo</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 600, color: "#585858" }}>
                    {formatMonto(totalNoRemunerativo)}
                  </TableCell>
                </TableRow>

                {/* Total Haberes */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: "1rem", color: "#585858", backgroundColor: "#E8F5E9" }}>
                    TOTAL HABERES
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#4CAF50", backgroundColor: "#E8F5E9" }}>
                    {formatMonto(totalHaberes)}
                  </TableCell>
                </TableRow>

                {/* Deducciones */}
                <TableRow>
                  <TableCell colSpan={4} sx={{ backgroundColor: "#F5F5F5", fontWeight: 600, color: "#585858" }}>
                    DEDUCCIONES
                  </TableCell>
                </TableRow>
                {recibo.conceptos.deducciones.map((item, idx) => (
                  <TableRow key={idx} sx={{ '&:hover': { backgroundColor: '#FAFAFA' } }}>
                    <TableCell>{item.concepto}</TableCell>
                    <TableCell align="center">{item.cantidad}</TableCell>
                    <TableCell align="right">{formatMonto(item.unitario)}</TableCell>
                    <TableCell align="right">{formatMonto(item.total)}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: "1rem", color: "#585858", backgroundColor: "#FFEBEE" }}>
                    TOTAL DEDUCCIONES
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#FF7779", backgroundColor: "#FFEBEE" }}>
                    {formatMonto(totalDeducciones)}
                  </TableCell>
                </TableRow>

                {/* NETO A PAGAR */}
                <TableRow>
                  <TableCell colSpan={3} sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                    NETO A PAGAR
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                    {formatMonto(netoAPagar)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Footer */}
          <Box sx={{ mt: 3, pt: 2, borderTop: "1px solid #E0E0E0", textAlign: "center" }}>
            <Typography sx={{ fontSize: "0.8rem", color: "#808080" }}>
              Este es un documento generado electrónicamente y tiene validez legal.
            </Typography>
          </Box>
        </Paper>
      </Box>

      {/* Botón Descargar PDF */}
      <Box
        sx={{
          p: 2,
          borderTop: "1px solid #E0E0E0",
          backgroundColor: "#FFFFFF",
          display: "flex",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <PrimaryButton
          startIcon={<DownloadIcon />}
          onClick={() => onDescargar(recibo)}
          sx={{ minWidth: 200, py: 1.2 }}
        >
          Descargar PDF
        </PrimaryButton>
      </Box>
    </Dialog>
  );
}
