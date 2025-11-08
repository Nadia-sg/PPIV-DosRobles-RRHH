// src/controllers/empleadoController.js
import Empleado from "../models/Empleado.js";

/* =========================================================
   CREAR NUEVO EMPLEADO
   - Genera automáticamente un número de legajo secuencial
   ========================================================= */
export const crearEmpleado = async (req, res) => {
  try {
    // Buscar el último legajo registrado (ordenado de mayor a menor)
    const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });

    // Calcular el siguiente número de legajo
    let nuevoLegajo = 1;
    if (ultimoEmpleado && ultimoEmpleado.numeroLegajo) {
      nuevoLegajo = parseInt(ultimoEmpleado.numeroLegajo, 10) + 1;
    }

    // Crear el nuevo empleado
    const nuevoEmpleado = new Empleado({
      ...req.body,
      numeroLegajo: nuevoLegajo.toString().padStart(4, "0"), // Ej: 0001, 0002, 0003...
    });

    await nuevoEmpleado.save();

    res.status(201).json({
      message: "Empleado registrado con éxito",
      empleado: nuevoEmpleado,
    });
  } catch (error) {
    console.error("❌ Error al crear empleado:", error);
    res.status(500).json({
      error: "Error al registrar el empleado",
      detalle: error.message,
    });
  }
};

/* =========================================================
   OBTENER TODOS LOS EMPLEADOS
   ========================================================= */
export const obtenerEmpleados = async (req, res) => {
  try {
    const empleados = await Empleado.find().sort({ numeroLegajo: 1 });
    res.status(200).json(empleados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

/* =========================================================
   OBTENER EMPLEADO POR ID
   ========================================================= */
export const obtenerEmpleadoPorId = async (req, res) => {
  try {
    const empleado = await Empleado.findById(req.params.id);
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json(empleado);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

/* =========================================================
   ACTUALIZAR EMPLEADO
   ========================================================= */
export const actualizarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado actualizado", empleado });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar empleado" });
  }
};

/* =========================================================
   ELIMINAR EMPLEADO
   ========================================================= */
export const eliminarEmpleado = async (req, res) => {
  try {
    const empleado = await Empleado.findByIdAndDelete(req.params.id);
    if (!empleado) {
      return res.status(404).json({ error: "Empleado no encontrado" });
    }
    res.status(200).json({ message: "Empleado eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar empleado" });
  }
};

/* =========================================================
   OBTENER PRÓXIMO NÚMERO DE LEGAJO
   ========================================================= */
export const obtenerProximoLegajo = async (req, res) => {
  try {
    const ultimoEmpleado = await Empleado.findOne().sort({ numeroLegajo: -1 });
    let nuevoLegajo = 1;
    if (ultimoEmpleado && ultimoEmpleado.numeroLegajo) {
      nuevoLegajo = parseInt(ultimoEmpleado.numeroLegajo, 10) + 1;
    }
    res.status(200).json({ proximoLegajo: nuevoLegajo.toString().padStart(4, "0") });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el próximo número de legajo" });
  }
};


