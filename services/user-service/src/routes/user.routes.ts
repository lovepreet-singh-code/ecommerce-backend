import { Router } from "express";
import {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
} from "../controllers/user.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.get("/me", authMiddleware, getProfile);
router.put("/me", authMiddleware, updateProfile);
router.put("/change-password", authMiddleware, changePassword);
router.delete("/me", authMiddleware, deleteAccount);

export default router;
