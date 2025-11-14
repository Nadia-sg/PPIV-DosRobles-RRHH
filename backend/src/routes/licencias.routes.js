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
import {
  autenticacion,
  autorizacion,
} from "../middleware/auth.middleware.js";

const router = express.Router();

// Obtener todas las licencias (con filtros opcionales)
// Empleado ve solo sus licencias, admin ve todas
router.get("/", autenticacion, obtenerLicencias);

// Obtener una licencia por ID
// Empleado solo puede ver sus propias, admin puede ver cualquiera
router.get("/:id", autenticacion, obtenerLicenciaById);

// Obtener resumen de licencias por empleado
// Empleado solo puede obtener su resumen, admin puede obtener cualquiera
router.get(
  "/empleado/:empleadoId/resumen",
  autenticacion,
  obtenerResumenEmpleado
);

// Solicitar nueva licencia (empleado la suya, admin la de cualquiera)
router.post("/", autenticacion, solicitarLicencia);

// Actualizar licencia (solo si está pendiente)
// Empleado solo puede actualizar sus licencias, admin puede actualizar cualquiera
router.put("/:id", autenticacion, actualizarLicencia);

// Aprobar licencia (solo admin)
router.patch("/:id/aprobar", autenticacion, autorizacion("admin"), aprobarLicencia);

// Rechazar licencia (solo admin)
router.patch(
  "/:id/rechazar",
  autenticacion,
  autorizacion("admin"),
  rechazarLicencia
);

// Cancelar licencia (empleado puede cancelar sus propias, admin cualquiera)
router.patch("/:id/cancelar", autenticacion, cancelarLicencia);

export default router;
