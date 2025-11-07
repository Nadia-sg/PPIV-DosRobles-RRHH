// src/components/nomina/ModalCalculoDetalle.jsx
// Modal para ver el detalle completo del cálculo de haberes de un empleado

import { Box, Typography, Dialog, IconButton, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Grid } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CalculateIcon from "@mui/icons-material/Calculate";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { PrimaryButton } from "../ui/Buttons";

export default function ModalCalculoDetalle({ open, onClose, empleado, onCalcular, onAprobar }) {
  if (!empleado) return null;

  // Crear estructura por defecto si no existen los detalles de cálculo
  const calcDetalle = empleado.calculoDetalle || {
    antiguedad: 0,
    presentismo: 0,
    horasExtras: 0,
    viaticos: 0,
    jubilacion: 0,
    obraSocial: 0,
    ley19032: 0,
    sindicato: 0,
  };

  // Calcular totales
  const haberes =
    empleado.sueldoBasico +
    calcDetalle.antiguedad +
    calcDetalle.presentismo +
    calcDetalle.horasExtras +
    calcDetalle.viaticos;

  const deducciones =
    calcDetalle.jubilacion +
    calcDetalle.obraSocial +
    calcDetalle.ley19032 +
    calcDetalle.sindicato;

  const neto = haberes - deducciones;

  // Formatear moneda
  const formatMonto = (num) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
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
          maxWidth: 950,
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
          Detalle de Cálculo - {empleado.nombre}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "#808080" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Contenido */}
      <Box sx={{ p: 3, maxHeight: "70vh", overflowY: "auto" }}>
        {/* Información del Empleado */}
        <Box sx={{ mb: 3, p: 3, backgroundColor: "#FFFFFF", borderRadius: 2 }}>
          <Grid container spacing={2}>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Legajo</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#585858" }}>
                {empleado.legajo}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Cargo</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#585858" }}>
                {empleado.cargo}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Horas Trabajadas</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#585858" }}>
                {empleado.horasTrabajadas || 0}h
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Horas Extras</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: (empleado.horasExtras || 0) > 0 ? "#7FC6BA" : "#585858" }}>
                {empleado.horasExtras || 0}h
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Días Trabajados</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: "#585858" }}>
                {empleado.diasTrabajados || 0}
              </Typography>
            </Grid>
            <Grid item xs={6} md={3}>
              <Typography sx={{ fontSize: "0.85rem", color: "#808080" }}>Días Ausencia</Typography>
              <Typography sx={{ fontSize: "1rem", fontWeight: 600, color: (empleado.diasAusencia || 0) > 0 ? "#FF7779" : "#585858" }}>
                {empleado.diasAusencia || 0}
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Tabla de Conceptos */}
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
                {/* Haberes */}
                <TableRow>
                  <TableCell colSpan={2} sx={{ backgroundColor: "#E8F5E9", fontWeight: 600, color: "#4CAF50" }}>
                    HABERES
                  </TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Sueldo Básico</TableCell>
                  <TableCell align="right">{formatMonto(empleado.sueldoBasico)}</TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Antigüedad</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.antiguedad)}</TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>
                    Presentismo
                    {empleado.diasAusencia > 0 && (
                      <Typography component="span" sx={{ fontSize: "0.75rem", color: "#FF7779", ml: 1 }}>
                        (Perdido por ausencia)
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.presentismo)}</TableCell>
                </TableRow>
                {empleado.horasExtras > 0 && (
                  <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                    <TableCell>
                      Horas Extras ({empleado.horasExtras}h)
                    </TableCell>
                    <TableCell align="right">{formatMonto(calcDetalle.horasExtras)}</TableCell>
                  </TableRow>
                )}
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Viáticos (No Remunerativo)</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.viaticos)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "#4CAF50" }}>
                    SUBTOTAL HABERES
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#4CAF50" }}>
                    {formatMonto(haberes)}
                  </TableCell>
                </TableRow>

                {/* Deducciones */}
                <TableRow>
                  <TableCell colSpan={2} sx={{ backgroundColor: "#FFEBEE", fontWeight: 600, color: "#FF7779" }}>
                    DEDUCCIONES
                  </TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Jubilación (11%)</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.jubilacion)}</TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Obra Social (3%)</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.obraSocial)}</TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Ley 19032 (3%)</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.ley19032)}</TableCell>
                </TableRow>
                <TableRow sx={{ "&:hover": { backgroundColor: "#FAFAFA" } }}>
                  <TableCell>Sindicato</TableCell>
                  <TableCell align="right">{formatMonto(calcDetalle.sindicato)}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "1rem", color: "#FF7779" }}>
                    SUBTOTAL DEDUCCIONES
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1rem", color: "#FF7779" }}>
                    {formatMonto(deducciones)}
                  </TableCell>
                </TableRow>

                {/* NETO A PAGAR */}
                <TableRow>
                  <TableCell sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                    NETO A PAGAR
                  </TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700, fontSize: "1.2rem", color: "#FFFFFF", backgroundColor: "#7FC6BA" }}>
                    {formatMonto(neto)}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>

          {/* Notas */}
          <Box sx={{ mt: 2, p: 2, backgroundColor: "#FFF3E0", borderRadius: 2 }}>
            <Typography sx={{ fontSize: "0.85rem", fontWeight: 600, color: "#FFA726", mb: 1 }}>
              Notas del Cálculo:
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#808080" }}>
              • Las horas trabajadas se calculan según registros de fichaje y ausencias.
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#808080" }}>
              • El presentismo se pierde si hay ausencias injustificadas.
            </Typography>
            <Typography sx={{ fontSize: "0.8rem", color: "#808080" }}>
              • Las deducciones se calculan automáticamente según la legislación vigente.
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Footer con Botones de Acción */}
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
        {empleado.estado === "pendiente" && (
          <PrimaryButton
            startIcon={<CalculateIcon />}
            onClick={() => {
              onCalcular(empleado);
              onClose();
            }}
            sx={{ minWidth: 180, py: 1.2 }}
          >
            Calcular Haber
          </PrimaryButton>
        )}
        {empleado.estado === "calculado" && (
          <PrimaryButton
            startIcon={<CheckCircleIcon />}
            onClick={() => {
              onAprobar(empleado);
              onClose();
            }}
            sx={{ minWidth: 180, py: 1.2, bgcolor: "#4CAF50", "&:hover": { bgcolor: "#45A049" } }}
          >
            Aprobar Liquidación
          </PrimaryButton>
        )}
        {empleado.estado === "aprobado" && (
          <Box sx={{ textAlign: "center", py: 1 }}>
            <CheckCircleIcon sx={{ color: "#4CAF50", fontSize: 40, mb: 1 }} />
            <Typography sx={{ color: "#4CAF50", fontWeight: 600 }}>
              Liquidación Aprobada
            </Typography>
          </Box>
        )}
      </Box>
    </Dialog>
  );
}
