import e from "express";
import { z } from "zod";

const login = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const AuthValidation = {
  login,
};
