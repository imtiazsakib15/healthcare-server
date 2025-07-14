import prisma from "../../utils/prisma";

type TSpecialties = {
  id: string;
  isDeleted?: boolean;
};

type TPayload = {
  specialties?: TSpecialties[];
  [key: string]: any;
};

const updateDoctor = async (id: string, payload: TPayload) => {
  const { specialties, ...doctorData } = payload;
  await prisma.doctor.findUniqueOrThrow({
    where: {
      id,
    },
  });

  await prisma.$transaction(async (tx) => {
    await tx.doctor.update({
      where: {
        id,
      },
      data: doctorData,
    });

    if (specialties?.length) {
      console.log(specialties, tx);
      const addedSpecialties: TSpecialties[] = (
        specialties as TSpecialties[]
      )?.filter((specialty) => !specialty.isDeleted);
      const deletedSpecialties: TSpecialties[] = (
        specialties as TSpecialties[]
      )?.filter((specialty) => specialty.isDeleted);

      await Promise.all(
        addedSpecialties.map(
          async (specialty: TSpecialties) =>
            await tx.doctorSpecialty.create({
              data: {
                doctorId: id,
                specialtyId: specialty.id,
              },
            })
        )
      );
      await Promise.all(
        deletedSpecialties.map(
          async (specialty: TSpecialties) =>
            await tx.doctorSpecialty.deleteMany({
              where: {
                specialtyId: specialty.id,
              },
            })
        )
      );
    }
  });
  const updatedDoctorProfile = await prisma.doctor.findUnique({
    where: {
      id,
    },
    include: {
      doctorSpecialties: true,
    },
  });
  return updatedDoctorProfile;
};

export const DoctorService = {
  updateDoctor,
};
