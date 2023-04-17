import { z } from "zod";

const exerciseSchema = z.object({
  name: z.string(),
  sets: z.preprocess((value) => {
    return parseInt(((value as string) || "").trim());
  }, z.number()),
  reps: z
    .preprocess((value) => ((value as string) || "").trim(), z.string())
    .refine((value) => {
      if (!value.includes("-")) {
        return value;
      }
      const [min, max] = value.split("-");
      return Number(min) < Number(max) ? value : false;
    }),
});

export function csvToWorkout(workoutString: string) {
  return workoutString
    .substring(2, workoutString.length - 2)
    .replaceAll('"', "")
    .split("\n")
    .map((exercise) => {
      const [name, sets, reps] = exercise.split(",");
      const parsedExercise = exerciseSchema.safeParse({
        name,
        sets,
        reps,
      });

      return parsedExercise.success ? parsedExercise.data : null;
    })
    .filter(nonNullable);
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
