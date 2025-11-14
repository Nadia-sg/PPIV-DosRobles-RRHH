// src/app.js
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js"; 
import connectDB from "./config/db.js";

dotenv.config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/fichajes", fichajesRoutes);
app.use("/empleados", empleadosRoutes);
app.use("/eventos", eventosRoutes);

export default app;

