//src/controllers/fichajes.controller.js

import Fichaje from "../models/Fichaje.js";

export const iniciarJornada = async (req, res) => {
  try {
    const { empleadoId, horaEntrada } = req.body;

    const nuevoFichaje = new Fichaje({
      empleadoId,
      horaEntrada,
    });

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

export const registrarSalida = async (req, res) => {
  try {
    const { fichajeId, horaSalida } = req.body;

    const fichaje = await Fichaje.findById(fichajeId);
    if (!fichaje) return res.status(404).json({ message: "Fichaje no encontrado" });

    fichaje.horaSalida = horaSalida;

    // Calcular horas trabajadas y diferencia respecto al contrato (8h por defecto)
    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = (hSalida*60 + mSalida) - (hEntrada*60 + mEntrada);
    fichaje.totalTrabajado = `${Math.floor(totalMin/60)}h ${totalMin%60}m`;

    // Diferencia respecto a 8 horas (480 min)
    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin)/60)}h ${Math.abs(diffMin)%60}m`;

    await fichaje.save();

    res.status(200).json({ message: "Salida registrada", data: fichaje });
  } catch (error) {
    console.error("Error al registrar salida:", error);
    res.status(500).json({ message: "Error al registrar salida" });
  }
};

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

export const getFichajes = async (req, res) => {
  try {
    const fichajes = await Fichaje.find().populate("empleadoId");
    res.status(200).json(fichajes);
  } catch (error) {
    console.error("Error al obtener fichajes:", error);
    res.status(500).json({ message: "Error al obtener fichajes" });
  }
};

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
