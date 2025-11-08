// src/routes/empleadoRoutes.js
import express from "express";
import multer from "multer";
import path from "path";
import {
  crearEmpleado,
  obtenerEmpleados,
  obtenerEmpleadoPorId,
  actualizarEmpleado,
  eliminarEmpleado,
  obtenerProximoLegajo,
} from "../controllers/empleadoController.js";

const router = express.Router();

// Configuración de multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // máx 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedTypes.test(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Formato de imagen no permitido"));
    }
  },
});

// Rutas
router.get("/proximo-legajo", obtenerProximoLegajo);
router.post("/", upload.single("imagenPerfil"), crearEmpleado);
router.get("/", obtenerEmpleados);
router.get("/:id", obtenerEmpleadoPorId);
router.put("/:id", upload.single("imagenPerfil"), actualizarEmpleado);
router.delete("/:id", eliminarEmpleado);

export default router;