//src/app.js

import express from "express";
import fichajesRoutes from "./routes/fichajes.routes.js";
import empleadosRoutes from "./routes/empleados.routes.js";

const app = express();

// Middleware
app.use(express.json());

// Rutas
app.use("/fichajes", fichajesRoutes);
app.use("/empleados", empleadosRoutes);

export default app;
