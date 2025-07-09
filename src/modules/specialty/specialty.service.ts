import httpStatus from "http-status";
import { Request } from "express";
import prisma from "../../utils/prisma";
import { uploadToCloudinary } from "../../helpers/fileUploader";
import { Specialty } from "../../../generated/prisma";
import AppError from "../../errors/AppError";

const createSpecialty = async (req: Request) => {
  const data: Specialty = req.body;
  if (req.file) {
    const image = await uploadToCloudinary(req.file);
    data.icon = image.secure_url;
  } else throw new AppError(httpStatus.BAD_REQUEST, "Icon is required");

  const result = await prisma.specialty.create({
    data: data,
  });

  return result;
};

export const SpecialtyService = {
  createSpecialty,
};
