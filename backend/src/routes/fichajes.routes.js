//src/routes/fichajes.routes.js

import express from "express";
import { iniciarJornada, registrarSalida, registrarPausa, getFichajes, getFichajesPorEmpleado } from "../controllers/fichajes.controller.js";


const router = express.Router();

// Ruta para iniciar jornada
router.post("/inicio", iniciarJornada);

// Ruta para registrar salida
router.post("/salida", registrarSalida);

// Ruta para registrar pausa
router.post("/pausa", registrarPausa);

// Rutas GET
router.get("/", getFichajes);

router.get("/empleado/:empleadoId", getFichajesPorEmpleado);

export default router;
