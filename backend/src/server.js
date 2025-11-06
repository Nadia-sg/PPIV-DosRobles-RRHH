// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config(); // carga las variables del archivo .env

const app = express();

// Middleware básico
app.use(express.json());

app.use(cors());

// Conectar a MongoDB
connectDB();

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

// Ruta del login
app.use("/api/auth", authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
