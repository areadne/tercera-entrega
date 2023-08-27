import { Router } from "express";
import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/products.json" assert { type: "json" };
import {
  limitHandlerController,
  getProductByIdController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", limitHandlerController);
router.get("/:pid", getProductByIdController);
router.post("/", addProductController);
router.put("/:pid", updateProductController);
router.delete("/:pid", deleteProductController);

export default router;
