//src/models/Aprobacion.js

import mongoose from "mongoose";

const aprobacionSchema = new mongoose.Schema(
  {
    empleadoId: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado", required: true },
    mes: { type: Number, required: true, min: 1, max: 12 },
    anio: { type: Number, required: true },
    hsTrabajadas: { type: String, required: true },
    hsExtra: { type: String, default: "0h 0m" },
    hsDescuento: { type: String, default: "0h 0m" },
    estado: { type: String, enum: ["aprobado"], default: "aprobado" },
    fechaAprobacion: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Aprobacion = mongoose.model("Aprobacion", aprobacionSchema);
export default Aprobacion;
