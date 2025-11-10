// src/pages/empleados/FichaEmpleadoEditable.jsx

import React, { useEffect, useState } from "react";
import ModalCard from "../../components/ui/ModalCard";
import FichaEmpleadoBase from "./FichaEmpleadoBase";
import { CircularProgress, Box } from "@mui/material";

const FichaEmpleadoEditable = ({ open, onClose, empleado }) => {
  const [empleadoData, setEmpleadoData] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  // Obtener datos del empleado
  useEffect(() => {
    if (open && empleado?._id) {
      const fetchEmpleado = async () => {
        try {
          setLoading(true);
          const res = await fetch(`http://localhost:4000/api/empleados/${empleado._id}`);
          if (!res.ok) throw new Error("Error al obtener empleado");
          const data = await res.json();

          const empleadoFormateado = {
            _id: data._id,
            legajo: data.numeroLegajo || "-",
            nombre: data.nombre || "",
            apellido: data.apellido || "",
            fechaAlta: data.fechaAlta || "",
            cuil: data.cuil || "",
            telefono: data.telefono || "",
            email: data.email || "",
            area: data.areaTrabajo || "",
            puesto: data.puesto || "",
            categoria: data.categoria || "",
            modalidad: data.modalidad || "",
            jornada: data.jornada || "",
            horario: data.horario || "",
            obraSocial: data.obraSocial || "",
            tipoRemuneracion: data.tipoRemuneracion || "",
            sueldo: data.sueldoBruto || "",
            banco: data.banco || "",
            cbu: data.cbu || "",
            vencimientoContrato: data.vencimientoContrato || "",
            categoriaImpositiva: data.categoriaImpositiva || "",
            foto: data._id
              ? `http://localhost:4000/api/empleados/${data._id}/imagen`
              : "/src/assets/empleados/default-avatar.png",
          };

          setEmpleadoData(empleadoFormateado);
          setOriginalData(empleadoFormateado);
        } catch (error) {
          console.error("❌ Error al cargar empleado:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEmpleado();
    }
  }, [open, empleado]);

  // Maneja cambios en campos del formulario
  const handleChange = (field, value) => {
    setEmpleadoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Guardar cambios (PUT al backend)
  const handleSave = async () => {
    if (!empleadoData?._id) return;
    try {
      setSaving(true);
      const response = await fetch(`http://localhost:4000/api/empleados/${empleadoData._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empleadoData),
      });

      if (!response.ok) throw new Error("Error al actualizar el empleado");

      const updated = await response.json();
      alert("✅ Cambios guardados correctamente");

      const newData = updated.empleado;
      setEmpleadoData(newData);
      setOriginalData(newData);
      setEditMode(false);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  // Cancelar edición
  const handleCancel = () => {
    setEmpleadoData(originalData);
    setEditMode(false);
  };

  // Botones inferiores
  const actions = editMode
    ? [
        {
          label: saving ? "Guardando..." : "Guardar cambios",
          onClick: handleSave,
          variant: "contained",
          disabled: saving,
        },
        {
          label: "Cancelar",
          onClick: handleCancel,
          variant: "outlined",
        },
      ]
    : [
        {
          label: "Editar",
          onClick: () => setEditMode(true),
          variant: "contained",
        },
        {
          label: "Enviar Mensaje",
          onClick: () => console.log("Mensaje"),
          variant: "outlined",
        },
        {
          label: "Asignar Tarea",
          onClick: () => console.log("Asignar tarea"),
          variant: "outlined",
        },
      ];

  if (!open) return null;

  return (
    <ModalCard
      open={open}
      onClose={onClose}
      title="Ficha del Empleado"
      width={1000}
      actions={actions}
    >
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : empleadoData ? (
        <FichaEmpleadoBase
          data={empleadoData}
          readOnly={!editMode}
          onChange={handleChange}
        />
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>
          No se pudo cargar la información del empleado.
        </Box>
      )}
    </ModalCard>
  );
};

export default FichaEmpleadoEditable;
