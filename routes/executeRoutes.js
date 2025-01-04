import { Router } from "express";
import { executeCodeController } from "../controllers/executeController.js";

const router = Router();

router.post("/execute", executeCodeController);

export default router;
