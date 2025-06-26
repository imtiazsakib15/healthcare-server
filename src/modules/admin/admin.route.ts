import { Router } from "express";
import { AdminController } from "./admin.controller";

const router = Router();

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.put("/:id", AdminController.updateIntoDB);

router.delete("/:id", AdminController.deleteFromDB);

export const AdminRoutes = router;
