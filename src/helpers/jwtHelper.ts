import jwt from "jsonwebtoken";
import { UserRole } from "../../generated/prisma";

export type TPayload = {
  email: string;
  role: UserRole;
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
