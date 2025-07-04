import { uploadToCloudinary } from "./../../helpers/fileUploader";
import { Request } from "express";
import { Prisma, UserRole } from "../../../generated/prisma";
import { hashPassword } from "../../helpers/bcryptHelper";
import prisma from "../../utils/prisma";
import { modifyOptions } from "../../utils/modifyOptions";
import { userSearchableFields, userFilterableFields } from "./user.constant";
import { pick } from "../../utils/pick";

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
  const { searchTerm, ...filterData } = pick(query, userFilterableFields);
  const options = pick(query, ["page", "limit", "sortBy", "sortOrder"]);

  const { page, limit, skip, sortBy, sortOrder } = modifyOptions(options);
  const andConditions: Prisma.UserWhereInput[] = [];

  // Handle filtering and searching
  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => {
        return {
          [field]: {
            contains: searchTerm,
            mode: "insensitive",
          },
        };
      }),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push(filterData);
  }

  const whereConditions: Prisma.UserWhereInput | undefined =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : undefined;

  const result = await prisma.user.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.user.count({
    where: whereConditions,
  });
  return {
    meta: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

export const UserService = { createAdmin, createDoctor, getAllFromDB };
