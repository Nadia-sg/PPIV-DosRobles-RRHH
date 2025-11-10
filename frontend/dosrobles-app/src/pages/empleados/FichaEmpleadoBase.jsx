// src/pages/empleados/FichaEmpleadoBase.jsx

import React, { useRef } from "react";
import { Box, Stack, Avatar, Typography, IconButton } from "@mui/material";
import { PhotoCamera } from "@mui/icons-material";
import FormCard from "../../components/ui/FormCard";
import BaseInput from "../../components/ui/BaseInput";
import SelectInput from "../../components/ui/SelectInput";
import DateField from "../../components/ui/DateField";
import { PrimaryButton } from "../../components/ui/Buttons";

const FichaEmpleadoBase = ({
  data,
  readOnly = true,
  actions = [],
  onChange,
  onImageChange, 
}) => {
  const fileInputRef = useRef(null);

  // Maneja click sobre el avatar o el ícono de cámara
  const handleImageClick = () => {
    if (!readOnly) {
      fileInputRef.current?.click();
    }
  };

  // Si no se pasa onImageChange (modo lectura), no hace nada
  const handleImageChange = (e) => {
    if (onImageChange) {
      onImageChange(e);
    }
  };

  // Determina qué imagen mostrar:
  const fotoURL =
    data.fotoPreview ||
    data.foto ||
    "/src/assets/empleados/default-avatar.png";

  return (
    <Box sx={{ position: "relative", p: 4 }}>
      {/* === FOTO + BOTONES === */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          ml: 4,
          width: "100%",
        }}
      >
        <Box sx={{ position: "relative", display: "inline-block" }}>
          <Avatar
            src={fotoURL}
            sx={{
              width: 100,
              height: 100,
              cursor: readOnly ? "default" : "pointer",
              border: readOnly ? "none" : "2px dashed #7FC6BA",
            }}
            onClick={handleImageClick}
          />
          {!readOnly && (
            <IconButton
              sx={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#7FC6BA",
                color: "white",
                "&:hover": { backgroundColor: "#5FA89A" },
              }}
              onClick={handleImageClick}
            >
              <PhotoCamera />
            </IconButton>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange} 
            style={{ display: "none" }}
          />
        </Box>

        {/* === BOTONES DE ACCIÓN (editar, guardar, etc.) === */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mr: 8 }}>
          {actions.map((btn, i) => (
            <PrimaryButton key={i} onClick={btn.onClick} {...btn.props}>
              {btn.label}
            </PrimaryButton>
          ))}
        </Box>
      </Box>

      {/* === INFO INICIAL === */}
      <Box sx={{ display: "flex", mb: 1, ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 120 }}>Nº de Legajo:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2, ml: 4 }}>
          {data.legajo}
        </Box>
      </Box>

      <Box sx={{ display: "flex", mb: 1, ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 150 }}>Nombre y Apellido:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2 }}>
          {data.nombre} {data.apellido}
        </Box>
      </Box>

      <Box sx={{ display: "flex", ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 120 }}>Fecha de Alta:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2, ml: 4 }}>
          {data.fechaAlta
            ? new Date(data.fechaAlta).toLocaleDateString("es-AR")
            : "-"}
        </Box>
      </Box>

      {/* === FORMULARIO STEP1 - Datos Personales === */}
      <FormCard title="Datos Personales" sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <BaseInput
            label="Nombre"
            value={data.nombre}
            readOnly={readOnly}
            onChange={(e) => onChange("nombre", e.target.value)}
          />
          <BaseInput
            label="Apellido"
            value={data.apellido}
            readOnly={readOnly}
            onChange={(e) => onChange("apellido", e.target.value)}
          />
          <BaseInput
            label="CUIL"
            value={data.cuil}
            readOnly={readOnly}
            onChange={(e) => onChange("cuil", e.target.value)}
          />
          <BaseInput
            label="Teléfono"
            value={data.telefono}
            readOnly={readOnly}
            onChange={(e) => onChange("telefono", e.target.value)}
          />
          <BaseInput
            label="Email"
            value={data.email}
            readOnly={readOnly}
            onChange={(e) => onChange("email", e.target.value)}
          />
        </Stack>
      </FormCard>

      {/* === FORMULARIO STEP2 - Datos Laborales === */}
      <FormCard title="Datos Laborales" sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <BaseInput
            label="Área de trabajo"
            value={data.area}
            readOnly={readOnly}
            onChange={(e) => onChange("area", e.target.value)}
          />
          <BaseInput
            label="Puesto/Cargo"
            value={data.puesto}
            readOnly={readOnly}
            onChange={(e) => onChange("puesto", e.target.value)}
          />
          <BaseInput
            label="Categoría / Convenio"
            value={data.categoria}
            readOnly={readOnly}
            onChange={(e) => onChange("categoria", e.target.value)}
          />
          <BaseInput
            label="Modalidad"
            value={data.modalidad}
            readOnly={readOnly}
            onChange={(e) => onChange("modalidad", e.target.value)}
          />
          <BaseInput
            label="Jornada"
            value={data.jornada}
            readOnly={readOnly}
            onChange={(e) => onChange("jornada", e.target.value)}
          />
          <BaseInput
            label="Horario habitual"
            value={data.horario}
            readOnly={readOnly}
            onChange={(e) => onChange("horario", e.target.value)}
          />
          <BaseInput
            label="Obra Social / ART"
            value={data.obraSocial}
            readOnly={readOnly}
            onChange={(e) => onChange("obraSocial", e.target.value)}
          />
        </Stack>
      </FormCard>

      {/* === FORMULARIO STEP3 - Datos de Remuneración === */}
      <FormCard title="Datos de Remuneración">
        <Stack spacing={2}>
          <BaseInput
            label="Tipo de remuneración"
            value={data.tipoRemuneracion}
            readOnly={readOnly}
            onChange={(e) => onChange("tipoRemuneracion", e.target.value)}
          />
          <BaseInput
            label="Sueldo bruto"
            value={data.sueldo}
            readOnly={readOnly}
            onChange={(e) => onChange("sueldo", e.target.value)}
          />
          <BaseInput
            label="Banco"
            value={data.banco}
            readOnly={readOnly}
            onChange={(e) => onChange("banco", e.target.value)}
          />
          <BaseInput
            label="CBU"
            value={data.cbu}
            readOnly={readOnly}
            onChange={(e) => onChange("cbu", e.target.value)}
          />
          <DateField
            label="Fecha de vencimiento contrato"
            value={data.vencimientoContrato}
            readOnly={readOnly}
            onChange={(e) => onChange("vencimientoContrato", e.target.value)}
          />
          <SelectInput
            label="Categoría impositiva"
            value={data.categoriaImpositiva}
            options={[
              { label: "Dependencia", value: "dependencia" },
              { label: "Monotributista", value: "monotributo" },
              { label: "Autónomo", value: "autonomo" },
              { label: "Honorarios", value: "honorarios" },
            ]}
            readOnly={readOnly}
            onChange={(e) => onChange("categoriaImpositiva", e.target.value)}
          />
        </Stack>
      </FormCard>
    </Box>
  );
};

export default FichaEmpleadoBase;
