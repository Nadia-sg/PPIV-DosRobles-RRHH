import Evento from "../models/Evento.js";

// GET /eventos
export const getEventos = async (req, res) => {
  try {
    const eventos = await Evento.find().sort({ fecha: 1, hora: 1 }); // orden cronológico
    res.status(200).json({ message: "Eventos obtenidos", data: eventos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener eventos" });
  }
};

// POST /eventos
export const crearEvento = async (req, res) => {
  try {
    const { fecha, hora, detalle, creadoPor } = req.body;
    if (!fecha || !hora || !detalle) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // parse fecha (acepta ISO date string "2025-11-10")
    const fechaDate = new Date(fecha);
    const nuevo = new Evento({ fecha: fechaDate, hora, detalle, creadoPor });
    await nuevo.save();

    res.status(201).json({ message: "Evento creado", data: nuevo });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear evento" });
  }
};