// backend/src/controllers/bandeja.controller.js
import Mensaje from "../models/Mensaje.js"; // supongamos que tenés este modelo

export const getMensajes = async (req, res) => {
  const limit = parseInt(req.query.limit) || 5;
  const userId = req.user._id; // viene del authMiddleware

  try {
    const mensajes = await Mensaje.find({ destinatarioId: userId })
      .sort({ fecha: -1 })
      .limit(limit);

    res.json(mensajes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener mensajes" });
  }
};
