// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js"; 

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Conectar a MongoDB
connectDB();

// Servir las imágenes estáticas (carpeta uploads)
app.use("/uploads", express.static("src/uploads"));

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));