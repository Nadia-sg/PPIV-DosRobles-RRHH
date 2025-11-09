//src/models/Fichaje.js

import mongoose from "mongoose";

const fichajeSchema = new mongoose.Schema({
  empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado", required: true },
  fecha: { type: Date, default: Date.now },
  horaEntrada: { type: String },
  horaSalida: { type: String },
  ubicacion: {
    lat: Number,
    lon: Number,
  },
  ubicacionSalida: {
    lat: Number,
    lon: Number,
  },
  tipoFichaje: { type: String, enum: ["oficina", "remoto"], default: "remoto" },
  pausas: [
    {
      inicio: String,
      fin: String,
    },
  ],
  totalTrabajado: { type: String },
  diferenciaHs: { type: String },
});

const Fichaje = mongoose.model("Fichaje", fichajeSchema);
export default Fichaje;
