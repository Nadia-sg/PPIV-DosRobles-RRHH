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

// PUT /eventos/:id
export const actualizarEvento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, detalle } = req.body;

    if (!fecha || !hora || !detalle) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const fechaDate = new Date(fecha);

    const eventoActualizado = await Evento.findByIdAndUpdate(
      id,
      { fecha: fechaDate, hora, detalle },
      { new: true } // retorna el documento actualizado
    );

    if (!eventoActualizado) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ message: "Evento actualizado", data: eventoActualizado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar evento" });
  }
};

// DELETE /eventos/:id
export const eliminarEvento = async (req, res) => {
  try {
    const { id } = req.params;

    const eventoEliminado = await Evento.findByIdAndDelete(id);

    if (!eventoEliminado) {
      return res.status(404).json({ message: "Evento no encontrado" });
    }

    res.status(200).json({ message: "Evento eliminado", data: eventoEliminado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al eliminar evento" });
  }
};
