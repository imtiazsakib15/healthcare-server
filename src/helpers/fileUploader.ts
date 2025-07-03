import multer from "multer";
import path from "path";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { config } from "../config";
import fs from "fs";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(process.cwd(), "uploads"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Math.round(Math.random() * 1e5);
    cb(null, file.originalname + "-" + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });

export const uploadToCloudinary = async function (
  file: Express.Multer.File
): Promise<UploadApiResponse> {
  cloudinary.config({
    cloud_name: config.CLOUDINARY_CLOUD_NAME,
    api_key: config.CLOUDINARY_API_KEY,
    api_secret: config.CLOUDINARY_API_SECRET,
  });

  try {
    const uploadResult = await cloudinary.uploader.upload(file.path, {
      public_id: file.originalname,
    });
    fs.unlinkSync(file.path);

    return uploadResult;
  } catch (err) {
    throw err;
  }
};
