import { z } from "zod";

const create = z.object({
  title: z.string().min(1),
});

export const SpecialtyValidation = { create };
