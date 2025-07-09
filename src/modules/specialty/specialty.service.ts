import { Specialty } from "../../../generated/prisma";
import prisma from "../../utils/prisma";

const createSpecialty = async (payload: Specialty) => {
  const result = await prisma.specialty.create({
    data: payload,
  });

  return result;
};

export const SpecialtyService = {
  createSpecialty,
};
