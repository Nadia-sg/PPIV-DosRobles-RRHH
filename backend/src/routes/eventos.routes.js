import express from "express";
import { getEventos, crearEvento } from "../controllers/eventos.controller.js";

const router = express.Router();

router.get("/", getEventos);
router.post("/", crearEvento);

export default router;