import { Router } from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Public Routes
router.get("/", getProducts);
router.get("/:id", getProductById);

// Protected Routes
router.post("/", authMiddleware, roleMiddleware(["admin", "vendor"]), createProduct);
router.put("/:id", authMiddleware, roleMiddleware(["admin", "vendor"]), updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware(["admin", "vendor"]), deleteProduct);

export default router;
