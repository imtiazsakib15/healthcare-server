import { Router } from "express";
import { UserController } from "./user.controller";
import { auth } from "../../middlewares/auth";
import { UserRole } from "../../../generated/prisma";
import { upload } from "../../helpers/fileUploader";
import { UserValidationSchema } from "./user.validation";
import { validateRequest } from "../../middlewares/validateRequest";

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

router.put(
  "/:id/status",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
  validateRequest(UserValidationSchema.updateUserStatus),
  UserController.updateUserStatus
);

router.get(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  UserController.getMyProfile
);

router.put(
  "/me",
  auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT),
  upload.single("file"),
  (req, res, next) => {
    const data = JSON.parse(req.body.data);

    req.body = data;

    UserController.updateMyProfile(req, res, next);
  }
);

export const UserRoutes = router;
