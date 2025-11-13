// src/models/Empleado.js
import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    tipoDocumento: { type: String, enum: ["dni", "pasaporte"], required: true },
    numeroDocumento: { type: String, required: true },
    cuil: { type: String, required: true },
    telefono: { type: String },
    email: { type: String },
    fechaNacimiento: { type: Date },
    fechaAlta: { type: Date, default: Date.now },

    areaTrabajo: { type: String },
    puesto: { type: String },
    categoria: { type: String },
    modalidad: { type: String },
    jornada: { type: String },
    horario: { type: String },
    obraSocial: { type: String },
    art: { type: String },

    tipoRemuneracion: { type: String },
    sueldoBruto: { type: Number },
    banco: { type: String },
    cbu: { type: String },
    vencimientoContrato: { type: Date },
    categoriaImpositiva: { type: String },

    numeroLegajo: { type: String, unique: true },
    
    // imagenPerfil guardada en la base de datos
    imagenPerfil: {
      data: Buffer,
      contentType: String,
    },

    usuario: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario" },
  },
  { timestamps: true }
);

const Empleado = mongoose.model("Empleado", empleadoSchema);
export default Empleado;
