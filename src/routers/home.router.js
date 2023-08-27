import { Router } from "express";
import {
  homeController,
  productsController,
} from "../controllers/home.controller.js";
import { adminRoutes } from "../middlewares/middleware.js";

const router = Router();

router.get("/", homeController);
router.get("/manageproducts", adminRoutes, productsController);

export default router;
