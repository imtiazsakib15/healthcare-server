import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { generateToken, TPayload, verifyToken } from "../../helpers/jwtHelper";
import { config } from "../../config";
import { User, UserStatus } from "../../../generated/prisma";

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

const refreshToken = async (refreshToken: string) => {
  if (!refreshToken) throw new Error("Refresh token is required");
  const decoded = verifyToken(refreshToken, config.REFRESH_TOKEN_SECRET!);

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: decoded.email, status: UserStatus.ACTIVE },
  });

  const payload: TPayload = { email: decoded.email, role: decoded.role };
  const accessToken = generateToken(
    payload,
    config.ACCESS_TOKEN_SECRET!,
    config.ACCESS_TOKEN_EXPIRATION_TIME
  );

  return {
    accessToken,
    needPasswordChange: user.needPasswordChange,
  };
};

export const AuthService = {
  login,
  refreshToken,
};
