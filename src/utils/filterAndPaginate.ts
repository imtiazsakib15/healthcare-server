import { sep } from "path";
import { Prisma } from "../../generated/prisma";
import { modifyOptions } from "./modifyOptions";
import { pick } from "./pick";

export const filterAndPaginate = async (
  model: { findMany: Function; count: Function },
  query: Record<string, unknown>,
  filterableFields: string[],
  searchableFields: string[],
  selectedFields: string[] = []
) => {
  const { searchTerm, ...filterData } = pick(query, filterableFields);
  const options = pick(query, ["page", "limit", "sortBy", "sortOrder"]);

  const { page, limit, skip, sortBy, sortOrder } = modifyOptions(options);
  const andConditions: Prisma.UserWhereInput[] = [];

  // Handle filtering and searching
  if (searchTerm) {
    andConditions.push({
      OR: searchableFields.map((field) => {
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

  const selectConditions = selectedFields.reduce<Record<string, boolean>>(
    (acc, curr) => {
      acc[curr] = true;
      return acc;
    },
    {}
  );

  const result = await model.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy: {
      [sortBy as string]: sortOrder,
    },
    select: selectedFields.length ? selectConditions : undefined,
    // select: {
    //   admin: true,
    // },
  });

  const total = await model.count({
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
