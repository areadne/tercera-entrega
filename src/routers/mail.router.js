import { Router } from "express";
import {
  sendEmailController,
  resetearClaveController,
  cambioClaveController,
  getResetearClaveController,
} from "../controllers/password.controller.js";


const router = Router();

router.post("/sendemail", sendEmailController);

router.get("/cambiodeclave", cambioClaveController);

router.get("/resetearclave", getResetearClaveController);

router.post("/resetearclave", resetearClaveController);

export default router;
