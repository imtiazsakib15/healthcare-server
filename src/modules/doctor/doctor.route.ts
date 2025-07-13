import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.put("/:id", DoctorController.updateDoctor);

export const DoctorRoutes = router;
