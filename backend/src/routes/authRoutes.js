// src/routes/authRoutes.js
import express from "express";
import { registrarUsuario, loginUser, obtenerUsuarios, actualizarUsuario } from "../controllers/authController.js";
//import Usuario from "../models/Usuario.js";

const router = express.Router();

// Registro de usuario
router.post("/register", registrarUsuario);

// Login de usuario
router.post("/login", loginUser);

// Lista de usuarios
router.get("/", obtenerUsuarios);

// Editar usuario
router.put("/:id", actualizarUsuario);


// // ⚠️ Ruta temporal para borrar usuario (solo para desarrollo)
// router.delete("/delete/:username", async (req, res) => {
//   try {
//     const { username } = req.params;
//     const deletedUser = await Usuario.findOneAndDelete({ username });
//     if (!deletedUser) {
//       return res.status(404).json({ message: "Usuario no encontrado" });
//     }
//     res.json({ message: `Usuario ${username} eliminado correctamente` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Error al eliminar usuario" });
//   }
// });

export default router;
