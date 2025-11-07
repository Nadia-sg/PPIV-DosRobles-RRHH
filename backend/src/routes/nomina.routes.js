import express from "express";
import {
  obtenerNominas,
  obtenerNominaById,
  calcularNomina,
  calcularNominasMultiples,
  aprobarNomina,
  obtenerResumenPeriodo,
} from "../controllers/nomina.controller.js";

const router = express.Router();

// Calcular nóminas para múltiples empleados (POST antes que GET)
router.post("/masivo/calcular", calcularNominasMultiples);

// Obtener resumen de un período (rutas con nombres específicos antes de :id)
router.get("/periodo/:periodo/resumen", obtenerResumenPeriodo);

// Obtener todas las nóminas (con filtros)
router.get("/", obtenerNominas);

// Obtener una nómina por ID
router.get("/:id", obtenerNominaById);

// Calcular nómina para un empleado
router.post("/", calcularNomina);

// Aprobar nómina
router.patch("/:id/aprobar", aprobarNomina);

export default router;
