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
  const [nuevaFoto, setNuevaFoto] = useState(null);

  // Cargar datos del empleado
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
            foto:
              data._id
                ? `http://localhost:4000/api/empleados/${data._id}/imagen?${Date.now()}`
                : "/src/assets/empleados/default-avatar.png",
          };

          setEmpleadoData(empleadoFormateado);
          setOriginalData(empleadoFormateado);
          setNuevaFoto(null);
        } catch (error) {
          console.error("❌ Error al cargar empleado:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchEmpleado();
    }
  }, [open, empleado]);

  // Maneja cambios de campos
  const handleChange = (field, value) => {
    setEmpleadoData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Maneja cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNuevaFoto(file);
      const previewURL = URL.createObjectURL(file);
      setEmpleadoData((prev) => ({ ...prev, foto: previewURL }));
    }
  };

  // Guardar cambios (un solo FormData)
  const handleSave = async () => {
    if (!empleadoData?._id) return;

    try {
      setSaving(true);

      // Creamos un FormData
      const formData = new FormData();
      for (const [key, value] of Object.entries(empleadoData)) {
        // no agregamos la URL de la imagen como texto
        if (key !== "foto") {
          formData.append(key, value || "");
        }
      }

      // Si hay una nueva imagen
      if (nuevaFoto) {
        formData.append("imagenPerfil", nuevaFoto);
      }

      // PUT al backend
      const res = await fetch(`http://localhost:4000/api/empleados/${empleadoData._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) throw new Error("Error al guardar cambios");
      const result = await res.json();

      alert("✅ Cambios guardados correctamente");

      // Refrescar datos (para ver la nueva imagen)
      const refreshed = await fetch(`http://localhost:4000/api/empleados/${empleadoData._id}`);
      const updated = await refreshed.json();

      const empleadoActualizado = {
        ...empleadoData,
        ...updated,
        foto: `http://localhost:4000/api/empleados/${empleadoData._id}/imagen?${Date.now()}`,
      };

      setEmpleadoData(empleadoActualizado);
      setOriginalData(empleadoActualizado);
      setEditMode(false);
      setNuevaFoto(null);
    } catch (error) {
      console.error("❌ Error al guardar cambios:", error);
      alert("Error al guardar los cambios");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEmpleadoData(originalData);
    setEditMode(false);
    setNuevaFoto(null);
  };

  const actions = editMode
    ? [
        {
          label: saving ? "Guardando..." : "Guardar cambios",
          onClick: handleSave,
          variant: "contained",
          disabled: saving,
        },
        { label: "Cancelar", onClick: handleCancel, variant: "outlined" },
      ]
    : [
        { label: "Editar", onClick: () => setEditMode(true), variant: "contained" },
        { label: "Enviar Mensaje", onClick: () => console.log("Mensaje"), variant: "outlined" },
        { label: "Asignar Tarea", onClick: () => console.log("Asignar tarea"), variant: "outlined" },
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
          onImageChange={handleImageChange}
        />
      ) : (
        <Box sx={{ p: 3, textAlign: "center" }}>No se pudo cargar la información del empleado.</Box>
      )}
    </ModalCard>
  );
};

export default FichaEmpleadoEditable;
