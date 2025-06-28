import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { access } from "fs";
import { config } from "../../config";
import prisma from "../../utils/prisma";

const login = catchAsync(async (req, res) => {
  const result = await AuthService.login(req.body);

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: config.NODE_ENV === "production",
    secure: config.NODE_ENV === "production",
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      accessToken: result.accessToken,
      needPasswordChange: result.needPasswordChange,
    },
  });
});

const refreshToken = catchAsync(async (req, res) => {
  const { refreshToken } = req.cookies;

  const result = await AuthService.refreshToken(refreshToken!);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Access token refreshed successfully",
    data: result,
  });
});

export const AuthController = {
  login,
  refreshToken,
};
