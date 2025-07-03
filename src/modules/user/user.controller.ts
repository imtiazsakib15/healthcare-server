import { UserService } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";

const createAdmin = catchAsync(async (req, res) => {
  const result = await UserService.createAdmin(req);

  res.status(200).json({
    success: true,
    message: "Admin created successfully",
    data: result,
  });
});

export const UserController = {
  createAdmin,
};
