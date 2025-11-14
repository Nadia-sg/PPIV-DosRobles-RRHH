// src/models/Aprobacion.model.js
import mongoose from "mongoose";

const aprobacionSchema = new mongoose.Schema({
  empleadoId: { type: String, required: true },
  mes: { type: String, required: true },
  horasTrabajadas: { type: Number, default: 0 },
  horasExtras: { type: Number, default: 0 },
  horasDescuento: { type: Number, default: 0 },
  fechaAprobacion: { type: Date, default: Date.now }
});

export default mongoose.model("Aprobacion", aprobacionSchema);