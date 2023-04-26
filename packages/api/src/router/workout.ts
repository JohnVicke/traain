import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { type MuscleGroup, type prisma } from "@traain/db";
import { type OpenAiClient } from "@traain/openai-client";
import { createOpenAiClient } from "@traain/openai-client/src/openai-client";

import { equipmentStyleSchema } from "../schemas/equipment-style";
import { muscleGroupSchema } from "../schemas/muscle-group";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { exampleWorkout } from "./example-workout";

const aiClient = createOpenAiClient();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const workoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    return "hello world";
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async () => {
      /* 
      const workout = await ctx.prisma.workout.findFirst({
        where: { id: input.id },
      });
      return workout; */
      await sleep(1000);
      return { id: 1, ...exampleWorkout };
    }),
  generate: protectedProcedure
    .input(
      z.object({
        muscleGroups: z.array(muscleGroupSchema),
        minutes: z.number().min(1),
        equipmentStyle: equipmentStyleSchema,
        example: z.boolean().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      if (input.example) {
        const res = await createExercisesIfNotExists(
          exampleWorkout.exercises,
          ctx.prisma,
        );
        return {
          id: 1,
          ...exampleWorkout,
          exercises: exampleWorkout.exercises.map(
            ({ muscleGroups, name, reps, sets }) => {
              return {
                id: res.find((ex) => ex.name === name)?.id ?? 0,
                muscleGroups,
                name,
                reps,
                sets,
              };
            },
          ),
        };
      }
      try {
        const hours = Math.floor(input.minutes / 60);
        const content = `1. ${input.muscleGroups.join(
          ", ",
        )}, 2. ${hours}h, 3. ${input.equipmentStyle}`;

        const exercises = await aiClient.complete({
          messages: [
            {
              role: "user",
              content,
            },
          ],
        });

        const res = await createExercisesIfNotExists(exercises, ctx.prisma);

        return {
          id: 1,
          muscleGroups: input.muscleGroups,
          equipmentStyle: input.equipmentStyle,
          estimatedMinutes: input.minutes,
          exercises: exercises.map(({ muscleGroups, name, reps, sets }) => {
            return {
              id: res.find((ex) => ex.name === name)?.id ?? 0,
              muscleGroups,
              name,
              reps,
              sets,
            };
          }),
        };
      } catch (error) {
        console.error("Error creating workout", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

async function createExercisesIfNotExists(
  exercises: Awaited<ReturnType<OpenAiClient["complete"]>>,
  db: typeof prisma,
) {
  // Since we have so few muscle groups to select from just query them all at once
  const muscleGroups = await db.muscleGroup.findMany();

  const muscleGroupMap = new Map<string, MuscleGroup>();
  for (const muscleGroup of muscleGroups) {
    muscleGroupMap.set(muscleGroup.name, muscleGroup);
  }

  const exerciseCreates = exercises.map(async (exercise, index) => {
    const muscleGroupIds = exercise.muscleGroups.map(
      (mgName) => muscleGroupMap.get(mgName)?.id,
    );

    const existingExercise = await db.exercise.findFirst({
      where: { name: exercise.name },
    });

    if (existingExercise) return existingExercise;

    return db.exercise.create({
      data: {
        name: exercise.name,
        muscleGroups: {
          connect: muscleGroupIds.filter(nonNullable).map((id) => ({ id })),
        },
      },
    });
  });

  return Promise.all(exerciseCreates);
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
