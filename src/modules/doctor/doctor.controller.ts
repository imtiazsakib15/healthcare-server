import httpStatus from "http-status";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { DoctorService } from "./doctor.service";

const updateDoctor = catchAsync(async (req, res) => {
  const result = await DoctorService.updateDoctor(req.params.id, req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Doctor updated successfully!",
    data: result,
  });
});

export const DoctorController = {
  updateDoctor,
};
