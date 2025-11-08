// src/routes/empleadoRoutes.js
import express from "express";
import {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerProximoLegajo, 
} from "../controllers/empleadoController.js";

const router = express.Router();

router.get("/proximo-legajo", obtenerProximoLegajo);

router.post("/", crearEmpleado);
router.get("/", obtenerEmpleados);
router.get("/:id", obtenerEmpleadoPorId);
router.put("/:id", actualizarEmpleado);
router.delete("/:id", eliminarEmpleado);

export default router;

