import { TOptions, TOptionsReturn } from "../types";

export const modifyOptions = (options: TOptions): TOptionsReturn => {
  const {
    page = 1,
    limit = 12,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = options;
  return {
    page: Number(page),
    limit: Number(limit),
    sortBy,
    sortOrder,
    skip: (Number(page) - 1) * Number(limit),
  };
};
