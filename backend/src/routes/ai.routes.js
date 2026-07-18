import express from 'express'

import { protect } from "../middleware/auth.middleware.js";
import { translate, improve, friendly, formal } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/translate", protect, translate);

router.post("/improve", protect, improve);

router.post("/friendly", protect, friendly);

router.post("/formal", protect, formal);

export default router