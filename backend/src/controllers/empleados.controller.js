// src/controllers/empleados.controller.js
import Empleado from "../models/Empleado.js";

// Obtener todos los empleados
export const obtenerEmpleados = async (req, res) => {
  try {
    const { estado, area } = req.query;

    // Construir filtro
    const filtro = {};

    if (estado) {
      filtro.estado = estado;
    }

    if (area) {
      filtro.area = area;
    }

    const empleados = await Empleado.find(filtro).sort({ nombre: 1 });

    res.json({
      success: true,
      data: empleados,
      total: empleados.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener empleados",
      error: error.message,
    });
  }
};

// Obtener un empleado por ID
export const obtenerEmpleadoById = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findById(id);

    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    res.json({
      success: true,
      data: empleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener empleado",
      error: error.message,
    });
  }
};

// Obtener un empleado por legajo
export const obtenerEmpleadoPorLegajo = async (req, res) => {
  try {
    const { legajo } = req.params;

    const empleado = await Empleado.findOne({ legajo });

    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    res.json({
      success: true,
      data: empleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al obtener empleado",
      error: error.message,
    });
  }
};

// Crear nuevo empleado
export const crearEmpleado = async (req, res) => {
  try {
    const {
      legajo,
      dni,
      cuil,
      nombre,
      apellido,
      email,
      telefono,
      area,
      puesto,
      categoria,
      modalidadContratacion,
      jornada,
      fechaAlta,
      sueldoBasico,
      banco,
      cbu,
      obraSocial,
      art,
    } = req.body;

    // Validaciones
    if (!legajo || !dni || !cuil || !nombre || !apellido || !email || !area || !puesto || !categoria) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    // Verificar que el email, DNI, CUIL y legajo sean únicos
    const empleadoExistente = await Empleado.findOne({
      $or: [{ email }, { dni }, { cuil }, { legajo }],
    });

    if (empleadoExistente) {
      return res.status(400).json({
        success: false,
        message: "El email, DNI, CUIL o legajo ya están registrados",
      });
    }

    // Crear empleado
    const nuevoEmpleado = new Empleado({
      legajo,
      dni,
      cuil,
      nombre,
      apellido,
      email,
      telefono,
      area,
      puesto,
      categoria,
      modalidadContratacion,
      jornada,
      fechaAlta: fechaAlta || new Date(),
      sueldoBasico,
      banco,
      cbu,
      obraSocial,
      art,
    });

    await nuevoEmpleado.save();

    res.status(201).json({
      success: true,
      message: "Empleado creado exitosamente",
      data: nuevoEmpleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al crear empleado",
      error: error.message,
    });
  }
};

// Actualizar empleado
export const actualizarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;
    const actualizaciones = req.body;

    // No permitir actualizar ciertos campos
    delete actualizaciones.legajo;
    delete actualizaciones.dni;
    delete actualizaciones.cuil;

    const empleado = await Empleado.findByIdAndUpdate(id, actualizaciones, {
      new: true,
      runValidators: true,
    });

    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Empleado actualizado exitosamente",
      data: empleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al actualizar empleado",
      error: error.message,
    });
  }
};

// Desactivar empleado
export const desactivarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByIdAndUpdate(
      id,
      { estado: "inactivo" },
      { new: true }
    );

    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Empleado desactivado",
      data: empleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al desactivar empleado",
      error: error.message,
    });
  }
};

// Eliminar empleado
export const eliminarEmpleado = async (req, res) => {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByIdAndDelete(id);

    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    res.json({
      success: true,
      message: "Empleado eliminado",
      data: empleado,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error al eliminar empleado",
      error: error.message,
    });
  }
};