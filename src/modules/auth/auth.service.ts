import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { generateToken, TPayload } from "../../helpers/jwtHelper";
import { config } from "../../config";
import { User } from "../../../generated/prisma";

const login = async (data: Pick<User, "email" | "password">) => {
  const { email, password } = data;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });
  if (!user) throw new Error("User not found");

  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) throw new Error("Invalid password");

  const payload: TPayload = { email, role: user.role };
  const accessToken = generateToken(
    payload,
    config.ACCESS_TOKEN_SECRET!,
    config.ACCESS_TOKEN_EXPIRATION_TIME
  );
  const refreshToken = generateToken(
    payload,
    config.REFRESH_TOKEN_SECRET!,
    config.REFRESH_TOKEN_EXPIRATION_TIME
  );

  return {
    accessToken,
    refreshToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
};
