import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema(
  {
    // Referencia al empleado
    empleadoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Empleado",
      required: true,
      unique: true,
    },

    // Credenciales
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    // Rol de usuario
    rol: {
      type: String,
      enum: ["empleado", "gerente", "rrhh", "admin"],
      default: "empleado",
    },

    // Estado
    estado: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índice para búsquedas rápidas
usuarioSchema.index({ username: 1 });
usuarioSchema.index({ empleadoId: 1 });

export default mongoose.model("Usuario", usuarioSchema);
