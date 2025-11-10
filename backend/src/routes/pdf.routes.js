import express from "express";
import {
  generarReciboPDF,
  generarRecibosMultiples,
} from "../controllers/pdf.controller.js";

const router = express.Router();

// Descargar recibo individual en PDF
router.get("/recibo/:nominaId", generarReciboPDF);

// Obtener recibos disponibles para descargar (período)
router.post("/recibos/disponibles", generarRecibosMultiples);

export default router;
