import { NextFunction, Request, RequestHandler, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import { pick } from "../../utils/pick";
import { sendResponse } from "../../utils/sendResponse";
import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";

const getAllFromDB = catchAsync(async (req, res) => {
  const filteredParams = pick(req.query, adminFilterableFields);
  const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

  const result = await AdminService.getAllFromDB(filteredParams, options);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "All admin retrieved successfully",
    meta: result.meta,
    data: result.data,
  });
});

const getByIdFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;

  const result = await AdminService.getByIdFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin retrieved successfully",
    data: result,
  });
});

const updateIntoDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.updateIntoDB(id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin updated successfully",
    data: result,
  });
});

const deleteFromDB = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await AdminService.deleteFromDB(id);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Admin deleted successfully",
    data: result,
  });
});

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
