import { z } from "zod";
import { Gender } from "../../../generated/prisma";

const update = z.object({
  name: z.string().optional(),
  contactNumber: z.string().optional(),
  address: z.string().optional(),
  registrationNumber: z.string().optional(),
  experience: z.number().optional(),
  gender: z.enum([Gender.MALE, Gender.FEMALE]).optional(),
  appointmentFee: z.number().optional(),
  qualification: z.string().optional(),
  currentWorkingPlace: z.string().optional(),
  designation: z.string().optional(),
  specialties: z
    .array(z.object({ id: z.string(), isDeleted: z.boolean().optional() }))
    .optional(),
});

export const DoctorValidationSchema = {
  update,
};
