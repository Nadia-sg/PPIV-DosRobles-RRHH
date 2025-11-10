import mongoose from "mongoose";

const nominaSchema = new mongoose.Schema(
  {
    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Período de nómina (formato: YYYY-MM, ej: 2025-10)
    periodo: {
      type: String,
      required: true,
      match: /^\d{4}-\d{2}$/,
    },

    // Estado del cálculo
    estado: {
      type: String,
      enum: ["pendiente", "calculado", "aprobado"],
      default: "pendiente",
    },

    // Información de aprobación
    aprobadoPor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      default: null,
    },
    fechaAprobacion: {
      type: Date,
      default: null,
    },

    // Información del período de trabajo
    diasTrabajados: {
      type: Number,
      required: true,
      default: 0,
    },
    diasAusencia: {
      type: Number,
      required: true,
      default: 0,
    },
    horasTrabajadas: {
      type: Number,
      required: true,
      default: 0,
    },
    horasExtras: {
      type: Number,
      required: true,
      default: 0,
    },

    // Sueldos base
    sueldoBasico: {
      type: Number,
      required: true,
      default: 0,
    },

    // Haberes (ingresos)
    haberes: {
      sueldoBasico: Number,
      antiguedad: Number,
      presentismo: Number,
      horasExtras: Number,
      viaticos: Number,
      otrosHaberes: Number,
      totalHaberes: Number,
    },

    // Deducciones (descuentos)
    deducciones: {
      jubilacion: Number,
      obraSocial: Number,
      ley19032: Number,
      sindicato: Number,
      otrosDes: Number,
      totalDeducciones: Number,
    },

    // Neto
    totalNeto: {
      type: Number,
      required: true,
      default: 0,
    },

    // Observaciones
    observaciones: {
      type: String,
      default: "",
      trim: true,
    },

    // Información de cálculo (para auditoría)
    calculadoEn: {
      type: Date,
      default: null,
    },

    // Referencia a documento PDF
    urlPDF: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas rápidas
nominaSchema.index({ empleadoId: 1, periodo: 1 }, { unique: true });
nominaSchema.index({ periodo: 1, estado: 1 });
nominaSchema.index({ empleadoId: 1, estado: 1 });

export default mongoose.model("Nomina", nominaSchema);
