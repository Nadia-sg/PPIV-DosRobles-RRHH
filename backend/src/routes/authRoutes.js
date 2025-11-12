// src/routes/authRoutes.js
import express from "express";
import { registrarUsuario, loginUser, obtenerUsuarios, actualizarUsuario, eliminarUsuario } from "../controllers/authController.js";
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

// Eliminar usuario
router.delete("/:id", eliminarUsuario);

export default router;