// src/routes/notificaciones.routes.js
// Rutas para gestionar notificaciones

import express from "express";
import {
  obtenerTodasLasNotificaciones,
  obtenerNotificaciones,
  obtenerNotificacionesNoLeidas,
  crearNotificacion,
  crearNotificacionGeneral,
  marcarComoLeida,
  marcarTodasComoLeidas,
  eliminarNotificacion,
  eliminarNotificacionesLeidas,
} from "../controllers/notificaciones.controller.js";

const router = express.Router();

// NOTA: Las rutas más específicas deben ir ANTES que las genéricas

// Obtener todas las notificaciones (para gerentes/admin)
router.get("/todas", obtenerTodasLasNotificaciones);

// Crear una notificación general para todos los empleados (ANTES que POST /)
router.post("/general", crearNotificacionGeneral);

// Crear una nueva notificación individual
router.post("/", crearNotificacion);

// Obtener solo notificaciones no leídas de un empleado (DEBE IR ANTES QUE LA GENÉRICA)
router.get("/empleado/:empleadoId/no-leidas", obtenerNotificacionesNoLeidas);

// Marcar todas las notificaciones de un empleado como leídas (DEBE IR ANTES QUE LA GENÉRICA)
router.patch("/empleado/:empleadoId/marcar-todas-leidas", marcarTodasComoLeidas);

// Eliminar todas las notificaciones leídas de un empleado (DEBE IR ANTES QUE LA GENÉRICA)
router.delete("/empleado/:empleadoId/eliminar-leidas", eliminarNotificacionesLeidas);

// Obtener todas las notificaciones de un empleado (GENÉRICA)
router.get("/empleado/:empleadoId", obtenerNotificaciones);

// Marcar una notificación como leída
router.patch("/:id/marcar-leida", marcarComoLeida);

// Eliminar una notificación
router.delete("/:id", eliminarNotificacion);

export default router;
