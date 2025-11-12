// src/models/Usuario.js
import mongoose from "mongoose";
import bcrypt from "bcrypt";

const usuarioSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["admin", "empleado"],
    default: "empleado"
  }
});

// Middleware para encriptar la contraseña antes de guardar
usuarioSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseñas
usuarioSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const Usuario = mongoose.model("Usuario", usuarioSchema);
export default Usuario;
