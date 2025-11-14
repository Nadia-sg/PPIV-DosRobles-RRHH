// src/routes/empleados.routes.js
import express from "express";
import {
  obtenerEmpleados,
  obtenerEmpleadoById,
  obtenerEmpleadoPorLegajo,
  crearEmpleado,
  actualizarEmpleado,
  desactivarEmpleado,
  eliminarEmpleado,
} from "../controllers/empleados.controller.js";

const router = express.Router();

// Obtener todos los empleados
router.get("/", obtenerEmpleados);

// Obtener un empleado por ID
router.get("/:id", obtenerEmpleadoById);

// Obtener un empleado por legajo
router.get("/legajo/:legajo", obtenerEmpleadoPorLegajo);

// Crear nuevo empleado
router.post("/", crearEmpleado);

// Actualizar empleado
router.put("/:id", actualizarEmpleado);

// Desactivar empleado
router.patch("/:id/desactivar", desactivarEmpleado);

// Eliminar empleado
router.delete("/:id", eliminarEmpleado);

export default router;