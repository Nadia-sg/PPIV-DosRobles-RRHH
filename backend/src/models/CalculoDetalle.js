import mongoose from "mongoose";

const calculoDetalleSchema = new mongoose.Schema(
  {
    // Referencia a la nómina
    nominaId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nomina",
      required: true,
    },

    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Tipo de concepto
    tipoConcepto: {
      type: String,
      enum: ["remunerativo", "no_remunerativo", "deduccion"],
      required: true,
    },

    // Nombre del concepto
    concepto: {
      type: String,
      required: true,
      trim: true,
    },

    // Valores del concepto
    cantidad: {
      type: Number,
      required: true,
      default: 1,
    },
    valorUnitario: {
      type: Number,
      required: true,
      default: 0,
    },
    totalConcepto: {
      type: Number,
      required: true,
      default: 0,
    },

    // Descripción (opcional)
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    // Orden de visualización
    orden: {
      type: Number,
      default: 0,
    },

    // Aplicable (si está activo o no)
    activo: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
calculoDetalleSchema.index({ nominaId: 1 });
calculoDetalleSchema.index({ empleadoId: 1, nominaId: 1 });
calculoDetalleSchema.index({ tipoConcepto: 1 });

export default mongoose.model("CalculoDetalle", calculoDetalleSchema);
