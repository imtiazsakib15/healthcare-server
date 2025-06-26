import httpStatus from "http-status";
import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
  const message = err.message || "Something went wrong";

  res.status(statusCode).json({
    success: false,
    message: message,
    error: err,
    stack: process.env.Node_ENV === "production" ? undefined : err.stack,
  });
};
