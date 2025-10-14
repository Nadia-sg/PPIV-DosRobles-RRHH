// src/components/licencias/ModalSolicitudLicencia.jsx
// Modal para que el empleado solicite una nueva licencia

import { useState } from "react";
import { Box } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import SelectInput from "../ui/SelectInput";
import DateField from "../ui/DateField";
import TextareaInput from "../ui/TextareaInput";
import ModalConfirmacion from "./ModalConfirmacion";

export default function ModalSolicitudLicencia({ open, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tipoLicencia: "",
    fechaInicio: "",
    fechaFin: "",
    motivo: "",
  });

  const [modalConfirmacionOpen, setModalConfirmacionOpen] = useState(false);

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

    // Enviar datos al componente padre
    onSubmit({
      ...formData,
      estado: "pendiente",
      fechaSolicitud: new Date().toISOString().split("T")[0],
    });

    // Cerrar modal de solicitud y mostrar confirmación
    onClose();
    setModalConfirmacionOpen(true);

    // Resetear formulario
    setFormData({
      tipoLicencia: "",
      fechaInicio: "",
      fechaFin: "",
      motivo: "",
    });
  };

  const handleCancel = () => {
    // Resetear formulario y cerrar
    setFormData({
      tipoLicencia: "",
      fechaInicio: "",
      fechaFin: "",
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
            <DateField
              label="Inicia"
              value={formData.fechaInicio}
              onClick={() => {
                // En producción, esto abriría un date picker
                const fecha = prompt("Ingresa la fecha de inicio (DD/MM/YYYY):");
                if (fecha) handleChange("fechaInicio", fecha);
              }}
            />
          </Box>

          {/* Fecha de Fin */}
          <Box sx={{ flex: 1 }}>
            <DateField
              label="Termina"
              value={formData.fechaFin}
              onClick={() => {
                const fecha = prompt("Ingresa la fecha de fin (DD/MM/YYYY):");
                if (fecha) handleChange("fechaFin", fecha);
              }}
            />
          </Box>
        </Box>

        {/* Comentario */}
        <TextareaInput
          label="Comentario"
          placeholder="Ingresa un comentario..."
          value={formData.motivo}
          onChange={(e) => handleChange("motivo", e.target.value)}
          maxLength={300}
        />
      </Box>
    </ModalCard>

    {/* Modal de Confirmación */}
    <ModalConfirmacion
      open={modalConfirmacionOpen}
      onClose={() => setModalConfirmacionOpen(false)}
      mensaje="Su solicitud ha sido enviada para revisión"
    />
    </>
  );
}