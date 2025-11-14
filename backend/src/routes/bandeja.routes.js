// backend/src/routes/bandeja.routes.js
import express from "express";
import { getMensajes } from "../controllers/bandeja.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const router = express.Router();

// GET /api/bandeja?limit=5
router.get("/", authMiddleware, getMensajes);

export default router;
