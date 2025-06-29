import bcrypt from "bcrypt";
import { config } from "../config";

export const hashPassword = async (password: string) => {
  try {
    return await bcrypt.hash(password, Number(config.BCRYPT_SALT_ROUND!));
  } catch (error) {
    throw error;
  }
};

export const comparePassword = async (
  password: string,
  hashedPassword: string
) => {
  try {
    return await bcrypt.compare(password, hashedPassword);
  } catch (error) {
    throw error;
  }
};
