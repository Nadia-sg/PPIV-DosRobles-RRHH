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

  // Guardar cambios
  const handleSave = async () => {
    if (!empleadoData?._id) return;

    try {
      setSaving(true);
      const formData = new FormData();
      for (const [key, value] of Object.entries(empleadoData)) {
        if (key !== "foto") {
          formData.append(key, value || "");
        }
      }
      if (nuevaFoto) formData.append("imagenPerfil", nuevaFoto);

      const res = await fetch(
        `http://localhost:4000/api/empleados/${empleadoData._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (!res.ok) throw new Error("Error al guardar cambios");

      alert("Cambios guardados correctamente");
      
      // Refrescar los datos del empleado para ver la nueva imagen
      const refreshed = await fetch(
        `http://localhost:4000/api/empleados/${empleadoData._id}`
      );
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

  // 🔹 Cancelar edición
  const handleCancel = () => {
    setEmpleadoData(originalData);
    setEditMode(false);
    setNuevaFoto(null);
  };

  // 🔹 Eliminar empleado con confirmación
  const handleDelete = async () => {
    if (!empleadoData?._id) return;

    const confirmar = window.confirm(
      `¿Estás seguro de que deseas eliminar al empleado ${empleadoData.nombre} ${empleadoData.apellido}?`
    );

    if (!confirmar) return;

    try {
      const res = await fetch(
        `http://localhost:4000/api/empleados/${empleadoData._id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) throw new Error("Error al eliminar empleado");

      alert("Empleado eliminado correctamente");
      onClose(); // Cerramos la ficha
      window.location.reload(); // Refresca la página para actualizar la lista
    } catch (error) {
      console.error("❌ Error al eliminar empleado:", error);
      alert("Error al eliminar el empleado");
    }
  };

  // Botones del modal
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
          label: "Eliminar empleado",
          onClick: handleDelete,
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
          onImageChange={handleImageChange}
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

