//src/controllers/fichajes.controller.js

import Fichaje from "../models/Fichaje.js";

// ===================
// INICIAR JORNADA
// ===================
export const iniciarJornada = async (req, res) => {
  try {
    const { empleadoId, horaEntrada } = req.body;

    if (!empleadoId || !horaEntrada) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const fichajeActivo = await Fichaje.findOne({ empleadoId, horaSalida: { $exists: false } });
    if (fichajeActivo) {
      return res.status(400).json({
        message: "Ya tienes una jornada abierta. Debes registrar la salida antes de iniciar otra.",
      });
    }

    const nuevoFichaje = new Fichaje({ empleadoId, horaEntrada });
    await nuevoFichaje.save();

    res.status(201).json({
      message: "Fichaje iniciado correctamente",
      data: nuevoFichaje,
    });
  } catch (error) {
    console.error("Error al iniciar jornada:", error);
    res.status(500).json({ message: "Error al iniciar jornada" });
  }
};

// ===================
// REGISTRAR SALIDA
// ===================
export const registrarSalida = async (req, res) => {
  try {
    const { fichajeId, horaSalida } = req.body;

    const fichaje = await Fichaje.findById(fichajeId);
    if (!fichaje) return res.status(404).json({ message: "Fichaje no encontrado" });

    fichaje.horaSalida = horaSalida;

    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);
    let totalMin = (hSalida * 60 + mSalida) - (hEntrada * 60 + mEntrada);

    fichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin) / 60)}h ${Math.abs(diffMin) % 60}m`;

    await fichaje.save();

    res.status(200).json({ message: "Salida registrada", data: fichaje });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    res.status(500).json({ message: "Error al registrar salida" });
  }
};

// ===================
// REGISTRAR PAUSA
// ===================
export const registrarPausa = async (req, res) => {
  try {
    const { fichajeId, inicio, fin } = req.body;

    const fichaje = await Fichaje.findById(fichajeId);
    if (!fichaje) return res.status(404).json({ message: "Fichaje no encontrado" });

    if (inicio) fichaje.pausas.push({ inicio, fin: null });
    if (fin) {
      const ultimaPausa = fichaje.pausas[fichaje.pausas.length - 1];
      if (ultimaPausa && !ultimaPausa.fin) ultimaPausa.fin = fin;
    }

    await fichaje.save();
    res.status(200).json({ message: "Pausa registrada", data: fichaje });
  } catch (error) {
    console.error("Error al registrar pausa:", error);
    res.status(500).json({ message: "Error al registrar pausa" });
  }
};

// ===================
// OBTENER TODOS LOS FICHAJES
// ===================
export const getFichajes = async (req, res) => {
  try {
    const fichajes = await Fichaje.find().populate("empleadoId");
    res.status(200).json(fichajes);
  } catch (error) {
    console.error("Error al obtener fichajes:", error);
    res.status(500).json({ message: "Error al obtener fichajes" });
  }
};

// ===================
// OBTENER POR EMPLEADO
// ===================
export const getFichajesPorEmpleado = async (req, res) => {
  try {
    const { empleadoId } = req.params;
    const fichajes = await Fichaje.find({ empleadoId }).populate("empleadoId");

    if (!fichajes.length)
      return res.status(404).json({ message: "Este empleado no tiene fichajes registrados" });

    res.status(200).json(fichajes);
  } catch (error) {
    console.error("Error al obtener fichajes por empleado:", error);
    res.status(500).json({ message: "Error al obtener fichajes por empleado" });
  }
};

// ===================
// OBTENER FICHAJES ACTIVOS
// ===================
export const getFichajesActivos = async (req, res) => {
  try {
    const fichajesActivos = await Fichaje.find({ horaSalida: null }).populate("empleadoId");
    res.status(200).json({
      message: "Fichajes activos obtenidos correctamente",
      data: fichajesActivos,
    });
  } catch (error) {
    console.error("Error al obtener fichajes activos:", error);
    res.status(500).json({ message: "Error al obtener fichajes activos" });
  }
};

// ===================
// CERRAR JORNADA
// ===================
export const cerrarJornada = async (req, res) => {
  try {
    const { empleadoId, horaSalida } = req.body;

    const fichaje = await Fichaje.findOne({ empleadoId, horaSalida: null });
    if (!fichaje)
      return res.status(404).json({ message: "No hay jornada activa para este empleado" });

    fichaje.horaSalida = horaSalida;

    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = (hSalida * 60 + mSalida) - (hEntrada * 60 + mEntrada);
    fichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin) / 60)}h ${Math.abs(diffMin) % 60}m`;

    await fichaje.save();

    const fichajesActivos = await Fichaje.find({ horaSalida: null }).populate("empleadoId");

    res.status(200).json({
      message: "Jornada cerrada correctamente",
      data: {
        fichajeCerrado: fichaje,
        fichajesActivosActualizados: fichajesActivos,
      },
    });
  } catch (error) {
    console.error("Error al cerrar jornada:", error);
    res.status(500).json({ message: "Error al cerrar jornada" });
  }
};
