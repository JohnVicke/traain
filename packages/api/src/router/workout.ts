import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {
  type Exercise,
  type MuscleGroup,
  type WorkoutExercise,
  type prisma,
} from "@traain/db";
import { type OpenAiClient } from "@traain/openai-client";
import { createOpenAiClient } from "@traain/openai-client/src/openai-client";

import { equipmentStyleSchema } from "../schemas/equipment-style";
import { muscleGroupSchema } from "../schemas/muscle-group";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { exampleWorkout } from "./example-workout";

const aiClient = createOpenAiClient();

export const workoutRouter = createTRPCRouter({
  create: protectedProcedure.mutation(async ({ ctx }) => {
    return "hello world";
  }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.workout.findMany({
      include: { exercises: { include: { exercise: true } } },
    });
  }),
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const workout = await ctx.prisma.workout.findFirst({
        where: { id: input.id },
        include: {
          exercises: {
            include: { exercise: true, sets: true },
          },
        },
      });
      if (!workout) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return workout;
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
        const enrichedExercises = exampleWorkout.exercises.map((e) =>
          enrichExercise(e, res.find((ex) => ex.name === e.name)?.id ?? ""),
        );

        const workout = await createWorkout({
          db: ctx.prisma,
          exercises: enrichedExercises,
          userId: ctx.auth.userId,
        });

        return {
          id: 1,
          ...exampleWorkout,
          exercises: enrichedExercises,
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

        const enrichedExercises = exercises.map((e) =>
          enrichExercise(e, res.find((ex) => ex.name === e.name)?.id ?? ""),
        );

        return {
          id: 1,
          muscleGroups: input.muscleGroups,
          equipmentStyle: input.equipmentStyle,
          estimatedMinutes: input.minutes,
          exercises: enrichedExercises,
        };
      } catch (error) {
        console.error("Error creating workout", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});

async function createWorkout(options: {
  exercises: ReturnType<typeof enrichExercise>[];
  userId: string;
  db: typeof prisma;
}) {
  const { exercises, db, userId } = options;

  const workout = await db.workout.create({
    data: {
      name: "Chest & Triceps",
      userId,
    },
  });

  const workoutExercisesCreates = exercises.map((exercise) => {
    return db.workoutExercise.create({
      data: {
        exerciseId: exercise.id,
        workoutId: workout.id,
        sets: {
          createMany: {
            data: new Array(exercise.sets)
              .fill(0)
              .map(() => ({ notes: `Aim for ${exercise.reps} reps` })),
          },
        },
      },
    });
  });

  const createdExercises = await Promise.all(workoutExercisesCreates);

  return db.workout.update({
    where: { id: workout.id },
    data: {
      exercises: { connect: createdExercises.map(({ id }) => ({ id })) },
    },
  });
}

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

function enrichExercise(
  exercise: Awaited<ReturnType<OpenAiClient["complete"]>>[number],
  id: string,
) {
  return {
    ...exercise,
    id,
  };
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return value !== null && value !== undefined;
}
