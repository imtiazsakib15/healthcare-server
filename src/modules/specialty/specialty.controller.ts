import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { SpecialtyService } from "./specialty.service";

const createSpecialty = catchAsync(async (req, res) => {
  const result = await SpecialtyService.createSpecialty(req);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Specialty created successfully!",
    data: result,
  });
});

const getFromDB = catchAsync(async (req, res) => {
  const result = await SpecialtyService.getFromDB();

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Specialty retrieved successfully!",
    data: result,
  });
});

export const SpecialtyController = {
  createSpecialty,
  getFromDB,
};
