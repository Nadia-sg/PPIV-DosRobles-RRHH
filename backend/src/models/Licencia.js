import mongoose from "mongoose";

const licenciaSchema = new mongoose.Schema(
  {
    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Tipo de licencia
    tipoLicencia: {
      type: String,
      enum: [
        "vacaciones",
        "enfermedad",
        "asuntos_personales",
        "capacitacion",
        "licencia_medica",
        "examen",
        "cita_medica",
        "ausencia_justificada",
        "razones_particulares",
        "otro",
      ],
      required: true,
    },

    // Fechas de la solicitud
    fechaSolicitud: {
      type: Date,
      required: true,
      default: () => new Date(),
    },
    fechaInicio: {
      type: Date,
      required: true,
    },
    fechaFin: {
      type: Date,
      required: true,
    },

    // Información de la licencia
    motivo: {
      type: String,
      default: "",
      trim: true,
    },
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    // Estado de la solicitud
    estado: {
      type: String,
      enum: ["pendiente", "aprobado", "rechazado", "cancelado"],
      default: "pendiente",
    },

    // Datos de aprobación/rechazo (solo gerente)
    gerenteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      default: null,
    },
    fechaResolucion: {
      type: Date,
      default: null,
    },
    comentarioGerente: {
      type: String,
      default: "",
      trim: true,
    },

    // Información de documentación
    documentoAdjunto: {
      type: String, // URL del documento
      default: null,
    },

    // Cantidad de días (calculado automáticamente)
    diasTotales: {
      type: Number,
      default: 0,
    },

    // Validación de solapamiento (para evitar duplicados)
    activa: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas rápidas
licenciaSchema.index({ empleadoId: 1, estado: 1 });
licenciaSchema.index({ empleadoId: 1, fechaInicio: 1, fechaFin: 1 });
licenciaSchema.index({ estado: 1, fechaSolicitud: -1 });

export default mongoose.model("Licencia", licenciaSchema);
