export type TOptions = {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};
export type TOptionsReturn = Required<TOptions> & {
  skip: number;
};
