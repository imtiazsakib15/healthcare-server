import { Request } from "express";
import { UserRole } from "../../../generated/prisma";
import { TDecodedUser } from "../../helpers/jwtHelper";
declare global {
  namespace Express {
    interface Request {
      user?: TDecodedUser;
    }
  }
}
