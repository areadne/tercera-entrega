import { Router } from "express";
import { addCarController, getCarController, getCarByIdController } from "../controllers/car.controller.js";

const router = Router();

router.post("/", addCarController);

router.get("/", getCarController);

router.get("/:idcar", getCarByIdController);

export default router;
