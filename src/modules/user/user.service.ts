import { UserRole } from "../../../generated/prisma";
import { hashPassword } from "../../helpers/bcryptHelper";
import prisma from "../../utils/prisma";

const createAdmin = async (data: any) => {
  const result = await prisma.$transaction(async (tx) => {
    const userInfo = {
      email: data.admin.email,
      password: await hashPassword(data.password),
      role: UserRole.ADMIN,
    };
    await tx.user.create({
      data: userInfo,
    });
    const createdAdmin = await tx.admin.create({
      data: data.admin,
    });

    return createdAdmin;
  });

  return result;
};

export const UserService = { createAdmin };
