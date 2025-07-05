import { PrismaClient } from "../../generated/prisma";

const prisma = new PrismaClient({
  omit: {
    user: {
      password: true,
    },
  },
});

export default prisma;
