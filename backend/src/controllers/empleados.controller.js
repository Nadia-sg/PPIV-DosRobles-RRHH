// src/controllers/empleados.controller.js
import Empleado from "../models/Empleado.js";

export const crearEmpleado = async (req, res) => {
  try {
    const { nombre, apellido, email } = req.body;
    const empleado = new Empleado({ nombre, apellido, email });
    await empleado.save();
    res.status(201).json(empleado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando empleado" });
  }
};