import { UserRole } from "../../generated/prisma";

export type TPayload = {
  email: string;
  role: UserRole;
};
export type TDecodedUser = {
  email: string;
  role: UserRole;
  iat: number;
  exp: number;
};
