import { Router } from "express";
import {
  loginController,
  registerController,
  tokenController,
} from "../controllers/authControllers.js";
import {
  loginMiddleware,
  registerMiddleware,
} from "../middlewares/authMiddleware.js";
import tokenVerify from "../middlewares/tokenVerify.js";
import validateSchemas from "../middlewares/validateSchemas.js";
import { signUpSchema, loginSchema } from "../schemas/authSchemas.js";

const router = Router();

router.post(
  "/sign-up",
  validateSchemas(signUpSchema),
  registerMiddleware,
  registerController
);
router.post(
  "/signin",
  validateSchemas(loginSchema),
  loginMiddleware,
  loginController
);
router.post("/token", tokenVerify, tokenController);

export default router;
