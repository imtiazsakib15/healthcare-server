import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { upload } from "../../helpers/fileUploader";
import { UserValidationSchema } from "./user.validation";

const router = Router();

router.post(
  "/create-admin",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req, res, next) => {
    const data = JSON.parse(req.body.data);

    const parsedData = UserValidationSchema.createAdmin.parse(data);
    req.body = parsedData;

    UserController.createAdmin(req, res, next);
  }
);

router.post(
  "/create-doctor",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  upload.single("file"),
  (req, res, next) => {
    const data = JSON.parse(req.body.data);

    const parsedData = UserValidationSchema.createDoctor.parse(data);
    req.body = parsedData;

    UserController.createDoctor(req, res, next);
  }
);

router.get(
  "/",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  UserController.getAllFromDB
);

export const UserRoutes = router;
