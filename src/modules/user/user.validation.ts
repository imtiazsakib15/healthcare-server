import { z } from "zod";
import { Gender, UserStatus } from "../../../generated/prisma";

const createAdmin = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  admin: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
  }),
});

const createDoctor = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  doctor: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
    address: z.string().optional(),
    registrationNumber: z.string(),
    experience: z.number().default(0),
    gender: z.enum([Gender.MALE, Gender.FEMALE]),
    appointmentFee: z.number(),
    qualification: z.string(),
    currentWorkingPlace: z.string(),
    designation: z.string(),
  }),
});

const updateUserStatus = z.object({
  status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED]),
});

export const UserValidationSchema = {
  createAdmin,
  createDoctor,
  updateUserStatus,
};
