import { Router } from "express";
import { SpecialtyController } from "./specialty.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { upload } from "../../helpers/fileUploader";
import { SpecialtyValidation } from "./specialty.validation";

const router = Router();

router.post(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req, res, next) => {
    const data = JSON.parse(req.body.data);

    const parsedData = SpecialtyValidation.create.parse(data);
    req.body = parsedData;

    SpecialtyController.createSpecialty(req, res, next);
  }
);

router.get("/", SpecialtyController.getFromDB);

export const SpecialtyRoutes = router;
