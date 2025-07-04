import { uploadToCloudinary } from "./../../helpers/fileUploader";
import { Request } from "express";
import { Prisma, UserRole } from "../../../generated/prisma";
import { hashPassword } from "../../helpers/bcryptHelper";
import prisma from "../../utils/prisma";
import { modifyOptions } from "../../utils/modifyOptions";
import { userSearchableFields, userFilterableFields } from "./user.constant";
import { pick } from "../../utils/pick";
import { filterAndPaginate } from "../../utils/filterAndPaginate";

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
const createDoctor = async (req: Request) => {
  const { password, doctor } = req.body;

  if (req.file) {
    const image = await uploadToCloudinary(req.file);
    doctor.profilePhoto = image.secure_url;
  }
  const result = await prisma.$transaction(async (tx) => {
    const userInfo = {
      email: doctor.email,
      password: await hashPassword(password),
      role: UserRole.DOCTOR,
    };
    await tx.user.create({
      data: userInfo,
    });
    const createdDoctor = await tx.doctor.create({
      data: doctor,
    });

    return createdDoctor;
  });

  return result;
};

const getAllFromDB = async (query: Record<string, unknown>) => {
  return await filterAndPaginate(
    prisma.user,
    query,
    userFilterableFields,
    userSearchableFields
  );
};

export const UserService = { createAdmin, createDoctor, getAllFromDB };
