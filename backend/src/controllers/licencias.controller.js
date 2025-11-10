import Licencia from "../models/Licencia.js";
import Empleado from "../models/Empleado.js";
import { Notificacion } from "../models/Notificacion.js";

// Calcular días entre dos fechas
const calcularDias = (fechaInicio, fechaFin) => {
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diferencia = fin - inicio;
  return Math.ceil(diferencia / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir el día inicial
};

// Verificar solapamiento de licencias
const verificarSolapamiento = async (empleadoId, fechaInicio, fechaFin, licenciaIdExcluir = null) => {
  const query = {
    empleadoId,
    estado: { $in: ["pendiente", "aprobado"] },
    $or: [
      {
        fechaInicio: { $lte: new Date(fechaFin) },
        fechaFin: { $gte: new Date(fechaInicio) },
      },
    ],
  };

  // Excluir la licencia actual si es una edición
  if (licenciaIdExcluir) {
    query._id = { $ne: licenciaIdExcluir };
  }

  const solapamiento = await Licencia.findOne(query);
  return solapamiento ? true : false;
};

// Obtener todas las licencias
export const obtenerLicencias = async (req, res) => {
  try {
    const { empleadoId, estado, desde, hasta } = req.query;

    // Construir filtro
    const filtro = {};

    if (empleadoId) {
      filtro.empleadoId = empleadoId;
    }

    if (estado) {
      filtro.estado = estado;
    }

    // Filtro por rango de fechas
    if (desde || hasta) {
      filtro.fechaInicio = {};
      if (desde) {
        filtro.fechaInicio.$gte = new Date(desde);
      }
      if (hasta) {
        filtro.fechaInicio.$lte = new Date(hasta);
      }
    }

    const licencias = await Licencia.find(filtro)
      .populate("empleadoId", "nombre apellido legajo email")
      .populate("gerenteId", "nombre apellido legajo email")
      .sort({ fechaSolicitud: -1 });

    res.json({
      success: true,
      data: licencias,
      total: licencias.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener licencias",
      error: error.message,
    });
  }
};

// Obtener una licencia por ID
export const obtenerLicenciaById = async (req, res) => {
  try {
    const { id } = req.params;

    const licencia = await Licencia.findById(id)
      .populate("empleadoId", "nombre apellido legajo email area puesto")
      .populate("gerenteId", "nombre apellido legajo email");

    if (!licencia) {
      return res.status(404).json({
        success: false,
        message: "Licencia no encontrada",
      });
    }

    res.json({
      success: true,
      data: licencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener licencia",
      error: error.message,
    });
  }
};

// Solicitar nueva licencia
export const solicitarLicencia = async (req, res) => {
  try {
    const { empleadoId, tipoLicencia, fechaInicio, fechaFin, motivo, descripcion } = req.body;

    // Validaciones
    if (!empleadoId || !tipoLicencia || !fechaInicio || !fechaFin) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    // Verificar que el empleado existe
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    // Validar que fechaFin >= fechaInicio
    if (new Date(fechaFin) < new Date(fechaInicio)) {
      return res.status(400).json({
        success: false,
        message: "La fecha de fin debe ser igual o posterior a la fecha de inicio",
      });
    }

    // Verificar solapamiento
    const haysolapamiento = await verificarSolapamiento(empleadoId, fechaInicio, fechaFin);
    if (haysolapamiento) {
      return res.status(400).json({
        success: false,
        message: "Ya existe una licencia solicitada/aprobada en ese período",
      });
    }

    // Calcular días totales
    const diasTotales = calcularDias(fechaInicio, fechaFin);

    // Crear licencia
    const nuevaLicencia = new Licencia({
      empleadoId,
      tipoLicencia,
      fechaInicio,
      fechaFin,
      motivo: motivo || "",
      descripcion: descripcion || "",
      diasTotales,
      estado: "pendiente",
      fechaSolicitud: new Date(),
    });

    await nuevaLicencia.save();

    // Poblar datos del empleado antes de responder
    await nuevaLicencia.populate("empleadoId", "nombre apellido legajo email");

    // Mapeo de tipos de licencia para mensajes legibles
    const tiposLicenciaMap = {
      vacaciones: "vacaciones",
      enfermedad: "licencia por enfermedad",
      asuntos_personales: "ausencia por asuntos personales",
      capacitacion: "licencia de capacitación",
      licencia_medica: "licencia médica",
      otro: "ausencia",
      examen: "licencia por examen",
      cita_medica: "licencia por cita médica",
      ausencia_justificada: "ausencia justificada",
      razones_particulares: "ausencia por razones particulares",
    };

    const tipoLicenciaTexto = tiposLicenciaMap[tipoLicencia] || tipoLicencia;

    // Crear notificaciones automáticas para los gerentes, rrhh y admin
    // TODO: En producción, obtener los gerentes del departamento del empleado
    const gerentesIds = await Empleado.find({ rol: { $in: ["gerente", "rrhh", "admin"] } }).select("_id");

    for (const gerente of gerentesIds) {
      await Notificacion.create({
        empleadoId: gerente._id,
        tipo: "ausencia",
        asunto: `Nueva solicitud de ausencia de ${empleado.nombre} ${empleado.apellido}`,
        descripcion: `${empleado.nombre} ${empleado.apellido} ha solicitado ${tipoLicenciaTexto} desde el ${new Date(fechaInicio).toLocaleDateString("es-AR")} hasta el ${new Date(fechaFin).toLocaleDateString("es-AR")}.`,
        prioridad: "media",
        referenciaId: nuevaLicencia._id.toString(),
        tipoReferencia: "licencia",
        remitenteId: empleadoId,
      });
    }

    res.status(201).json({
      success: true,
      message: "Licencia solicitada exitosamente",
      data: nuevaLicencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al solicitar licencia",
      error: error.message,
    });
  }
};

// Aprobar licencia (solo gerente)
export const aprobarLicencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { gerenteId, comentarioGerente } = req.body;

    // Validar que el gerente existe
    const gerente = await Empleado.findById(gerenteId);
    if (!gerente) {
      return res.status(404).json({
        success: false,
        message: "Gerente no encontrado",
      });
    }

    // Buscar licencia
    const licencia = await Licencia.findById(id);
    if (!licencia) {
      return res.status(404).json({
        success: false,
        message: "Licencia no encontrada",
      });
    }

    // Validar que la licencia esté en estado pendiente
    if (licencia.estado !== "pendiente") {
      return res.status(400).json({
        success: false,
        message: `No se puede aprobar una licencia con estado: ${licencia.estado}`,
      });
    }

    // Actualizar licencia
    licencia.estado = "aprobado";
    licencia.gerenteId = gerenteId;
    licencia.comentarioGerente = comentarioGerente || "";
    licencia.fechaResolucion = new Date();

    await licencia.save();

    // Poblar antes de responder
    await licencia.populate([
      { path: "empleadoId", select: "nombre apellido legajo email" },
      { path: "gerenteId", select: "nombre apellido legajo email" },
    ]);

    // Mapeo de tipos de licencia para mensajes legibles
    const tiposLicenciaMap = {
      vacaciones: "vacaciones",
      enfermedad: "licencia por enfermedad",
      asuntos_personales: "ausencia por asuntos personales",
      capacitacion: "licencia de capacitación",
      licencia_medica: "licencia médica",
      otro: "ausencia",
      examen: "licencia por examen",
      cita_medica: "licencia por cita médica",
      ausencia_justificada: "ausencia justificada",
      razones_particulares: "ausencia por razones particulares",
    };

    const tipoLicenciaTexto = tiposLicenciaMap[licencia.tipoLicencia] || licencia.tipoLicencia;

    // Crear notificación automática para el empleado
    await Notificacion.create({
      empleadoId: licencia.empleadoId._id,
      tipo: "aprobacion",
      asunto: "Tu solicitud de ausencia ha sido aprobada",
      descripcion: `Tu solicitud de ${tipoLicenciaTexto} ha sido aprobada por ${gerente.nombre} ${gerente.apellido}.${comentarioGerente ? ` Comentario: ${comentarioGerente}` : ""}`,
      prioridad: "media",
      referenciaId: licencia._id.toString(),
      tipoReferencia: "licencia",
      remitenteId: gerenteId,
    });

    res.json({
      success: true,
      message: "Licencia aprobada exitosamente",
      data: licencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al aprobar licencia",
      error: error.message,
    });
  }
};

// Rechazar licencia (solo gerente)
export const rechazarLicencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { gerenteId, comentarioGerente } = req.body;

    // Validar que el gerente existe
    const gerente = await Empleado.findById(gerenteId);
    if (!gerente) {
      return res.status(404).json({
        success: false,
        message: "Gerente no encontrado",
      });
    }

    // Buscar licencia
    const licencia = await Licencia.findById(id);
    if (!licencia) {
      return res.status(404).json({
        success: false,
        message: "Licencia no encontrada",
      });
    }

    // Validar que la licencia esté en estado pendiente
    if (licencia.estado !== "pendiente") {
      return res.status(400).json({
        success: false,
        message: `No se puede rechazar una licencia con estado: ${licencia.estado}`,
      });
    }

    // Actualizar licencia
    licencia.estado = "rechazado";
    licencia.gerenteId = gerenteId;
    licencia.comentarioGerente = comentarioGerente || "Sin comentarios";
    licencia.fechaResolucion = new Date();
    licencia.activa = false;

    await licencia.save();

    // Poblar antes de responder
    await licencia.populate([
      { path: "empleadoId", select: "nombre apellido legajo email" },
      { path: "gerenteId", select: "nombre apellido legajo email" },
    ]);

    // Mapeo de tipos de licencia para mensajes legibles
    const tiposLicenciaMap = {
      vacaciones: "vacaciones",
      enfermedad: "licencia por enfermedad",
      asuntos_personales: "ausencia por asuntos personales",
      capacitacion: "licencia de capacitación",
      licencia_medica: "licencia médica",
      otro: "ausencia",
      examen: "licencia por examen",
      cita_medica: "licencia por cita médica",
      ausencia_justificada: "ausencia justificada",
      razones_particulares: "ausencia por razones particulares",
    };

    const tipoLicenciaTexto = tiposLicenciaMap[licencia.tipoLicencia] || licencia.tipoLicencia;

    // Crear notificación automática para el empleado
    await Notificacion.create({
      empleadoId: licencia.empleadoId._id,
      tipo: "rechazo",
      asunto: "Tu solicitud de ausencia ha sido rechazada",
      descripcion: `Tu solicitud de ${tipoLicenciaTexto} ha sido rechazada por ${gerente.nombre} ${gerente.apellido}. ${comentarioGerente ? `Motivo: ${comentarioGerente}` : ""}`,
      prioridad: "media",
      referenciaId: licencia._id.toString(),
      tipoReferencia: "licencia",
      remitenteId: gerenteId,
    });

    res.json({
      success: true,
      message: "Licencia rechazada",
      data: licencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al rechazar licencia",
      error: error.message,
    });
  }
};

// Actualizar licencia (solo si está en estado pendiente)
export const actualizarLicencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipoLicencia, fechaInicio, fechaFin, motivo, descripcion } = req.body;

    // Buscar licencia
    const licencia = await Licencia.findById(id);
    if (!licencia) {
      return res.status(404).json({
        success: false,
        message: "Licencia no encontrada",
      });
    }

    // Validar que la licencia esté en estado pendiente
    if (licencia.estado !== "pendiente") {
      return res.status(400).json({
        success: false,
        message: "Solo se pueden editar licencias en estado pendiente",
      });
    }

    // Si se cambió el rango de fechas, verificar solapamiento
    if (fechaInicio && fechaFin) {
      const haysolapamiento = await verificarSolapamiento(
        licencia.empleadoId,
        fechaInicio,
        fechaFin,
        id
      );
      if (haysolapamiento) {
        return res.status(400).json({
          success: false,
          message: "Ya existe una licencia solicitada/aprobada en ese período",
        });
      }
    }

    // Actualizar campos
    if (tipoLicencia) licencia.tipoLicencia = tipoLicencia;
    if (fechaInicio) licencia.fechaInicio = fechaInicio;
    if (fechaFin) licencia.fechaFin = fechaFin;
    if (motivo) licencia.motivo = motivo;
    if (descripcion) licencia.descripcion = descripcion;

    // Recalcular días si cambió el rango
    if (fechaInicio && fechaFin) {
      licencia.diasTotales = calcularDias(fechaInicio, fechaFin);
    }

    await licencia.save();

    // Poblar antes de responder
    await licencia.populate("empleadoId", "nombre apellido legajo email");

    res.json({
      success: true,
      message: "Licencia actualizada exitosamente",
      data: licencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar licencia",
      error: error.message,
    });
  }
};

// Cancelar licencia
export const cancelarLicencia = async (req, res) => {
  try {
    const { id } = req.params;

    // Buscar licencia
    const licencia = await Licencia.findById(id);
    if (!licencia) {
      return res.status(404).json({
        success: false,
        message: "Licencia no encontrada",
      });
    }

    // Solo se puede cancelar licencias pendientes o aprobadas futuras
    if (licencia.estado === "rechazado") {
      return res.status(400).json({
        success: false,
        message: "No se puede cancelar una licencia rechazada",
      });
    }

    licencia.activa = false;
    licencia.estado = "cancelado";

    await licencia.save();

    res.json({
      success: true,
      message: "Licencia cancelada",
      data: licencia,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al cancelar licencia",
      error: error.message,
    });
  }
};

// Obtener resumen de licencias por empleado
export const obtenerResumenEmpleado = async (req, res) => {
  try {
    const { empleadoId } = req.params;

    // Verificar que el empleado existe
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    // Obtener licencias
    const licencias = await Licencia.find({ empleadoId });

    // Contar por estado
    const pendientes = licencias.filter((l) => l.estado === "pendiente").length;
    const aprobadas = licencias.filter((l) => l.estado === "aprobado").length;
    const rechazadas = licencias.filter((l) => l.estado === "rechazado").length;

    // Calcular total de días tomados
    const diasTomados = licencias
      .filter((l) => l.estado === "aprobado")
      .reduce((total, l) => total + l.diasTotales, 0);

    res.json({
      success: true,
      data: {
        empleado: {
          id: empleado._id,
          nombre: empleado.nombre,
          apellido: empleado.apellido,
          legajo: empleado.legajo,
        },
        resumen: {
          pendientes,
          aprobadas,
          rechazadas,
          diasTomados,
        },
        licencias,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener resumen de licencias",
      error: error.message,
    });
  }
};
