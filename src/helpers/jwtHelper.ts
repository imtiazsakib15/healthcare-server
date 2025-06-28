import jwt, { JwtPayload } from "jsonwebtoken";
import { UserRole } from "../../generated/prisma";

export type TPayload = {
  email: string;
  role: UserRole;
};
export type TVerifiedPayload = {
  email: string;
  role: UserRole;
  iat: Date;
  exp: Date;
};
export const generateToken = (
  payload: TPayload,
  secret: string,
  expiresIn: any
) => {
  return jwt.sign(payload, secret, {
    algorithm: "HS256",
    expiresIn,
  });
};

export const verifyToken = (token: string, secret: string) => {
  try {
    return jwt.verify(token, secret) as JwtPayload;
  } catch (error) {
    throw new Error("Your session has expired. Please log in again.");
  }
};
