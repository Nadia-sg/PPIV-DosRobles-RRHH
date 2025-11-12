// src/controllers/authController.js
import Usuario from "../models/Usuario.js";
import Empleado from "../models/Empleado.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// === LOGIN ===
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ username });
    if (!usuario) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token incluyendo el rol
    const token = jwt.sign(
      { id: usuario._id, username: usuario.username, role: usuario.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: { id: usuario._id, username: usuario.username, role: usuario.role },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// === REGISTRO ===
export const registerUser = async (req, res) => {
  const { username, password, role, legajo } = req.body;

  try {
    const userExists = await Usuario.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Buscar empleado por número de legajo
    const empleado = await Empleado.findOne({ numeroLegajo: legajo });
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado con ese número de legajo" });
    }

    // Verificar si el empleado ya tiene usuario asignado
    if (empleado.usuario) {
      return res.status(400).json({ message: "Este empleado ya tiene un usuario asignado" });
    }

    // Crear nuevo usuario
    const newUser = new Usuario({
      username,
      password,
      role: role || "empleado",
    });

    await newUser.save();

    // Vincular usuario al empleado
    empleado.usuario = newUser._id;
    await empleado.save();

    res.status(201).json({ message: "Usuario creado y vinculado correctamente al empleado" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// Lista de los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const usuarios = await Usuario.find();
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};