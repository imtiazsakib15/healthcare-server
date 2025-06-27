import { Router } from "express";
import { AdminController } from "./admin.controller";
import { validateRequest } from "../../middlewares/validateRequest";
import { AdminValidationSchema } from "./admin.validation";

const router = Router();

router.get("/", AdminController.getAllFromDB);

router.get("/:id", AdminController.getByIdFromDB);

router.put(
  "/:id",
  validateRequest(AdminValidationSchema.update),
  AdminController.updateIntoDB
);

router.delete("/:id", AdminController.deleteFromDB);

export const AdminRoutes = router;
