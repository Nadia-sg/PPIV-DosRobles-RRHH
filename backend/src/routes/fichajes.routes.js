//src/routes/fichajes.routes.js

import express from "express";
import { iniciarJornada } from "../controllers/fichajes.controller.js";

const router = express.Router();

// Ruta para iniciar jornada
router.post("/inicio", iniciarJornada);

export default router;
