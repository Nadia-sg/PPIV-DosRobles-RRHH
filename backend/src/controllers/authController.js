// src/controllers/authController.js
import Usuario from "../models/Usuario.js";
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
  const { username, password, role } = req.body;

  try {
    const userExists = await Usuario.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const newUser = new Usuario({
      username,
      password,
      role: role || "empleado", // si no se envía, será empleado
    });

    await newUser.save();

    res.status(201).json({ message: "Usuario creado correctamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};
