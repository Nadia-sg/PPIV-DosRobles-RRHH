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
