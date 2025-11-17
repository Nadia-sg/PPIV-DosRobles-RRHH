// src/controllers/authController.js
import Usuario from "../models/Usuario.js";
import Empleado from "../models/Empleado.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { getJwtSecret, JWT_EXPIRES_IN } from "../config/jwt.js";

// === LOGIN ===
export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const usuario = await Usuario.findOne({ username }).populate("empleado");
    if (!usuario) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, usuario.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token incluyendo el rol
    const jwtSecret = getJwtSecret();

    const token = jwt.sign(
      {
        usuarioId: usuario._id,
        empleadoId: usuario.empleado._id,
        username: usuario.username,
        role: usuario.role
      },
      jwtSecret,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: {
        id: usuario._id,
        empleadoId: usuario.empleado._id,
        username: usuario.username,
        nombre: usuario.empleado.nombre,
        apellido: usuario.empleado.apellido,
        email: usuario.empleado.email,
        role: usuario.role,
        empleado: usuario.empleado, // ← incluye nombre, apellido, imagen, etc.
      },
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

    // Si se envía una nueva contraseña, asignarla directamente
    // El middleware pre-save se encargará de hashearla
    if (password && password.trim() !== "") {
      usuario.password = password;
    }

    await usuario.save();
    res.status(200).json({ message: "Usuario actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({ message: "Error al actualizar usuario" });
  }
};

// Eliminar usuario
export const eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // También desvincular al empleado si lo tenía asignado
    await Empleado.updateOne({ usuario: usuario._id }, { $unset: { usuario: "" } });

    res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).json({ message: "Error al eliminar usuario" });
  }
};

// === LOGOUT ===
export const logout = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No hay token para logout",
      });
    }

    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);

    // Obtener usuario que se está desconectando
    const usuario = await Usuario.findById(decoded.usuarioId).populate("empleado");

    if (!usuario) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado",
      });
    }

    // Log de logout (auditoría)
    console.log(`📤 [LOGOUT] ${usuario.username} se desconectó a las ${new Date().toLocaleString()}`);

    return res.status(200).json({
      success: true,
      message: "Logout exitoso",
      data: {
        usuarioId: usuario._id,
        username: usuario.username,
        nombre: usuario.empleado?.nombre,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error("Error en logout:", error);
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
    });
  }
};

// === VERIFICAR TOKEN ===
export const verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
    }

    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);

    // Obtener usuario actualizado de la BD
    const usuario = await Usuario.findById(decoded.usuarioId).populate(
      "empleado"
    );

    if (!usuario || !usuario.estado) {
      return res.status(401).json({
        success: false,
        message: "Usuario no válido",
      });
    }

    return res.status(200).json({
      success: true,
      usuario: {
        id: usuario._id,
        empleadoId: usuario.empleado._id,
        username: usuario.username,
        nombre: usuario.empleado.nombre,
        apellido: usuario.empleado.apellido,
        email: usuario.empleado.email,
        role: usuario.role,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error("Error verificando token:", error);
    return res.status(401).json({
      success: false,
      message: "Token inválido",
    });
  }
};

// === CREAR USUARIO DE PRUEBA ===
export const crearUsuarioPrueba = async (req, res) => {
  try {
    const { empleadoId, username, password, role } = req.body;

    // Validar que el empleado exista
    const empleado = await Empleado.findById(empleadoId);
    if (!empleado) {
      return res.status(404).json({
        success: false,
        message: "Empleado no encontrado",
      });
    }

    // Verificar si el usuario ya existe
    const usuarioExistente = await Usuario.findOne({ username });
    if (usuarioExistente) {
      return res.status(400).json({
        success: false,
        message: "El username ya existe",
      });
    }

    // Crear usuario
    // Nota: El middleware pre-save se encargará de hashear la contraseña
    const usuario = new Usuario({
      empleado: empleadoId,
      username,
      password,
      role: role || "empleado",
      estado: true,
    });

    await usuario.save();

    return res.status(201).json({
      success: true,
      message: "Usuario de prueba creado exitosamente",
      usuario: {
        id: usuario._id,
        username: usuario.username,
        role: usuario.role,
      },
    });
  } catch (error) {
    console.error("Error al crear usuario de prueba:", error);
    return res.status(500).json({
      success: false,
      message: "Error al crear usuario",
      error: error.message,
    });
  }
};
