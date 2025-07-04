import { Admin, Prisma, UserStatus } from "../../../generated/prisma";
import { TOptions } from "../../types";
import { modifyOptions } from "../../utils/modifyOptions";
import prisma from "../../utils/prisma";
import { adminSearchableFields } from "./admin.constant";
import { TAdminFilterParams } from "./admin.type";

const getAllFromDB = async (params: TAdminFilterParams, options: TOptions) => {
  const { searchTerm, ...filterData } = params;
  const { page, limit, skip, sortBy, sortOrder } = modifyOptions(options);
  const andConditions: Prisma.AdminWhereInput[] = [];

  // Handle filtering and searching
  if (searchTerm) {
    andConditions.push({
      OR: adminSearchableFields.map((field) => {
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

  andConditions.push({
    isDeleted: false,
  });

  const result = await prisma.admin.findMany({
    where: {
      AND: andConditions,
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
  });

  const total = await prisma.admin.count({
    where: {
      AND: andConditions,
    },
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

const getByIdFromDB = async (id: string) => {
  return await prisma.admin.findUnique({
    where: {
      id,
      isDeleted: false,
    },
  });
};

const updateIntoDB = async (id: string, data: Partial<Admin>) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  return await prisma.admin.update({
    where: {
      id,
    },
    data,
  });
};
// const deleteFromDB = async (id: string) => {
//   await prisma.admin.findUniqueOrThrow({
//     where: {
//       id,
//       isDeleted: false,
//     },
//   });

//   const result = await prisma.$transaction(async (tx) => {
//     const deletedAdmin = await tx.admin.delete({
//       where: {
//         id,
//       },
//     });
//     await tx.user.delete({
//       where: {
//         email: deletedAdmin.email,
//       },
//     });
//     return deletedAdmin;
//   });

//   return result;
// };

const deleteFromDB = async (id: string) => {
  await prisma.admin.findUniqueOrThrow({
    where: {
      id,
      isDeleted: false,
    },
  });

  const result = await prisma.$transaction(async (tx) => {
    const deletedAdmin = await tx.admin.update({
      where: {
        id,
      },
      data: {
        isDeleted: true,
      },
    });
    await tx.user.update({
      where: {
        email: deletedAdmin.email,
      },
      data: {
        status: UserStatus.DELETED,
      },
    });
    return deletedAdmin;
  });

  return result;
};

export const AdminService = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
