import httpStatus from "http-status";
import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req);

  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

const createDoctor = catchAsync(async (req, res) => {
  const result = await UserService.createDoctor(req);

  res.status(200).json({
    success: true,
    message: "Doctor created successfully",
    data: result,
  });
});

const getAllFromDB = catchAsync(async (req, res) => {
  const result = await UserService.getAllFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All user retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

export const UserController = {
  createAdmin,
  createDoctor,
  getAllFromDB,
};
