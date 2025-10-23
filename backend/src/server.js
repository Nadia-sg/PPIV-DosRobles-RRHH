// src/server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";

dotenv.config(); // carga las variables del archivo .env

const app = express();

// Middleware básico
app.use(express.json());

// Conectar a MongoDB
connectDB();

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
