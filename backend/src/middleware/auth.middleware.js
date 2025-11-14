import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";

/**
 * Middleware de autenticación: verifica que el token JWT sea válido
 * Extrae los datos del usuario del token y los guarda en req.user
 */
export const autenticacion = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      console.log("❌ Token no proporcionado");
      return res.status(401).json({
        success: false,
        message: "Token no proporcionado",
      });
    }

    const jwtSecret = getJwtSecret();
    console.log("🔐 JWT_SECRET siendo usado:", jwtSecret);
    console.log("📌 Token recibido:", token.substring(0, 20) + "...");
    console.log("🔐 JWT_SECRET length:", jwtSecret.length);

    try {
      const decoded = jwt.verify(token, jwtSecret);
      console.log("✅ Token verificado correctamente. Usuario:", decoded.username);

      // Guardar datos del usuario en req.user para usarlos en el controlador
      req.user = {
        usuarioId: decoded.usuarioId,
        empleadoId: decoded.empleadoId,
        username: decoded.username,
        role: decoded.role,
      };

      next();
    } catch (jwtError) {
      console.error("❌ Error JWT específico:", jwtError.message);
      console.error("❌ Nombre del error:", jwtError.name);
      throw jwtError;
    }
  } catch (error) {
    console.error("❌ Error en autenticación:", error.message);
    return res.status(401).json({
      success: false,
      message: "Token inválido o expirado",
      error: error.message,
    });
  }
};

/**
 * Middleware de autorización: verifica que el usuario tenga uno de los roles requeridos
 * @param {string|array} rolesPermitidos - Rol o lista de roles permitidos: ["admin", "empleado"]
 */
export const autorizacion = (rolesPermitidos) => {
  return (req, res, next) => {
    const roles = Array.isArray(rolesPermitidos)
      ? rolesPermitidos
      : [rolesPermitidos];

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Acceso denegado. Se requiere uno de estos roles: ${roles.join(", ")}`,
      });
    }

    next();
  };
};

/**
 * Middleware que valida que el usuario sea propietario del recurso (para empleados)
 * Los admins siempre pueden acceder a cualquier recurso
 * @param {string} paramName - Nombre del parámetro que contiene el empleadoId (ej: empleadoId, id)
 */
export const verificarPropiedad = (paramName = "empleadoId") => {
  return (req, res, next) => {
    // Los admins siempre pueden acceder
    if (req.user.role === "admin") {
      return next();
    }

    // Los empleados solo pueden acceder a sus propios recursos
    const empleadoIdParam = req.params[paramName] || req.body.empleadoId;

    if (empleadoIdParam !== req.user.empleadoId.toString()) {
      return res.status(403).json({
        success: false,
        message: "No tienes permiso para acceder a este recurso",
      });
    }

    next();
  };
};

export default { autenticacion, autorizacion, verificarPropiedad };
