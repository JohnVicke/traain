import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const muscleGroups = [
  { name: "chest" },
  { name: "back" },
  { name: "triceps" },
  { name: "biceps" },
  { name: "quadriceps" },
  { name: "hamstrings" },
  { name: "calves" },
  { name: "core" },
  { name: "shoulders" },
] as const;

export type MuscleGroup = (typeof muscleGroups)[number]["name"];

async function seed() {
  const insertedMuscleGroups = await prisma.muscleGroup.createMany({
    data: muscleGroups as any,
  });
  console.log({ muscleGroups, inserted: insertedMuscleGroups });
}

seed()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
