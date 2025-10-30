//src/models/Empleado.js

import mongoose from "mongoose";

const empleadoSchema = new mongoose.Schema({
  nombre: String,
  apellido: String,
  email: String,
});

const Empleado = mongoose.model("Empleado", empleadoSchema);
export default Empleado;