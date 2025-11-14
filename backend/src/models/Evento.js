//models/Evento.js

import mongoose from "mongoose";

const eventoSchema = new mongoose.Schema({
  fecha: { type: Date, required: true }, // guardamos como Date para poder ordenar y filtrar
  hora: { type: String, required: true }, // "14:30"
  detalle: { type: String, required: true },
  creadoPor: { type: mongoose.Schema.Types.ObjectId, ref: "Empleado", required: false },
}, { timestamps: true });

const Evento = mongoose.model("Evento", eventoSchema);
export default Evento;