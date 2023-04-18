import { z } from "zod";

export const muscleGroupSchema = z.enum([
  "legs",
  "chest",
  "back",
  "shoulders",
  "core",
  "biceps",
  "triceps",
]);
