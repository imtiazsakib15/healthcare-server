import { Router } from "express";
import { DoctorController } from "./doctor.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { DoctorValidationSchema } from "./doctor.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";

const router = Router();

router.put(
  "/:id",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR),
  validateRequest(DoctorValidationSchema.update),
  DoctorController.updateDoctor
);

export const DoctorRoutes = router;
