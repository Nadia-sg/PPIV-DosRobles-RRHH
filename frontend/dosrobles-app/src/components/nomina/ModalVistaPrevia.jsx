// src/components/nomina/ModalVistaPrevia.jsx
// Modal para previsualizar el recibo de sueldo antes de descargar

import { Box, Typography, Dialog, IconButton, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalVistaPrevia({ open, onClose, recibo, onDescargar }) {
  if (!recibo) return null;

  // Usar los datos de haberes y deducciones directamente
  const haberes = recibo.haberes || {};
  const deducciones = recibo.deducciones || {};

  // Calcular totales desde los datos de haberes y deducciones
  const totalRemunerativo = (haberes.sueldoBasico || 0) + (haberes.antiguedad || 0) + (haberes.presentismo || 0) + (haberes.horasExtras || 0);
  const totalNoRemunerativo = (haberes.viaticos || 0) + (haberes.otrosHaberes || 0);
  const totalDeducciones = (deducciones.jubilacion || 0) + (deducciones.obraSocial || 0) + (deducciones.ley19032 || 0) + (deducciones.sindicato || 0) + (deducciones.otrosDes || 0);
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

  // Formatear período (2025-10 → Octubre 2025)
  const formatearPeriodo = (periodo) => {
    if (!periodo || periodo.length !== 7) return periodo;
    const [anio, mes] = periodo.split('-');
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const mesIndex = parseInt(mes, 10) - 1;
    return `${meses[mesIndex]} ${anio}`;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#F5F5F5",
            borderRadius: 3,
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            width: "90%",
            maxWidth: 1000,
          },
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
          Recibo de Sueldo - {formatearPeriodo(recibo.periodo)}
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

          {/* Tabla de Detalle de Liquidación */}
          <Box sx={{ backgroundColor: "#FFFFFF", borderRadius: 2, p: 2 }}>
            <Typography sx={{ fontSize: "1.1rem", fontWeight: 600, color: "#585858", mb: 2 }}>
              Detalle de Liquidación
            </Typography>

            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow sx={{ backgroundColor: "#7FC6BA" }}>
                    <TableCell sx={{ color: "#FFFFFF", fontWeight: 600 }}>Concepto</TableCell>
                    <TableCell align="right" sx={{ color: "#FFFFFF", fontWeight: 600 }}>Monto</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {/* HABERES - Remunerativo */}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ backgroundColor: "#E8F5E9", fontWeight: 600, color: "#4CAF50" }}>
                      HABERES
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Sueldo Básico</TableCell>
                    <TableCell align="right">{formatMonto(haberes.sueldoBasico || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Antigüedad</TableCell>
                    <TableCell align="right">{formatMonto(haberes.antiguedad || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Presentismo</TableCell>
                    <TableCell align="right">{formatMonto(haberes.presentismo || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Horas Extras</TableCell>
                    <TableCell align="right">{formatMonto(haberes.horasExtras || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Viáticos (No Remunerativo)</TableCell>
                    <TableCell align="right">{formatMonto(haberes.viaticos || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Otros Haberes</TableCell>
                    <TableCell align="right">{formatMonto(haberes.otrosHaberes || 0)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "#4CAF50" }}>
                      SUBTOTAL HABERES
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#4CAF50" }}>
                      {formatMonto(totalHaberes)}
                    </TableCell>
                  </TableRow>

                  {/* DEDUCCIONES */}
                  <TableRow>
                    <TableCell colSpan={2} sx={{ backgroundColor: "#FFEBEE", fontWeight: 600, color: "#FF7779" }}>
                      DEDUCCIONES
                    </TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Jubilación (11%)</TableCell>
                    <TableCell align="right">{formatMonto(deducciones.jubilacion || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Obra Social (3%)</TableCell>
                    <TableCell align="right">{formatMonto(deducciones.obraSocial || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Ley 19032 (3%)</TableCell>
                    <TableCell align="right">{formatMonto(deducciones.ley19032 || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Sindicato</TableCell>
                    <TableCell align="right">{formatMonto(deducciones.sindicato || 0)}</TableCell>
                  </TableRow>

                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>Otras Deducciones</TableCell>
                    <TableCell align="right">{formatMonto(deducciones.otrosDes || 0)}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "#FF7779" }}>
                      SUBTOTAL DEDUCCIONES
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#FF7779" }}>
                      {formatMonto(totalDeducciones)}
                    </TableCell>
                  </TableRow>

                  {/* NETO A PAGAR */}
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                      NETO A PAGAR
                    </TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                      {formatMonto(netoAPagar)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

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
