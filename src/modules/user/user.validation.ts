import { z } from "zod";

const createAdmin = z.object({
  password: z.string().min(6, "Password must be at least 6 characters long"),
  admin: z.object({
    name: z.string(),
    email: z.string().email(),
    contactNumber: z.string(),
  }),
});

export const UserValidationSchema = { createAdmin };
