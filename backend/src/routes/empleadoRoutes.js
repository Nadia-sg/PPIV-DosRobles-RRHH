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
  obtenerImagenPerfil,
} from "../controllers/empleadoController.js";

const router = express.Router();

// multer en memoria (graba en req.file.buffer)
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp/;
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowed.test(ext)) cb(null, true);
    else cb(new Error("Formato de imagen no permitido"));
  },
});

// Rutas
router.get("/proximo-legajo", obtenerProximoLegajo);

// crear con posible imagen (campo formdata: 'imagenPerfil')
router.post("/", upload.single("imagenPerfil"), crearEmpleado);

// listado (no incluye el buffer binary en la respuesta)
router.get("/", obtenerEmpleados);

// servir imagen (debe ir antes de la ruta :id)
router.get("/:id/imagen", obtenerImagenPerfil);

// obtener empleado por id
router.get("/:id", obtenerEmpleadoPorId);

// actualizar (puede enviar nueva imagen)
router.put("/:id", upload.single("imagenPerfil"), actualizarEmpleado);

router.delete("/:id", eliminarEmpleado);

export default router;