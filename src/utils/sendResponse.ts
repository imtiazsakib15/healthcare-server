import { Response } from "express";

type TData<T> = {
  statusCode: number;
  success: boolean;
  message: string;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
  data: T;
};

export const sendResponse = <T>(res: Response, data: TData<T>) => {
  return res.status(data.statusCode).json({
    success: data.success,
    message: data.message,
    meta: data.meta ? data.meta : undefined,
    data: data.data,
  });
};
