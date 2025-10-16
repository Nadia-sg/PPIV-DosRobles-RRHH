// src/pages/empleados/FichaEmpleadoBase.jsx

import React from "react";
import { Box, Stack, Avatar, Typography } from "@mui/material";
import FormCard from "../../components/ui/FormCard";
import BaseInput from "../../components/ui/BaseInput";
import SelectInput from "../../components/ui/SelectInput";
import DateField from "../../components/ui/DateField";
import CloseIcon from "@mui/icons-material/Close";
import { PrimaryButton, CloseButton } from "../../components/ui/Buttons";

const FichaEmpleadoBase = ({ data, readOnly = true, actions = [], onClose}) => {
  const { legajo, nombre, apellido, fechaAlta, foto } = data;

  return (
    <Box sx={{ position: "relative", p: 4 }}>
      {/* === FOTO + BOTONES === */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          ml:4,
          width: "100%",
        }}
      >
        <Avatar src={foto} sx={{ width: 100, height: 100 }} />

        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mr: 8 }}>
          {actions.map((btn, i) => (
            <PrimaryButton key={i} onClick={btn.onClick} {...btn.props}>
              {btn.label}
            </PrimaryButton>
          ))}
        </Box>
      </Box>

      {/* Info inicial */}
      <Box sx={{ display: "flex", mb: 1, ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 120 }}>Nº de Legajo:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2, ml: 4 }}>{legajo}</Box>
      </Box>
      <Box sx={{ display: "flex", mb: 1, ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 150 }}>Nombre y Apellido:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2 }}>
          {nombre} {apellido}
        </Box>
      </Box>
      <Box sx={{ display: "flex", ml: 4, color: "#808080" }}>
        <Typography sx={{ width: 120 }}>Fecha de Alta:</Typography>
        <Box sx={{ border: "1px solid #ccc", px: 2, borderRadius: 2, ml: 4 }}>{fechaAlta}</Box>
      </Box>

      {/* === FORMULARIO STEP1 - Datos Personales === */}
      <FormCard title="Datos Personales" sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <BaseInput label="Nombre" value={data.nombre} readOnly={readOnly} />
          <BaseInput label="Apellido" value={data.apellido} readOnly={readOnly} />
          <BaseInput label="CUIL" value={data.cuil} readOnly={readOnly} />
          <BaseInput label="Teléfono" value={data.telefono} readOnly={readOnly} />
          <BaseInput label="Email" value={data.email} readOnly={readOnly} />
        </Stack>
      </FormCard>

      {/* === FORMULARIO STEP2 - Datos Laborales === */}
      <FormCard title="Datos Laborales" sx={{ mb: 2 }}>
        <Stack spacing={2}>
          <BaseInput label="Área de trabajo" value={data.area} readOnly={readOnly} />
          <BaseInput label="Puesto/Cargo" value={data.puesto} readOnly={readOnly} />
          <BaseInput label="Categoría / Convenio" value={data.categoria} readOnly={readOnly} />
          <BaseInput label="Modalidad" value={data.modalidad} readOnly={readOnly} />
          <BaseInput label="Jornada" value={data.jornada} readOnly={readOnly} />
          <BaseInput label="Horario habitual" value={data.horario} readOnly={readOnly} />
          <BaseInput label="Obra Social / ART" value={data.obraSocial} readOnly={readOnly} />
        </Stack>
      </FormCard>

      {/* === FORMULARIO STEP3 - Datos de Remuneración === */}
      <FormCard title="Datos de Remuneración">
        <Stack spacing={2}>
          <BaseInput label="Tipo de remuneración" value={data.tipoRemuneracion} readOnly={readOnly} />
          <BaseInput label="Sueldo bruto" value={data.sueldo} readOnly={readOnly} />
          <BaseInput label="Banco" value={data.banco} readOnly={readOnly} />
          <BaseInput label="CBU" value={data.cbu} readOnly={readOnly} />
          <DateField label="Fecha de vencimiento contrato" value={data.vencimientoContrato} readOnly={readOnly} />
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
          />
        </Stack>
      </FormCard>
    </Box>
  );
};

export default FichaEmpleadoBase;
