import express from "express";
import {
  login,
  logout,
  verificarToken,
  crearUsuarioPrueba,
} from "../controllers/auth.controller.js";

const router = express.Router();

// Login
router.post("/login", login);

// Logout
router.post("/logout", logout);

// Verificar token
router.get("/verificar", verificarToken);

// Crear usuario de prueba (para testing, eliminar después)
router.post("/crear-usuario-prueba", crearUsuarioPrueba);

export default router;
