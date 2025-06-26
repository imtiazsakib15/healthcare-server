import { Request, Response } from "express";
import { AdminService } from "./admin.service";
import { adminFilterableFields } from "./admin.constant";
import { pick } from "../../utils/pick";

const getAllFromDB = async (req: Request, res: Response) => {
  try {
    const filteredParams = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ["page", "limit", "sortBy", "sortOrder"]);

    const result = await AdminService.getAllFromDB(filteredParams, options);

    res.status(200).json({
      success: true,
      message: "All admin retrieved successfully",
      meta: result.meta,
      data: result.data,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const getByIdFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await AdminService.getByIdFromDB(id);

    res.status(200).json({
      success: true,
      message: "Admin retrieved successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const updateIntoDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.updateIntoDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Admin updated successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

const deleteFromDB = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await AdminService.deleteFromDB(id);

    res.status(200).json({
      success: true,
      message: "Admin deleted successfully",
      data: result,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Internal server error", error });
  }
};

export const AdminController = {
  getAllFromDB,
  getByIdFromDB,
  updateIntoDB,
  deleteFromDB,
};
