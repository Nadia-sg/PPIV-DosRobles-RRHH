import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import {
  obtenerTodosLosDocumentos,
  obtenerDocumentos,
  crearDocumento,
  obtenerDocumentoById,
  descargarDocumento,
  eliminarDocumento,
} from "../controllers/documentos.controller.js";

const router = express.Router();

// Configurar multer para subida de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadDir = path.join(__dirname, "../../uploads/documentos");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generar nombre temporal, el controller lo renombrará después
    cb(null, `temp_${Date.now()}_${Math.random().toString(36).substring(7)}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Solo aceptar PDFs
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten archivos PDF"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB máximo
  },
});

// NOTA: Las rutas más específicas DEBEN ir ANTES que las genéricas con :id

// DEBUG: Obtener todos los documentos sin filtro
router.get("/debug/todos", obtenerTodosLosDocumentos);

// Crear nuevo documento con archivo (POST debe ir antes que GET)
router.post("/", upload.single("archivo"), crearDocumento);

// Descargar documento (DEBE ir ANTES que /:id porque es más específico)
router.get("/:id/descargar", descargarDocumento);

// Obtener documentos de un empleado (filtra por query param empleadoId)
router.get("/", obtenerDocumentos);

// Obtener documento por ID (DEBE ir DESPUÉS que /documentos y /:id/descargar)
router.get("/:id", obtenerDocumentoById);

// Eliminar documento
router.delete("/:id", eliminarDocumento);

export default router;
