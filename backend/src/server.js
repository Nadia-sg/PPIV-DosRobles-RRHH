// src/server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import licenciasRoutes from "./routes/licencias.routes.js";
import nominaRoutes from "./routes/nomina.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import authRoutes from "./routes/auth.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";

dotenv.config(); // carga las variables del archivo .env

const app = express();

// Middleware básico
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Conectar a MongoDB
connectDB();

// Ruta base de prueba
app.get("/", (_, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

// Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/licencias", licenciasRoutes);
app.use("/api/nomina", nominaRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/documentos", documentosRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
