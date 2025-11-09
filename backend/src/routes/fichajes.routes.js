//src/routes/fichajes.routes.js

import express from "express";
import {
  iniciarJornada,
  registrarSalida,
  registrarPausa,
  getFichajes,
  getFichajesPorEmpleado,
  getFichajesActivos,
  cerrarJornada,
  getEstadoEquipo 
} from "../controllers/fichajes.controller.js";

const router = express.Router();

router.post("/inicio", iniciarJornada);
router.post("/salida", registrarSalida);
router.post("/pausa", registrarPausa);
router.post("/cerrar", cerrarJornada);

router.get("/", getFichajes);
router.get("/empleado/:empleadoId", getFichajesPorEmpleado);
router.get("/activos", getFichajesActivos);
router.get("/estado", getEstadoEquipo);


export default router;


