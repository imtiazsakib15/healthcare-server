import { Prisma } from "../../../generated/prisma";

export const userFilterableFields = ["searchTerm", "email", "role", "status"];

export const userSearchableFields: (keyof Prisma.UserWhereInput)[] = ["email"];
