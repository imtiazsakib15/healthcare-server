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

export const SpecialtyController = {
  createSpecialty,
};
