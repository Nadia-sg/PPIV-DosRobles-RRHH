// src/controllers/notificaciones.controller.js
// Controlador para gestionar notificaciones

import { Notificacion } from "../models/Notificacion.js";
import Empleado from "../models/Empleado.js";

// Obtener todas las notificaciones (solo para gerentes/admin)
export const obtenerTodasLasNotificaciones = async (req, res) => {
  try {
    // Obtener todas las notificaciones, ordenadas por fecha descendente
    const notificaciones = await Notificacion.find()
      .populate("empleadoId", "nombre apellido legajo")
      .populate("remitenteId", "nombre apellido legajo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notificaciones,
    });
  } catch (error) {
    console.error("Error al obtener todas las notificaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener todas las notificaciones",
      error: error.message,
    });
  }
};

// Obtener todas las notificaciones de un empleado
export const obtenerNotificaciones = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    // Obtener todas las notificaciones del empleado, ordenadas por fecha descendente
    const notificaciones = await Notificacion.find({ empleadoId })
      .populate("remitenteId", "nombre apellido legajo")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notificaciones,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener notificaciones",
      error: error.message,
    });
  }
};

// Obtener notificaciones no leídas de un empleado
export const obtenerNotificacionesNoLeidas = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    const notificaciones = await Notificacion.find({
      empleadoId,
      leida: false,
    })
      .populate("remitenteId", "nombre apellido")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: notificaciones,
      count: notificaciones.length,
    });
  } catch (error) {
    console.error("Error al obtener notificaciones no leídas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener notificaciones no leídas",
      error: error.message,
    });
  }
};

// Crear una nueva notificación
export const crearNotificacion = async (req, res) => {
  try {
    const {
      empleadoId,
      tipo,
      asunto,
      descripcion,
      datos,
      remitenteId,
      prioridad,
      referenciaId,
      tipoReferencia,
      accion,
    } = req.body;

    // Validaciones básicas
    if (!empleadoId || !tipo || !asunto || !descripcion) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos requeridos: empleadoId, tipo, asunto, descripcion",
      });
    }

    const nuevaNotificacion = new Notificacion({
      empleadoId,
      tipo,
      asunto,
      descripcion,
      datos: datos || null,
      remitenteId: remitenteId || null,
      prioridad: prioridad || "media",
      referenciaId: referenciaId || null,
      tipoReferencia: tipoReferencia || null,
      accion: accion || null,
    });

    await nuevaNotificacion.save();

    res.status(201).json({
      success: true,
      message: "Notificación creada correctamente",
      data: nuevaNotificacion,
    });
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear notificación",
      error: error.message,
    });
  }
};

// Marcar una notificación como leída
export const marcarComoLeida = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByIdAndUpdate(
      id,
      { leida: true },
      { new: true }
    );

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notificación marcada como leída",
      data: notificacion,
    });
  } catch (error) {
    console.error("Error al marcar notificación como leída:", error);
    res.status(500).json({
      success: false,
      message: "Error al marcar notificación como leída",
      error: error.message,
    });
  }
};

// Marcar todas las notificaciones de un empleado como leídas
export const marcarTodasComoLeidas = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    const resultado = await Notificacion.updateMany(
      { empleadoId, leida: false },
      { leida: true }
    );

    res.status(200).json({
      success: true,
      message: "Todas las notificaciones marcadas como leídas",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al marcar todas las notificaciones como leídas:", error);
    res.status(500).json({
      success: false,
      message: "Error al marcar todas las notificaciones como leídas",
      error: error.message,
    });
  }
};

// Eliminar una notificación
export const eliminarNotificacion = async (req, res) => {
  try {
    const { id } = req.params;

    const notificacion = await Notificacion.findByIdAndDelete(id);

    if (!notificacion) {
      return res.status(404).json({
        success: false,
        message: "Notificación no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Notificación eliminada correctamente",
      data: notificacion,
    });
  } catch (error) {
    console.error("Error al eliminar notificación:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar notificación",
      error: error.message,
    });
  }
};

// Eliminar todas las notificaciones leídas de un empleado
export const eliminarNotificacionesLeidas = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    const resultado = await Notificacion.deleteMany({
      empleadoId,
      leida: true,
    });

    res.status(200).json({
      success: true,
      message: "Notificaciones leídas eliminadas",
      data: resultado,
    });
  } catch (error) {
    console.error("Error al eliminar notificaciones leídas:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar notificaciones leídas",
      error: error.message,
    });
  }
};

// Crear una notificación general para todos los empleados
export const crearNotificacionGeneral = async (req, res) => {
  try {
    const {
      tipo,
      asunto,
      descripcion,
      datos,
      prioridad,
      referenciaId,
      tipoReferencia,
    } = req.body;

    // Validaciones básicas
    if (!tipo || !asunto || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: tipo, asunto, descripcion",
      });
    }

    // Obtener todos los empleados activos
    const empleados = await Empleado.find({ estado: "activo" }).select("_id");

    if (empleados.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No hay empleados activos para enviar notificaciones",
      });
    }

    // Crear notificación para cada empleado
    const notificaciones = empleados.map((empleado) => ({
      empleadoId: empleado._id,
      tipo,
      asunto,
      descripcion,
      datos: datos || null,
      remitenteId: null,
      prioridad: prioridad || "media",
      referenciaId: referenciaId || null,
      tipoReferencia: tipoReferencia || null,
      leida: false,
    }));

    const resultado = await Notificacion.insertMany(notificaciones);

    res.status(201).json({
      success: true,
      message: `Notificación general enviada a ${resultado.length} empleados`,
      data: resultado,
    });
  } catch (error) {
    console.error("Error al crear notificación general:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear notificación general",
      error: error.message,
    });
  }
};
