import { Router, response } from "express";
import { chatController } from "../controllers/chat.controller.js";
import { chatUserRoutes } from "../middlewares/middleware.js";
const router = Router();

router.get("/", chatUserRoutes, chatController);

export default router;
