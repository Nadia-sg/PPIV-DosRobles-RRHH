// src/server.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import licenciasRoutes from "./routes/licencias.routes.js";
import nominaRoutes from "./routes/nomina.routes.js";
import pdfRoutes from "./routes/pdf.routes.js";
import notificacionesRoutes from "./routes/notificaciones.routes.js";
import documentosRoutes from "./routes/documentos.routes.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// Conectar a MongoDB
connectDB();

// Ruta base de prueba
app.get("/", (_, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

// Rutas de API
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/empleados", empleadosRoutes);
app.use("/api/licencias", licenciasRoutes);
app.use("/api/nomina", nominaRoutes);
app.use("/api/pdf", pdfRoutes);
app.use("/api/notificaciones", notificacionesRoutes);
app.use("/api/documentos", documentosRoutes);
app.use("/api/users", authRoutes);

// Iniciar servidor
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en puerto ${PORT}`));