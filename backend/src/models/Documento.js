import mongoose from "mongoose";

const documentoSchema = new mongoose.Schema(
  {
    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Tipo de documento
    tipoDocumento: {
      type: String,
      required: true,
      enum: [
        "certificado",
        "constancia_medica",
        "comprobante",
        "recibo",
        "otro",
      ],
      default: "otro",
    },

    // Nombre descriptivo del tipo
    tipoNombre: {
      type: String,
      required: true,
      // Ejemplo: "Certificado de Trabajo", "Constancia Médica", etc
    },

    // Nombre del archivo
    nombreArchivo: {
      type: String,
      required: true,
    },

    // Ruta del archivo en el servidor
    rutaArchivo: {
      type: String,
      required: true,
    },

    // Nombre único del archivo (con timestamp)
    nombreUnico: {
      type: String,
      required: true,
    },

    // URL o path del archivo (deprecated, mantener para retrocompatibilidad)
    urlArchivo: {
      type: String,
      default: "",
    },

    // Descripción adicional
    descripcion: {
      type: String,
      default: "",
      trim: true,
    },

    // Fecha de carga
    fechaCarga: {
      type: Date,
      default: Date.now,
    },

    // Tamaño en bytes
    tamanio: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Índices para búsquedas rápidas
documentoSchema.index({ empleadoId: 1 });
documentoSchema.index({ empleadoId: 1, fechaCarga: -1 });

export default mongoose.model("Documento", documentoSchema);
