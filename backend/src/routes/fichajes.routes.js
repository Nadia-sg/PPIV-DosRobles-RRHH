//src/routes/fichajes.routes.js

import express from "express";
import {
  iniciarJornada,
  registrarSalida,
  registrarPausa,
  getFichajes,
  getFichajesEmpleados,
  getFichajesPorEmpleado,
  getFichajesActivos,
  cerrarJornada,
  getEstadoEquipo,
  actualizarFichaje, 
  eliminarFichaje,
  crearFichaje,
  crearAprobacion, 
  getAprobaciones
} from "../controllers/fichajes.controller.js";


const router = express.Router();

router.post("/inicio", iniciarJornada);
router.post("/salida", registrarSalida);
router.post("/pausa", registrarPausa);
router.post("/cerrar", cerrarJornada);

router.get("/", getFichajes);
router.get("/empleados-mes", getFichajesEmpleados);
router.get("/activos", getFichajesActivos);
router.get("/estado", getEstadoEquipo);
router.get("/empleado/:empleadoId", getFichajesPorEmpleado);

router.put("/:id", actualizarFichaje);
router.delete("/:id", eliminarFichaje);
router.post("/crear", crearFichaje);

// Rutas de aprobaciones
router.post("/aprobaciones", crearAprobacion);
router.get("/aprobaciones", getAprobaciones);

export default router;


