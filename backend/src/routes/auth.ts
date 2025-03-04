import {
  Router,
} from "express";
import { login, protectedRoute } from "../controllers/authController";
import authMiddleware from "../middleware/auth";

const router = Router();

router.post("/login", login);
router.get("/protected", authMiddleware, protectedRoute);

export default router;
