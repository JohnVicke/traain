import { z } from "zod";

export const muscleGroupSchema = z.enum([
  "arms",
  "legs",
  "chest",
  "back",
  "shoulders",
  "core",
  "cardio",
  "biceps",
  "triceps",
]);
