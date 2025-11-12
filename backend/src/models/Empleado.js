//src/models/Empleado.js

import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    // Identificaci�n
    legajo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    dni: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    cuil: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // Datos personales
    nombre: {
      type: String,
      required: true,
      trim: true,
    },
    apellido: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefono: {
      type: String,
      trim: true,
    },
    fotoPerfil: {
      type: String, // URL de la foto
      default: null,
    },

    // Datos laborales
    area: {
      type: String,
      required: true,
      trim: true,
    },
    puesto: {
      type: String,
      required: true,
      trim: true,
    },
    categoria: {
      type: String,
      required: true,
      trim: true,
    },
    modalidadContratacion: {
      type: String,
      enum: ["relacion_de_dependencia", "contratista", "temporal"],
      required: true,
    },
    jornada: {
      type: String,
      enum: ["completa", "media", "parcial"],
      required: true,
    },

    // Fechas laborales
    fechaAlta: {
      type: Date,
      required: true,
    },
    fechaContratovencimiento: {
      type: Date,
      default: null,
    },
    estado: {
      type: String,
      enum: ["activo", "inactivo", "licencia"],
      default: "activo",
    },

    // Datos bancarios
    banco: {
      type: String,
      trim: true,
    },
    cbu: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    // Datos de seguridad
    obraSocial: {
      type: String,
      trim: true,
    },
    art: {
      type: String,
      trim: true,
    },

    // Datos de sueldo
    sueldoBasico: {
      type: Number,
      required: true,
      default: 0,
    },

    // Rol de usuario
    rol: {
      type: String,
      enum: ["empleado", "gerente", "rrhh", "admin"],
      default: "empleado",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Empleado", empleadoSchema);