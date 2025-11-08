/* frontend/src/components/modales/NuevoEmpleadoModal.jsx */
import React, { useState, useEffect } from "react";
import { Box, Stack, Typography } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import { NextButton, SecondaryButton, PrevButton, PrimaryButton } from "../ui/Buttons";
import BaseInput from "../ui/BaseInput";
import SelectInput from "../ui/SelectInput";
import DateField from "../ui/DateField";
import FormCard from "../ui/FormCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const NuevoEmpleadoModal = ({ open, onClose, onEmpleadoGuardado }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Estado para mostrar el próximo número de legajo
  const [nextLegajo, setNextLegajo] = useState("Cargando...");

  // Estado global del formulario
  const initialFormData = {
    nombre: "",
    apellido: "",
    tipoDocumento: "",
    numeroDocumento: "",
    cuil: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    fechaAlta: "",
    areaTrabajo: "",
    puesto: "",
    categoria: "",
    modalidad: "",
    jornada: "",
    horario: "",
    obraSocial: "",
    art: "",
    tipoRemuneracion: "",
    sueldoBruto: "",
    banco: "",
    cbu: "",
    vencimientoContrato: "",
    categoriaImpositiva: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  // Reinicia formulario y pide nuevo legajo cuando se abre el modal
  useEffect(() => {
    if (open) {
      // Resetear campos y paso
      setFormData(initialFormData);
      setStep(1);

      // Pedir el próximo legajo
      const fetchNextLegajo = async () => {
        try {
          const response = await fetch("http://localhost:4000/api/empleados/proximo-legajo");
          const data = await response.json();
          setNextLegajo(data.proximoLegajo || "Error");
        } catch (error) {
          console.error("Error al obtener el próximo legajo:", error);
          setNextLegajo("Error");
        }
      };

      fetchNextLegajo();
    }
  }, [open]);

  // Actualiza cualquier campo
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Enviar datos al backend
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:4000/api/empleados", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Error al registrar empleado");
      }

      const data = await response.json();
      alert("✅ Empleado registrado con éxito");
      console.log("Empleado creado:", data.empleado);

      // Cerrar modal y limpiar datos
      if (onEmpleadoGuardado) onEmpleadoGuardado();
    } catch (error) {
      console.error("Error al registrar empleado:", error);
      alert("❌ Error al registrar el empleado");
    } finally {
      setLoading(false);
    }
  };

  // Render de pasos
  const renderStep = () => {
    switch (step) {
      // STEP 1 — DATOS PERSONALES
      case 1:
        return (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  backgroundColor: "#F2F2F2",
                  ml: 3,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  "&:hover": { backgroundColor: "#E0E0E0" },
                }}
              >
                <AddAPhotoIcon sx={{ fontSize: 40, color: "#7FC6BA" }} />
              </Box>
              <DateField
                label="Fecha de nacimiento"
                value={formData.fechaNacimiento}
                onChange={(e) => handleChange("fechaNacimiento", e.target.value)}
              />
            </Box>

            <FormCard title="Datos personales" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <BaseInput
                  label="Nombre"
                  fullWidth
                  value={formData.nombre}
                  onChange={(e) => handleChange("nombre", e.target.value)}
                />
                <BaseInput
                  label="Apellido"
                  fullWidth
                  value={formData.apellido}
                  onChange={(e) => handleChange("apellido", e.target.value)}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <SelectInput
                    label="Tipo de Documento"
                    options={[
                      { label: "DNI", value: "dni" },
                      { label: "Pasaporte", value: "pasaporte" },
                    ]}
                    value={formData.tipoDocumento}
                    onChange={(e) => handleChange("tipoDocumento", e.target.value)}
                    fullWidth
                  />
                  <BaseInput
                    label="Número"
                    fullWidth
                    value={formData.numeroDocumento}
                    onChange={(e) => handleChange("numeroDocumento", e.target.value)}
                  />
                </Box>

                <BaseInput
                  label="CUIL"
                  fullWidth
                  value={formData.cuil}
                  onChange={(e) => handleChange("cuil", e.target.value)}
                />
                <BaseInput
                  label="Teléfono"
                  fullWidth
                  value={formData.telefono}
                  onChange={(e) => handleChange("telefono", e.target.value)}
                />
                <BaseInput
                  label="Email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                />
              </Stack>
            </FormCard>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <NextButton onClick={() => setStep(2)} endIcon={<ArrowForwardIcon />}>
                Siguiente
              </NextButton>
            </Box>
          </Box>
        );

      // STEP 2 — DATOS LABORALES
      case 2:
        return (
          <Box>
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <DateField
                label="Fecha de Alta"
                value={formData.fechaAlta}
                onChange={(e) => handleChange("fechaAlta", e.target.value)}
              />
            </Box>

            <FormCard title="Datos laborales" sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", gap: 2 }}>
                  <SelectInput
                    label="Área de trabajo"
                    options={[
                      { label: "Carpintería", value: "carpinteria" },
                      { label: "Aserradero", value: "aserradero" },
                      { label: "Instalaciones", value: "instalaciones" },
                      { label: "Administración", value: "administracion" },
                      { label: "Recursos Humanos", value: "rrhh" },
                      { label: "Pintura", value: "pintura" },
                      { label: "Diseño", value: "diseno" },
                    ]}
                    value={formData.areaTrabajo}
                    onChange={(e) => handleChange("areaTrabajo", e.target.value)}
                    fullWidth
                  />
                  <BaseInput
                    label="Puesto o Cargo"
                    fullWidth
                    value={formData.puesto}
                    onChange={(e) => handleChange("puesto", e.target.value)}
                  />
                </Box>

                <BaseInput
                  label="Categoría / Convenio de trabajo"
                  fullWidth
                  value={formData.categoria}
                  onChange={(e) => handleChange("categoria", e.target.value)}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <BaseInput
                    label="Modalidad de contratación"
                    fullWidth
                    value={formData.modalidad}
                    onChange={(e) => handleChange("modalidad", e.target.value)}
                  />
                  <BaseInput
                    label="Jornada laboral"
                    fullWidth
                    value={formData.jornada}
                    onChange={(e) => handleChange("jornada", e.target.value)}
                  />
                </Box>

                <BaseInput
                  label="Horario habitual"
                  fullWidth
                  value={formData.horario}
                  onChange={(e) => handleChange("horario", e.target.value)}
                />

                <Box sx={{ display: "flex", gap: 2 }}>
                  <BaseInput
                    label="Obra social asignada"
                    fullWidth
                    value={formData.obraSocial}
                    onChange={(e) => handleChange("obraSocial", e.target.value)}
                  />
                  <BaseInput
                    label="ART"
                    fullWidth
                    value={formData.art}
                    onChange={(e) => handleChange("art", e.target.value)}
                  />
                </Box>
              </Stack>
            </FormCard>

            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}>
              <PrevButton onClick={() => setStep(1)} startIcon={<ArrowBackIcon />}>
                Anterior
              </PrevButton>
              <NextButton onClick={() => setStep(3)} endIcon={<ArrowForwardIcon />}>
                Siguiente
              </NextButton>
            </Box>
          </Box>
        );

      // STEP 3 — DATOS DE REMUNERACIÓN
      case 3:
        return (
          <Box>
            {/* Nº de legajo */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <Box
                sx={{
                  border: "2px solid #7FC6BA",
                  borderRadius: 2,
                  px: 2,
                  py: 1,
                  width: "fit-content",
                  textAlign: "center",
                }}
              >
                <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                  Nº de Legajo
                </Typography>
                <Typography variant="body1" sx={{ color: "#808080" }}>
                  {nextLegajo}
                </Typography>
              </Box>
            </Box>

            <FormCard title="Datos de remuneración" sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                <Box sx={{ display: "flex", columnGap: 2 }}>
                  <SelectInput
                    label="Tipo de remuneración"
                    options={[
                      { label: "Jornada completa", value: "completa" },
                      { label: "Media jornada", value: "media" },
                      { label: "Por hora", value: "hora" },
                      { label: "Por proyecto", value: "proyecto" },
                    ]}
                    value={formData.tipoRemuneracion}
                    onChange={(e) => handleChange("tipoRemuneracion", e.target.value)}
                    fullWidth
                  />
                  <BaseInput
                    label="Sueldo bruto acordado"
                    type="number"
                    fullWidth
                    value={formData.sueldoBruto}
                    onChange={(e) => handleChange("sueldoBruto", e.target.value)}
                  />
                </Box>

                <Box sx={{ display: "flex", columnGap: 2 }}>
                  <SelectInput
                    label="Banco"
                    options={[
                      { label: "Banco Nación", value: "nacion" },
                      { label: "Banco Provincia", value: "provincia" },
                      { label: "Banco Galicia", value: "galicia" },
                      { label: "Banco Santander", value: "santander" },
                      { label: "Banco BBVA", value: "bbva" },
                    ]}
                    value={formData.banco}
                    onChange={(e) => handleChange("banco", e.target.value)}
                    fullWidth
                  />
                  <BaseInput
                    label="CBU"
                    fullWidth
                    value={formData.cbu}
                    onChange={(e) => handleChange("cbu", e.target.value)}
                  />
                </Box>

                <DateField
                  label="Fecha de vencimiento del contrato"
                  value={formData.vencimientoContrato}
                  onChange={(e) => handleChange("vencimientoContrato", e.target.value)}
                  fullWidth
                />

                <SelectInput
                  label="Categoría impositiva"
                  options={[
                    { label: "Relación de dependencia", value: "dependencia" },
                    { label: "Monotributista", value: "monotributo" },
                    { label: "Autónomo", value: "autonomo" },
                    { label: "Honorarios", value: "honorarios" },
                  ]}
                  value={formData.categoriaImpositiva}
                  onChange={(e) => handleChange("categoriaImpositiva", e.target.value)}
                  fullWidth
                />
              </Stack>
            </FormCard>

            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
              <PrevButton onClick={() => setStep(2)} startIcon={<ArrowBackIcon />} sx={{ minWidth: 40, padding: "6px 6px" }} />
              <Box sx={{ display: "flex", gap: 2 }}>
                <SecondaryButton onClick={onClose} width={120} height={40} fontWeight="bold">
                  Cancelar
                </SecondaryButton>
                <PrimaryButton onClick={handleSubmit} disabled={loading} width={120} height={40} fontWeight="bold">
                  {loading ? "Guardando..." : "Guardar"}
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <ModalCard open={open} onClose={onClose} title="Agregar empleado" width={700}>
      {renderStep()}
    </ModalCard>
  );
};

export default NuevoEmpleadoModal;