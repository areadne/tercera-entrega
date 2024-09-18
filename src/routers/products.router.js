import { Router } from "express";
// import "/Users/luis_/OneDrive/Documents/Areadne/Backend/Primera-pre-entrega/src/data/products.json" assert { type: "json" };
import {
  limitHandlerController,
  getProductByIdController,
  addProductController,
  updateProductController,
  deleteProductController,
} from "../controllers/products.controller.js";

const router = Router();

router.post("/", addProductController);

router.get("/", limitHandlerController);

router.get("/:pid", getProductByIdController);

router.put("/:pid", updateProductController);

router.delete("/:pid", deleteProductController);

export default router;
