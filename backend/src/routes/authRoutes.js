// src/routes/authRoutes.js
import express from "express";
import { loginUser, registerUser } from "../controllers/authController.js";
import User from "../models/User.js";

const router = express.Router();

// Registro de usuario
router.post("/register", registerUser);

// Login de usuario
router.post("/login", loginUser);

// ⚠️ Ruta temporal para borrar usuario (solo para desarrollo)
router.delete("/delete/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const deletedUser = await User.findOneAndDelete({ username });
    if (!deletedUser) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.json({ message: `Usuario ${username} eliminado correctamente` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
});

export default router;
