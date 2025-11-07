// src/models/Notificacion.js
// Modelo para notificaciones generales en el sistema

import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema(
  {
    // Receptor de la notificación
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
    },

    // Tipo de notificación
    tipo: {
      type: String,
      enum: [
        "ausencia",
        "mensaje",
        "alerta",
        "aprobacion",
        "rechazo",
        "evento",
        "otro",
      ],
      required: true,
    },

    // Título/asunto de la notificación
    asunto: {
      type: String,
      required: true,
    },

    // Descripción o contenido de la notificación
    descripcion: {
      type: String,
      required: true,
    },

    // Información adicional según el tipo
    datos: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },

    // Estado de lectura
    leida: {
      type: Boolean,
      default: false,
    },

    // Referencia a la entidad relacionada (ej: ID de la ausencia)
    referenciaId: {
      type: String,
      default: null,
    },

    // Tipo de referencia (ej: "licencia", "mensaje", etc.)
    tipoReferencia: {
      type: String,
      default: null,
    },

    // Datos del remitente
    remitenteId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      default: null,
    },

    // Prioridad de la notificación
    prioridad: {
      type: String,
      enum: ["baja", "media", "alta"],
      default: "media",
    },

    // URL o acción asociada
    accion: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Índice para búsquedas rápidas por empleado
notificacionSchema.index({ empleadoId: 1, createdAt: -1 });

// Índice para notificaciones no leídas
notificacionSchema.index({ empleadoId: 1, leida: 1 });

export const Notificacion = mongoose.model("Notificacion", notificacionSchema);
