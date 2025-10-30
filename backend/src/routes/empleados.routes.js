// src/routes/empleados.routes.js
import express from "express";
import { crearEmpleado } from "../controllers/empleados.controller.js";

const router = express.Router();

// Ruta para crear empleado
router.post("/", crearEmpleado);

export default router;
