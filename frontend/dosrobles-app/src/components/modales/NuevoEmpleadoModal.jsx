import React, { useState } from "react";
import { Box, Stack, Typography, Avatar, Grid } from "@mui/material";
import ModalCard from "../ui/ModalCard";
import { NextButton, SecondaryButton, PrevButton,PrimaryButton } from "../ui/Buttons";
import BaseInput from "../ui/BaseInput";
import SelectInput from "../ui/SelectInput";
import DateField from "../ui/DateField";
import FormCard from "../ui/FormCard";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";

const NuevoEmpleadoModal = ({ open, onClose }) => {
  const [step, setStep] = useState(1);

  const renderStep = () => {
    switch (step) {
      // STEP 1 — DATOS PERSONALES
      case 1:
        return (
          <Box>
            {/* Imagen + Fecha */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              {/* Círculo con ícono */}
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

              {/* Fecha de nacimiento */}
              <DateField label="Fecha de nacimiento" />
            </Box>

            {/* Tarjeta del formulario */}
            <FormCard title="Datos personales" sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* Nombre */}
                <BaseInput label="Nombre" fullWidth />

                {/* Apellido */}
                <BaseInput label="Apellido" fullWidth />

                {/* Tipo de Documento + Número */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <SelectInput
                      label="Tipo de Documento"
                      options={[
                        { label: "DNI", value: "dni" },
                        { label: "Pasaporte", value: "pasaporte" },
                      ]}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="Número" fullWidth />
                  </Box>
                </Box>
                {/* CUIL */}
                <BaseInput label="CUIL" fullWidth />

                {/* Teléfono */}
                <BaseInput label="Teléfono" fullWidth />

                {/* Email */}
                <BaseInput label="Email" fullWidth />
              </Stack>
            </FormCard>
            {/* Botón siguiente */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <NextButton
                onClick={() => setStep(2)}
                endIcon={<ArrowForwardIcon />}
              >
                Siguiente
              </NextButton>
            </Box>
          </Box>
        );

      //  STEP 2 — DATOS LABORALES

      case 2:
        return (
          <Box>
            {/* Fecha alta */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
              <DateField label="Fecha de Alta" />
            </Box>

            {/* Formulario dentro de tarjeta */}
            <FormCard title="Datos laborales" sx={{ p: 3 }}>
              <Stack spacing={2}>
                {/* Área de trabajo / Puesto */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
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
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="Puesto o Cargo" fullWidth />
                  </Box>
                </Box>

                {/* Categoría */}
                <BaseInput label="Categoría / Convenio de trabajo" fullWidth />

                {/* Modalidad / Jornada */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="Modalidad de contratación" fullWidth />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="Jornada laboral" fullWidth />
                  </Box>
                </Box>

                {/* Horario habitual */}
                <BaseInput label="Horario habitual" fullWidth />

                {/* Obra social / ART */}
                <Box sx={{ display: "flex", gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="Obra social asignada" fullWidth />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="ART" fullWidth />
                  </Box>
                </Box>
              </Stack>
            </FormCard>
            {/*  Botones de navegación */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 2,
              }}
            >
              <PrevButton
                onClick={() => setStep(1)}
                startIcon={<ArrowBackIcon />}
              >
                Anterior
              </PrevButton>
              <NextButton
                onClick={() => setStep(3)}
                endIcon={<ArrowForwardIcon />}
              >
                Siguiente
              </NextButton>
            </Box>
          </Box>
        );

      // STEP 3 — DATOS DE REMUNERACIÓN (FINAL)

      case 3:
        return (
          <Box>
            {/* Nº de legajo arriba a la derecha */}
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
                <Typography variant="body1" sx={{ color:"#808080"}}>
                  000123
                </Typography>
              </Box>
            </Box>

            {/* Formulario dentro de FormCard */}
            <FormCard title="Datos de remuneración" sx={{ p: 3 }}>
              <Stack spacing={2.5}>
                {/* Tipo de remuneración / Sueldo bruto */}
                <Box sx={{ display: "flex", columnGap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <SelectInput
                      label="Tipo de remuneración"
                      options={[
                        { label: "Jornada completa", value: "completa" },
                        { label: "Media jornada", value: "media" },
                        { label: "Por hora", value: "hora" },
                        { label: "Por proyecto", value: "proyecto" },
                      ]}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput
                      label="Sueldo bruto acordado"
                      type="number"
                      fullWidth
                    />
                  </Box>
                </Box>

                {/* Banco / CBU */}
                <Box sx={{ display: "flex", columnGap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <SelectInput
                      label="Banco"
                      options={[
                        { label: "Banco Nación", value: "nacion" },
                        { label: "Banco Provincia", value: "provincia" },
                        { label: "Banco Galicia", value: "galicia" },
                        { label: "Banco Santander", value: "santander" },
                        { label: "Banco BBVA", value: "bbva" },
                      ]}
                      fullWidth
                    />
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <BaseInput label="CBU" fullWidth />
                  </Box>
                </Box>

                {/* Fecha de vencimiento del contrato */}
                <DateField
                  label="Fecha de vencimiento del contrato"
                  fullWidth
                />

                {/* Categoría impositiva */}
                <SelectInput
                  label="Categoría impositiva"
                  options={[
                    { label: "Relación de dependencia", value: "dependencia" },
                    { label: "Monotributista", value: "monotributo" },
                    { label: "Autónomo", value: "autonomo" },
                    { label: "Honorarios", value: "honorarios" },
                  ]}
                  fullWidth
                />
              </Stack>
            </FormCard>

            {/* Botones de acción */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              {/* Botón "Anterior" */}
              <PrevButton
                onClick={() => setStep(2)}
                startIcon={<ArrowBackIcon />}
                sx={{ minWidth: 40, padding: "6px 6px" }}
              />

              {/* Botones Cancelar / Guardar centrados */}
              <Box sx={{ display: "flex", gap: 2 }}>
                <SecondaryButton onClick={onClose}width={120} 
                  height={40} 
                  fontWeight="bold" 
                >Cancelar</SecondaryButton>
                <PrimaryButton
                  onClick={() => {
                    console.log("Empleado guardado!");
                    onClose();
                  }}
                  width={120} 
                  height={40} 
                  fontWeight="bold" 
                >
                  Guardar
                </PrimaryButton>
              </Box>
            </Box>
          </Box>
        );
    }
  };

  return (
    <ModalCard
      open={open}
      onClose={onClose}
      title="Agregar empleado"
      width={700}
    >
      {renderStep()}
    </ModalCard>
  );
};

export default NuevoEmpleadoModal;