//src/controllers/fichajes.controller.js

import Fichaje from "../models/Fichaje.js";
import Empleado from "../models/Empleado.js";
import Aprobacion from "../models/Aprobacion.js";

// ===================
// INICIAR JORNADA
// ===================
export const iniciarJornada = async (req, res) => {
  try {
    const { empleadoId, horaEntrada, ubicacion, tipoFichaje } = req.body;

    if (!empleadoId || !horaEntrada) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    const fichajeActivo = await Fichaje.findOne({
      empleadoId,
      horaSalida: { $exists: false },
    });
    if (fichajeActivo) {
      return res.status(400).json({
        message:
          "Ya tienes una jornada abierta. Debes registrar la salida antes de iniciar otra.",
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
    if (!fichaje)
      return res.status(404).json({ message: "Fichaje no encontrado" });

    // guardamos ubicacionSalida si viene
    if (ubicacionSalida) {
      fichaje.ubicacionSalida = ubicacionSalida;
    }

    fichaje.horaSalida = horaSalida;

    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = hSalida * 60 + mSalida - (hEntrada * 60 + mEntrada);

    // restamos los minutos de pausa si existen
    const totalPausaMin = calcularMinutosPausas(fichaje.pausas);
    totalMin -= totalPausaMin;

    fichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin) / 60)}h ${
      Math.abs(diffMin) % 60
    }m`;

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
    if (!fichaje)
      return res.status(404).json({ message: "Fichaje no encontrado" });

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
      const minutos = h2 * 60 + m2 - (h1 * 60 + m1);
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
// OBTENER FICHAJES POR EMPLEADO (día a día)
// ===================
export const getFichajesPorEmpleado = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    // Buscar fichajes de este empleado
    const fichajes = await Fichaje.find({ empleadoId }).sort({ fecha: -1 });

    if (!fichajes.length)
      return res.status(404).json({ message: "Este empleado no tiene fichajes registrados" });

    res.status(200).json(fichajes);
  } catch (error) {
    console.error("Error al obtener fichajes por empleado:", error);
    res.status(500).json({ message: "Error al obtener fichajes por empleado" });
  }
};

// ===================
// RESUMEN MENSUAL POR EMPLEADO
// ===================
export const getFichajesEmpleados = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio)
      return res.status(400).json({ message: "Debe enviar mes y año" });

    const inicioMes = new Date(anio, mes - 1, 1);
    const finMes = new Date(anio, mes, 0, 23, 59, 59);

    const empleados = await Empleado.find({ estado: "activo" });
    const resultados = [];

    for (const emp of empleados) {
      const fichajes = await Fichaje.find({
        empleadoId: emp._id,
        fecha: { $gte: inicioMes, $lte: finMes },
      });

      // Sumar horas trabajadas
      let totalMinutos = 0;
      fichajes.forEach((f) => {
        if (f.totalTrabajado) {
          const [h, m] = f.totalTrabajado.split("h");
          const horas = parseInt(h) || 0;
          const minutos = parseInt((m || "0").replace("m", "")) || 0;
          totalMinutos += horas * 60 + minutos;
        }
      });

      const hsTrabajadas = `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`;

      // Horas previstas
      const diasHabiles = getDiasHabiles(mes, anio);
      let horasPorDia = 8;
      if (emp.jornada === "media") horasPorDia = 4;
      if (emp.jornada === "parcial") horasPorDia = 6;

      const hsPrevistas = `${diasHabiles * horasPorDia}h`;

      resultados.push({
        idEmpleado: emp._id,
        nombre: emp.nombre,
        apellido: emp.apellido,
        fotoPerfil: emp.fotoPerfil,
        hsPrevistas,
        hsTrabajadas,
      });
    }

    res.status(200).json(resultados);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ==============================
// FUNCIÓN AUXILIAR DIAS HÁBILES
// =============================

function getDiasHabiles(mes, anio) {
  const inicio = new Date(anio, mes - 1, 1);
  const fin = new Date(anio, mes, 0);
  let dias = 0;
  for (let d = new Date(inicio); d <= fin; d.setDate(d.getDate() + 1)) {
    const day = d.getDay();
    if (day !== 0 && day !== 6) dias++;
  }
  return dias;
}



// ===================
// OBTENER FICHAJES ACTIVOS
// ===================
export const getFichajesActivos = async (req, res) => {
  try {
    const fichajesActivos = await Fichaje.find({ horaSalida: null }).populate(
      "empleadoId"
    );
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
      return res
        .status(404)
        .json({ message: "No hay jornada activa para este empleado" });

    fichaje.horaSalida = horaSalida;

    const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = hSalida * 60 + mSalida - (hEntrada * 60 + mEntrada);

    // 🔹 Nuevo: restamos las pausas
    const totalPausaMin = calcularMinutosPausas(fichaje.pausas);
    totalMin -= totalPausaMin;

    fichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin) / 60)}h ${
      Math.abs(diffMin) % 60
    }m`;

    await fichaje.save();

    const fichajesActivos = await Fichaje.find({ horaSalida: null }).populate(
      "empleadoId"
    );

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
    // contamos todos los empleados registrados y activos
    const totalEmpleados = await Empleado.countDocuments({ estado: "activo" });

    // buscamos fichajes del día actual (por campo 'fecha', no 'createdAt')
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);

    // Obtener todos los fichajes de hoy
    const fichajesHoy = await Fichaje.find({
      fecha: { $gte: hoy, $lt: manana },
    });

    // Extraer IDs únicos de empleados que ficharon hoy
    const empleadosQueFicharonHoy = new Set(
      fichajesHoy.map(f => f.empleadoId.toString())
    );

    const fichados = empleadosQueFicharonHoy.size;
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

// === ACTUALIZAR FICHAJE ===
export const actualizarFichaje = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const fichaje = await Fichaje.findById(id);
    if (!fichaje) {
      return res.status(404).json({ success: false, message: "Fichaje no encontrado" });
    }

    // Actualizar campos
    if (updates.horaEntrada) fichaje.horaEntrada = updates.horaEntrada;
    if (updates.horaSalida) fichaje.horaSalida = updates.horaSalida;
    if (updates.fecha) fichaje.fecha = updates.fecha;
    if (updates.tipoFichaje) fichaje.tipoFichaje = updates.tipoFichaje;
    if (updates.ubicacion) fichaje.ubicacion = updates.ubicacion;
    if (updates.pausas) fichaje.pausas = updates.pausas;

    // Recalcular totalTrabajado y diferenciaHs si hay horaEntrada y horaSalida
    if (fichaje.horaEntrada && fichaje.horaSalida) {
      const [hEntrada, mEntrada] = fichaje.horaEntrada.split(":").map(Number);
      const [hSalida, mSalida] = fichaje.horaSalida.split(":").map(Number);

      let totalMin = hSalida * 60 + mSalida - (hEntrada * 60 + mEntrada);

      // Restar minutos de pausas
      const totalPausaMin = calcularMinutosPausas(fichaje.pausas);
      totalMin -= totalPausaMin;

      fichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

      const diffMin = totalMin - 480; // 480 minutos = 8 horas
      const sign = diffMin >= 0 ? "+" : "-";
      fichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin) / 60)}h ${
        Math.abs(diffMin) % 60
      }m`;
    }

    await fichaje.save();

    res.status(200).json({ success: true, message: "Fichaje actualizado", data: fichaje });
  } catch (error) {
    console.error("Error al actualizar fichaje:", error);
    res.status(500).json({ success: false, message: "Error al actualizar el fichaje" });
  }
};

// === ELIMINAR FICHAJE ===
export const eliminarFichaje = async (req, res) => {
  try {
    const { id } = req.params;
    const fichaje = await Fichaje.findByIdAndDelete(id);
    if (!fichaje) {
      return res.status(404).json({ success: false, message: "Fichaje no encontrado" });
    }

    res.status(200).json({ success: true, message: "Fichaje eliminado" });
  } catch (error) {
    console.error("Error al eliminar fichaje:", error);
    res.status(500).json({ success: false, message: "Error al eliminar el fichaje" });
  }
};

// === CREAR FICHAJE MANUAL ===
export const crearFichaje = async (req, res) => {
  try {
    const { empleadoId, horaEntrada, horaSalida, tipoFichaje, fecha } = req.body;

    if (!empleadoId || !horaEntrada || !horaSalida || !tipoFichaje) {
      return res.status(400).json({ message: "Faltan datos requeridos" });
    }

    // Ubicación según tipo
    const ubicacion = tipoFichaje.toLowerCase() === "oficina"
      ? { lat: -34.61, lon: -58.38 }
      : { lat: null, lon: null };

    const nuevoFichaje = new Fichaje({
      empleadoId,
      horaEntrada,
      horaSalida,
      tipoFichaje,
      ubicacion,
      ubicacionSalida: { lat: null, lon: null },
      pausas: [],
      fecha: fecha ? new Date(fecha) : undefined,
    });

    // Calcular total trabajado y diferencia
    const [hEntrada, mEntrada] = horaEntrada.split(":").map(Number);
    const [hSalida, mSalida] = horaSalida.split(":").map(Number);

    let totalMin = hSalida * 60 + mSalida - (hEntrada * 60 + mEntrada);
    nuevoFichaje.totalTrabajado = `${Math.floor(totalMin / 60)}h ${totalMin % 60}m`;

    const diffMin = totalMin - 480;
    const sign = diffMin >= 0 ? "+" : "-";
    nuevoFichaje.diferenciaHs = `${sign}${Math.floor(Math.abs(diffMin)/60)}h ${Math.abs(diffMin)%60}m`;

    await nuevoFichaje.save();

    res.status(201).json({ message: "Fichaje creado correctamente", data: nuevoFichaje });
  } catch (error) {
    console.error("Error al crear fichaje:", error);
    res.status(500).json({ message: "Error al crear fichaje" });
  }
};

// === APROBAR FICHAJES DE EMPLEADOS ===
export const aprobarFichajes = async (req, res) => {
  try {
    const { empleadoIds, mes, anio } = req.body;

    if (!empleadoIds || !Array.isArray(empleadoIds) || empleadoIds.length === 0) {
      return res.status(400).json({ message: "Debe seleccionar al menos un empleado" });
    }

    if (!mes || !anio) {
      return res.status(400).json({ message: "Debe especificar mes y año" });
    }

    const aprobaciones = [];

    for (const empleadoId of empleadoIds) {
      // Obtener fichajes del empleado para el mes/año
      const inicioMes = new Date(anio, mes - 1, 1);
      const finMes = new Date(anio, mes, 0, 23, 59, 59);

      const fichajes = await Fichaje.find({
        empleadoId,
        fecha: { $gte: inicioMes, $lte: finMes },
      });

      // Sumar horas trabajadas
      let totalMinutos = 0;
      fichajes.forEach((f) => {
        if (f.totalTrabajado) {
          const [h, m] = f.totalTrabajado.split("h");
          const horas = parseInt(h) || 0;
          const minutos = parseInt((m || "0").replace("m", "")) || 0;
          totalMinutos += horas * 60 + minutos;
        }
      });

      const hsTrabajadas = `${Math.floor(totalMinutos / 60)}h ${totalMinutos % 60}m`;

      // Calcular hs extra o descuento
      // 480 minutos = 8 horas de trabajo esperado por día
      const diasHabiles = getDiasHabiles(mes, anio);
      const minutosEsperados = diasHabiles * 480;
      const diferencia = totalMinutos - minutosEsperados;

      let hsExtra = "0h 0m";
      let hsDescuento = "0h 0m";

      if (diferencia > 0) {
        hsExtra = `${Math.floor(diferencia / 60)}h ${diferencia % 60}m`;
      } else if (diferencia < 0) {
        const absDif = Math.abs(diferencia);
        hsDescuento = `${Math.floor(absDif / 60)}h ${absDif % 60}m`;
      }

      // Crear o actualizar aprobación
      const aprobacion = await Aprobacion.findOneAndUpdate(
        { empleadoId, mes, anio },
        {
          empleadoId,
          mes,
          anio,
          hsTrabajadas,
          hsExtra,
          hsDescuento,
          estado: "aprobado",
          fechaAprobacion: new Date(),
        },
        { upsert: true, new: true }
      );

      aprobaciones.push(aprobacion);
    }

    res.status(201).json({
      message: `${aprobaciones.length} fichaje(s) aprobado(s) correctamente`,
      data: aprobaciones,
    });
  } catch (error) {
    console.error("Error al aprobar fichajes:", error);
    res.status(500).json({ message: "Error al aprobar los fichajes" });
  }
};

// === OBTENER APROBACIONES POR MES/AÑO ===
export const getAprobacionesMes = async (req, res) => {
  try {
    const { mes, anio } = req.query;

    if (!mes || !anio) {
      return res.status(400).json({ message: "Debe enviar mes y año" });
    }

    const aprobaciones = await Aprobacion.find({
      mes: parseInt(mes),
      anio: parseInt(anio),
    }).populate("empleadoId", "nombre apellido numeroLegajo");

    res.status(200).json({
      success: true,
      data: aprobaciones,
    });
  } catch (error) {
    console.error("Error al obtener aprobaciones:", error);
    res.status(500).json({ success: false, message: "Error al obtener aprobaciones" });
  }
};