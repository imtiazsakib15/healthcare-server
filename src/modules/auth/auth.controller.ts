import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import { access } from "fs";
import { config } from "../../config";

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

export const AuthController = {
  login,
};
