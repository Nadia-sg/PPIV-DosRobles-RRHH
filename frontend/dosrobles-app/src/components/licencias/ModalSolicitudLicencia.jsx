// src/components/licencias/ModalSolicitudLicencia.jsx
// Modal para que el empleado solicite una nueva licencia

import { useState, useImperativeHandle, forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/es";
import ModalCard from "../ui/ModalCard";
import SelectInput from "../ui/SelectInput";
import TextareaInput from "../ui/TextareaInput";
import ModalConfirmacion from "./ModalConfirmacion";

dayjs.locale("es");

const ModalSolicitudLicencia = forwardRef(function ModalSolicitudLicencia({ open, onClose, onSubmit }, ref) {
  const [formData, setFormData] = useState({
    tipoLicencia: "",
    fechaInicio: null,
    fechaFin: null,
    motivo: "",
  });

  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);

  // Exponer función reset al componente padre a través de ref
  useImperativeHandle(ref, () => ({
    resetForm: () => {
      setFormData({
        tipoLicencia: "",
        fechaInicio: null,
        fechaFin: null,
        motivo: "",
      });
    },
  }));

  // Opciones de tipo de ausencia según el diseño
  const tiposLicencia = [
    { label: "Vacaciones", value: "vacaciones" },
    { label: "Enfermedad", value: "enfermedad" },
    { label: "Asuntos personales", value: "asuntos_personales" },
    { label: "Capacitación", value: "capacitacion" },
    { label: "Licencia médica", value: "licencia_medica" },
    { label: "Otro", value: "otro" },
  ];

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    // Validación básica
    if (!formData.tipoLicencia || !formData.fechaInicio || !formData.fechaFin) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Validar que fecha inicio sea anterior a fecha fin
    if (formData.fechaInicio.isAfter(formData.fechaFin)) {
      alert("La fecha de inicio debe ser anterior a la fecha de fin");
      return;
    }

    // Convertir fechas al formato ISO (YYYY-MM-DD)
    const fechaInicioConvertida = formData.fechaInicio.format("YYYY-MM-DD");
    const fechaFinConvertida = formData.fechaFin.format("YYYY-MM-DD");

    // Enviar datos al componente padre
    // El componente padre es responsable de cerrar el modal y mostrar confirmación
    onSubmit({
      tipoLicencia: formData.tipoLicencia,
      fechaInicio: fechaInicioConvertida,
      fechaFin: fechaFinConvertida,
      motivo: formData.motivo,
      estado: "pendiente",
      fechaSolicitud: dayjs().format("YYYY-MM-DD"),
    });
  };

  const handleCancel = () => {
    // Resetear formulario y cerrar
    setFormData({
      tipoLicencia: "",
      fechaInicio: null,
      fechaFin: null,
      motivo: "",
    });
    onClose();
  };

  return (
    <>
    <ModalCard
      open={open}
      onClose={handleCancel}
      title="Solicitud de ausencia"
      width={620}
      actions={[
        {
          label: "Cancelar",
          variant: "outlined",
          onClick: handleCancel,
        },
        {
          label: "Enviar",
          variant: "contained",
          onClick: handleSubmit,
        },
      ]}
    >
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
          {/* Tipo de ausencia */}
          <SelectInput
            label="Tipo de ausencia"
            value={formData.tipoLicencia}
            onChange={(e) => handleChange("tipoLicencia", e.target.value)}
            options={tiposLicencia}
            placeholder="Selecciona el tipo de ausencia"
          />

          {/* Fechas en una fila */}
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Fecha de Inicio */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.9rem", color: "#808080", fontWeight: 600, mb: 1 }}>
                Inicia
              </Typography>
              <DatePicker
                value={formData.fechaInicio}
                onChange={(date) => handleChange("fechaInicio", date)}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#FFFFFF",
                      },
                    },
                  },
                }}
              />
            </Box>

            {/* Fecha de Fin */}
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontSize: "0.9rem", color: "#808080", fontWeight: 600, mb: 1 }}>
                Termina
              </Typography>
              <DatePicker
                value={formData.fechaFin}
                onChange={(date) => handleChange("fechaFin", date)}
                minDate={formData.fechaInicio}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    sx: {
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "6px",
                        backgroundColor: "#FFFFFF",
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          {/* Comentario */}
          <TextareaInput
            label="Comentario (opcional)"
            placeholder="Ingresa un comentario..."
            value={formData.motivo}
            onChange={(e) => handleChange("motivo", e.target.value)}
            maxLength={300}
          />
        </Box>
      </LocalizationProvider>
    </ModalCard>

    {/* Modal de Confirmación */}
    <ModalConfirmacion
      open={modalConfirmacionOpen}
      onClose={() => setModalConfirmacionOpen(false)}
      mensaje="Su solicitud ha sido enviada para revisión"
    />
    </>
  );
});

export default ModalSolicitudLicencia;