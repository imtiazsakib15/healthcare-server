import httpStatus from "http-status";
import prisma from "../../utils/prisma";
import bcrypt from "bcrypt";
import { generateToken, verifyToken } from "../../helpers/jwtHelper";
import { config } from "../../config";
import { User, UserStatus } from "../../../generated/prisma";
import AppError from "../../errors/AppError";
import { comparePassword, hashPassword } from "../../helpers/bcryptHelper";
import { emailSender } from "../../lib/emailSender";
import { TDecodedUser, TPayload } from "../../types";

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
  if (!refreshToken)
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");
  const decoded = await verifyToken(refreshToken, config.REFRESH_TOKEN_SECRET!);

  const user = await prisma.user.findUniqueOrThrow({
    where: { email: decoded.email, status: UserStatus.ACTIVE },
  });
  if (user.role !== decoded.role)
    throw new AppError(httpStatus.FORBIDDEN, "Forbidden");

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

const changePassword = async (
  user: TDecodedUser,
  data: { oldPassword: string; newPassword: string }
) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: { email: user.email, status: "ACTIVE" },
  });
  const isPasswordMatched = await comparePassword(
    data.oldPassword,
    userData.password
  );
  if (!isPasswordMatched)
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");

  const hashedPassword = await hashPassword(data.newPassword);

  const result = await prisma.user.update({
    where: {
      email: user.email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return { needPasswordChange: result.needPasswordChange };
};

const forgotPassword = async (email: string) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { email, status: "ACTIVE" },
  });
  const payload: TPayload = { email, role: user.role };

  const token = generateToken(
    payload,
    config.RESET_PASS_TOKEN_SECRET!,
    config.RESET_PASS_TOKEN_EXPIRATION_TIME
  );

  await emailSender(email, token);

  return { token };
};

const resetPassword = async (data: {
  email: string;
  token: string;
  password: string;
}) => {
  const { email, token, password } = data;
  const user = await prisma.user.findUniqueOrThrow({
    where: { email, status: "ACTIVE" },
  });

  const decoded = await verifyToken(token, config.RESET_PASS_TOKEN_SECRET!);
  if (decoded.email !== email)
    throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized");

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

  const hashedPassword = await hashPassword(password);
  const result = await prisma.user.update({
    where: {
      email,
    },
    data: {
      password: hashedPassword,
      needPasswordChange: false,
    },
  });
  return {
    accessToken,
    refreshToken,
    needPasswordChange: result.needPasswordChange,
  };
};

export const AuthService = {
  login,
  refreshToken,
  changePassword,
  forgotPassword,
  resetPassword,
};
