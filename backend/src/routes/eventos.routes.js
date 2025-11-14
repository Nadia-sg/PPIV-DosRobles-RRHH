//routes/EventosCard.routes.jsx

import express from "express";
import { getEventos, crearEvento, actualizarEvento, eliminarEvento } from "../controllers/eventos.controller.js";

const router = express.Router();

router.get("/", getEventos);
router.post("/", crearEvento);
router.put("/:id", actualizarEvento);     
router.delete("/:id", eliminarEvento);     

export default router;