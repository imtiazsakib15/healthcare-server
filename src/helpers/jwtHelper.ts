import httpStatus from "http-status";
import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import AppError from "../errors/AppError";
import { TPayload } from "../types";

export const generateToken = (
  payload: TPayload,
  secret: Secret,
  expiresIn: any
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const verifyToken = async (token: string, secret: Secret) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Your session has expired....");
  }
};
