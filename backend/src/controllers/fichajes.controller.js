//src/controllers/fichajes.controller.js

import Fichaje from "../models/Fichaje.js";
import Empleado from "../models/Empleado.js";



// ===================
// INICIAR JORNADA
// ===================
export const iniciarJornada = async (req, res) => {
  try {
    const { empleadoId, horaEntrada, ubicacion, tipoFichaje } = req.body;

    if (!empleadoId || !horaEntrada) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const fichajeActivo = await Fichaje.findOne({ empleadoId, horaSalida: { $exists: false } });
    if (fichajeActivo) {
      return res.status(400).json({
        message: "Ya tienes una jornada abierta. Debes registrar la salida antes de iniciar otra.",
      });
    }

    const nuevoFichaje = new Fichaje({
      empleadoId,
      horaEntrada,
      ubicacion: ubicacion || null,
      tipoFichaje: tipoFichaje || "remoto",
      pausas: [],
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

// ===================
// REGISTRAR SALIDA
// ===================
export const registrarSalida = async (req, res) => {
  try {
    const { fichajeId, horaSalida, ubicacionSalida } = req.body;

    const fichaje = await Fichaje.findById(fichajeId);
    if (!fichaje) return res.status(404).json({ message: "Fichaje no encontrado" });

    // guardamos ubicacionSalida si viene
    if (ubicacionSalida) {
      fichaje.ubicacionSalida = ubicacionSalida;
    }

    fichaje.horaSalida = horaSalida;

    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = (hSalida * 60 + mSalida) - (hEntrada * 60 + mEntrada);

    // restamos los minutos de pausa si existen
    const totalPausaMin = calcularMinutosPausas(fichaje.pausas);
    totalMin -= totalPausaMin;

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

// =================================
// CALCULAR MIN TOTALES DE PAUSAS
// =================================

function calcularMinutosPausas(pausas) {
  if (!Array.isArray(pausas)) return 0;

  let totalPausasMin = 0;

  pausas.forEach((pausa) => {
    if (pausa.inicio && pausa.fin) {
      const [h1, m1] = pausa.inicio.split(":").map(Number);
      const [h2, m2] = pausa.fin.split(":").map(Number);
      const minutos = (h2 * 60 + m2) - (h1 * 60 + m1);
      totalPausasMin += minutos > 0 ? minutos : 0;
    }
  });

  return totalPausasMin;
}


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

    // 🔹 Nuevo: restamos las pausas
    const totalPausaMin = calcularMinutosPausas(fichaje.pausas);
    totalMin -= totalPausaMin;

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

// ===================
// ESTADO DEL EQUIPO
// ===================

export const getEstadoEquipo = async (req, res) => {
  try {
    // contamos todos los empleados registrados
    const totalEmpleados = await Empleado.countDocuments();

    // buscamos fichajes del día actual sin hora de salida
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    const fichajesActivos = await Fichaje.find({
      horaSalida: null,
      createdAt: { $gte: hoy, $lt: manana },
    });

    const fichados = fichajesActivos.length;
    const ausentes = Math.max(totalEmpleados - fichados, 0);

    res.status(200).json({
      fichados,
      ausentes,
      totalEmpleados,
      message: "Estado del equipo obtenido correctamente",
    });
  } catch (error) {
    console.error("Error al obtener estado del equipo:", error);
    res.status(500).json({ message: "Error al obtener estado del equipo" });
  }
};