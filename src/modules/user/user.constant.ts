import { Prisma } from "../../../generated/prisma";

export const userFilterableFields = ["searchTerm", "email", "role", "status"];

export const userSearchableFields: (keyof Prisma.UserWhereInput)[] = ["email"];

export const userSelectedFields: (keyof Prisma.UserWhereInput)[] = [
  "id",
  "email",
  "role",
  "needPasswordChange",
  "status",
  "createdAt",
  "updatedAt",
  "admin",
  "doctor",
  "patient",
];
