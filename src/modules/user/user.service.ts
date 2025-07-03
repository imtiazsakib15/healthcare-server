import { uploadToCloudinary } from "./../../helpers/fileUploader";
import { Request } from "express";
import { UserRole } from "../../../generated/prisma";
import { hashPassword } from "../../helpers/bcryptHelper";
import prisma from "../../utils/prisma";

const createAdmin = async (req: Request) => {
  const { password, admin } = req.body;

  if (req.file) {
    const image = await uploadToCloudinary(req.file);
    admin.profilePhoto = image.secure_url;
  }
  const result = await prisma.$transaction(async (tx) => {
    const userInfo = {
      email: admin.email,
      password: await hashPassword(password),
      role: UserRole.ADMIN,
    };
    await tx.user.create({
      data: userInfo,
    });
    const createdAdmin = await tx.admin.create({
      data: admin,
    });

    return createdAdmin;
  });

  return result;
};

export const UserService = { createAdmin };
