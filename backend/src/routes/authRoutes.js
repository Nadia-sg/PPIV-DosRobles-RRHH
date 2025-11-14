// src/routes/authRoutes.js
import express from "express";
import { registrarUsuario, loginUser, obtenerUsuarios, actualizarUsuario, eliminarUsuario, logout, verificarToken, crearUsuarioPrueba } from "../controllers/authController.js";
//import Usuario from "../models/Usuario.js";

const router = express.Router();

// Registro de usuario
router.post("/register", registrarUsuario);

// Login de usuario
router.post("/login", loginUser);

// Logout
router.post("/logout", logout);

// Verificar token
router.get("/verificar", verificarToken);

// Crear usuario de prueba
router.post("/crear-usuario-prueba", crearUsuarioPrueba);

// Lista de usuarios
router.get("/", obtenerUsuarios);

// Editar usuario
router.put("/:id", actualizarUsuario);

// Eliminar usuario
router.delete("/:id", eliminarUsuario);

export default router;