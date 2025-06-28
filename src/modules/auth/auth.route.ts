import { Router } from "express";
import { AuthController } from "./auth.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AuthValidation } from "./auth.validation";

const router = Router();

router.post(
  "/login",
  validateRequest(AuthValidation.login),
  AuthController.login
);
router.post("/refresh-token", AuthController.refreshToken);

export const AuthRoutes = router;
