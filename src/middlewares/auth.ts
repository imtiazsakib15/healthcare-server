import httpStatus from "http-status";
import { NextFunction, Request, Response } from "express";
import { UserRole } from "../../generated/prisma";
import { TDecodedUser, verifyToken } from "../helpers/jwtHelper";
import { config } from "../config";
import prisma from "../utils/prisma";
import AppError from "../errors/AppError";

export const auth = (...roles: UserRole[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) throw new AppError(httpStatus.NOT_FOUND, "Token not found");

    const decoded = await verifyToken(token, config.ACCESS_TOKEN_SECRET!);

    if (!roles.includes(decoded.role))
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");

    const user = await prisma.user.findUniqueOrThrow({
      where: { email: decoded.email, status: "ACTIVE" },
    });
    if (user.role !== decoded.role)
      throw new AppError(httpStatus.FORBIDDEN, "Forbidden");

    req.user = decoded as TDecodedUser;
    next();
  };
};
