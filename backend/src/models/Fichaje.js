import mongoose from "mongoose";

const fichajeSchema = new mongoose.Schema(
  {
    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Fecha del fichaje
    fecha: {
      type: Date,
      required: true,
    },

    // Horarios
    horaEntrada: {
      type: String, // HH:mm formato
      required: true,
      trim: true,
    },
    horaSalida: {
      type: String, // HH:mm formato
      default: null,
      trim: true,
    },

    // Información del fichaje
    estado: {
      type: String,
      enum: ["entrada", "salida", "completo"],
      default: "entrada",
    },

    // Horas trabajadas (calculado)
    horasTrabajadas: {
      type: Number,
      default: 0, // en minutos o horas decimales
    },

    // Observaciones
    notas: {
      type: String,
      default: "",
      trim: true,
    },

    // Lugar de fichaje (si es relevante)
    lugar: {
      type: String,
      default: "Oficina",
      trim: true,
    },

    // Validación de integridad
    verificado: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas rápidas
fichajeSchema.index({ empleadoId: 1, fecha: -1 });
fichajeSchema.index({ empleadoId: 1, estado: 1 });
fichajeSchema.index({ fecha: 1 });

export default mongoose.model("Fichaje", fichajeSchema);
