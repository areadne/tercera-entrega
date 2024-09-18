import { Router } from "express";
import { sendEmailController, resetearClaveController } from "../controllers/password.controller.js";

const router = Router();

router.post("/sendemail", sendEmailController);

router.post("/resetearclave", resetearClaveController);


export default router;
