import Usuario from "../models/Usuario.js";
import Empleado from "../models/Empleado.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_secreta_super_segura";

// Login - Autenticar usuario
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar entrada
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username y password son requeridos",
      });
    }

    // Buscar usuario
    const usuario = await Usuario.findOne({ username }).populate("empleadoId");

    if (!usuario) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Verificar que el usuario esté activo
    if (!usuario.estado) {
      return res.status(401).json({
        success: false,
        message: "Usuario desactivado",
      });
    }

    // Comparar contraseña
    const passwordValida = await bcrypt.compare(password, usuario.password);

    if (!passwordValida) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas",
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        usuarioId: usuario._id,
        empleadoId: usuario.empleadoId._id,
        username: usuario.username,
        rol: usuario.rol,
      },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    // Retornar token y datos del usuario
    return res.status(200).json({
      success: true,
      message: "Login exitoso",
      token,
      usuario: {
        id: usuario._id,
        empleadoId: usuario.empleadoId._id,
        username: usuario.username,
        nombre: usuario.empleadoId.nombre,
        apellido: usuario.empleadoId.apellido,
        email: usuario.empleadoId.email,
        rol: usuario.empleadoId.rol,
        estado: usuario.estado,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({
      success: false,
      message: "Error al procesar el login",
      error: error.message,
    });
  }
};

// Verificar token - Endpoint para validar token al cargar la app
export const verificarToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // Obtener usuario actualizado de la BD
    const usuario = await Usuario.findById(decoded.usuarioId).populate(
      "empleadoId"
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
        empleadoId: usuario.empleadoId._id,
        username: usuario.username,
        nombre: usuario.empleadoId.nombre,
        apellido: usuario.empleadoId.apellido,
        email: usuario.empleadoId.email,
        rol: usuario.empleadoId.rol,
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

// Logout
export const logout = (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Logout exitoso",
  });
};

// Crear usuario de prueba (para testing, eliminar después)
export const crearUsuarioPrueba = async (req, res) => {
  try {
    const { empleadoId, username, password, rol } = req.body;

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

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const usuario = new Usuario({
      empleadoId,
      username,
      password: hashedPassword,
      rol: rol || "empleado",
      estado: true,
    });

    await usuario.save();

    return res.status(201).json({
      success: true,
      message: "Usuario de prueba creado exitosamente",
      usuario: {
        id: usuario._id,
        username: usuario.username,
        rol: usuario.rol,
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
