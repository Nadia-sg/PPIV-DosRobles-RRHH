import express from "express";
import {
  obtenerLicencias,
  obtenerLicenciaById,
  solicitarLicencia,
  aprobarLicencia,
  rechazarLicencia,
  actualizarLicencia,
  cancelarLicencia,
  obtenerResumenEmpleado,
} from "../controllers/licencias.controller.js";

const router = express.Router();

// Obtener todas las licencias (con filtros opcionales)
router.get("/", obtenerLicencias);

// Obtener una licencia por ID
router.get("/:id", obtenerLicenciaById);

// Obtener resumen de licencias por empleado
router.get("/empleado/:empleadoId/resumen", obtenerResumenEmpleado);

// Solicitar nueva licencia
router.post("/", solicitarLicencia);

// Actualizar licencia (solo si está pendiente)
router.put("/:id", actualizarLicencia);

// Aprobar licencia (solo gerente)
router.patch("/:id/aprobar", aprobarLicencia);

// Rechazar licencia (solo gerente)
router.patch("/:id/rechazar", rechazarLicencia);

// Cancelar licencia
router.patch("/:id/cancelar", cancelarLicencia);

export default router;
