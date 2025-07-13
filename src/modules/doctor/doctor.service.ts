import prisma from "../../utils/prisma";

type TSpecialties = {
  id: string;
  isDeleted?: boolean;
};

interface UpdateDoctorPayload {
  specialties: TSpecialties[];
  [key: string]: any;
}

interface DoctorProfile {
  id: string;
  // Add other doctor profile fields as needed
}

const updateDoctor = async (
  id: string,
  payload: UpdateDoctorPayload
): Promise<void> => {
  const { specialties, ...doctorData } = payload;
  const doctorProfile: DoctorProfile = await prisma.doctor.findUniqueOrThrow({
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

    const addedSpecialties: TSpecialties[] = (
      specialties as TSpecialties[]
    ).filter((specialty) => !specialty.isDeleted);
    const deletedSpecialties: TSpecialties[] = (
      specialties as TSpecialties[]
    ).filter((specialty) => !specialty.isDeleted);

    addedSpecialties.forEach(
      async (specialty: TSpecialties) =>
        await tx.doctorSpecialty.create({
          data: {
            doctorId: id,
            specialtyId: specialty.id,
          },
        })
    );
    deletedSpecialties.forEach(
      async (specialty: TSpecialties) =>
        await tx.doctorSpecialty.deleteMany({
          where: {
            specialtyId: specialty.id,
          },
        })
    );
  });
};

export const DoctorService = {
  updateDoctor,
};
