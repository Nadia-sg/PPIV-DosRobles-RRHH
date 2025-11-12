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
export const registrarUsuario = async (req, res) => {
  try {
    const { legajo, username, password, role } = req.body;

    // Buscar empleado por número de legajo
    const empleado = await Empleado.findOne({ numeroLegajo: legajo });
    if (!empleado) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    // Verificar si ya tiene usuario asignado
    if (empleado.usuario) {
      return res.status(400).json({ message: "Este empleado ya tiene un usuario asignado" });
    }

    // Crear usuario y vincularlo al empleado
    const nuevoUsuario = new Usuario({
      username,
      password,
      role,
      empleado: empleado._id,
    });

    await nuevoUsuario.save();

    // Actualizar el empleado con el ID del usuario
    empleado.usuario = nuevoUsuario._id;
    await empleado.save();

    res.status(201).json(nuevoUsuario);
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ message: "Error al registrar usuario" });
  }
};

// Lista de los usuarios
export const obtenerUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.find().populate("empleado");
    res.status(200).json(usuarios);
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// Para editar los datos del usuario creado
export const actualizarUsuario = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar campos
    if (username) usuario.username = username;
    if (role) usuario.role = role;

    // Si se envía una nueva contraseña, encriptarla
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(password, salt);
    }

    await usuario.save();
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};
