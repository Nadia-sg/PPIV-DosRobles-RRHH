// src/server.js
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import app from "./app.js";

dotenv.config();

// Conectar a MongoDB
connectDB();

// Ruta base de prueba
app.get("/", (req, res) => {
  res.send("Servidor backend de DosRobles en funcionamiento");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
