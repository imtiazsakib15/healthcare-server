import { Admin, UserStatus } from "../../../generated/prisma";
import { filterAndPaginate } from "../../utils/filterAndPaginate";
import prisma from "../../utils/prisma";
import { adminFilterableFields, adminSearchableFields } from "./admin.constant";

const getAllFromDB = async (query: Record<string, unknown>) => {
  return await filterAndPaginate(
    prisma.admin,
    query,
    adminFilterableFields,
    adminSearchableFields
  );
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
