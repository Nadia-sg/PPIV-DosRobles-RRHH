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
  aprobarFichajes,
  getAprobacionesMes
} from "../controllers/fichajes.controller.js";


const router = express.Router();

router.post("/inicio", iniciarJornada);
router.post("/salida", registrarSalida);
router.post("/pausa", registrarPausa);
router.post("/cerrar", cerrarJornada);
router.post("/aprobar", aprobarFichajes);

router.get("/", getFichajes);
router.get("/empleados-mes", getFichajesEmpleados);
router.get("/aprobaciones/mes", getAprobacionesMes);
router.get("/activos", getFichajesActivos);
router.get("/estado", getEstadoEquipo);
router.get("/empleado/:empleadoId", getFichajesPorEmpleado);

router.put("/:id", actualizarFichaje);
router.delete("/:id", eliminarFichaje);
router.post("/crear", crearFichaje);


export default router;


