//src/app.js

import express from "express";
import fichajesRoutes from "./routes/fichajes.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";
import cors from 'cors';

const app = express();

// Middleware
app.use(express.json());

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Rutas
app.use("/fichajes", fichajesRoutes);
app.use("/empleados", empleadosRoutes);



export default app;
