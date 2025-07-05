import { uploadToCloudinary } from "./../../helpers/fileUploader";
import { Request } from "express";
import { User, UserRole, UserStatus } from "../../../generated/prisma";
import { hashPassword } from "../../helpers/bcryptHelper";
import prisma from "../../utils/prisma";
import {
  userSearchableFields,
  userFilterableFields,
  userSelectedFields,
} from "./user.constant";
import { filterAndPaginate } from "../../utils/filterAndPaginate";
import { TDecodedUser } from "../../types";

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
    userSearchableFields,
    userSelectedFields
  );
};

const updateUserStatus = async (id: string, data: { status: UserStatus }) => {
  await prisma.user.findUniqueOrThrow({
    where: {
      id,
    },
  });

  const result = await prisma.user.update({
    where: { id },
    data,
  });

  return {
    email: result.email,
    status: result.status,
    needPasswordChange: result.needPasswordChange,
  };
};

const getMyProfile = async (user: TDecodedUser) => {
  const result = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  return result;
};

export const UserService = {
  createAdmin,
  createDoctor,
  getAllFromDB,
  updateUserStatus,
  getMyProfile,
};
