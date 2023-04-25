import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createOpenAiClient } from "@traain/openai-client/src/openai-client";

import { equipmentStyleSchema } from "../schemas/equipment-style";
import { muscleGroupSchema } from "../schemas/muscle-group";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { exampleWorkout } from "./example-workout";

const aiClient = createOpenAiClient();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const workoutRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      /* 
      const workout = await ctx.prisma.workout.findFirst({
        where: { id: input.id },
      });
      return workout; */
      await sleep(1000);
      return { id: 1, ...exampleWorkout };
    }),
  create: protectedProcedure
    .input(
      z.object({
        muscleGroups: z.array(muscleGroupSchema),
        minutes: z.number().min(1),
        equipmentStyle: equipmentStyleSchema,
        example: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      if (input.example) {
        await sleep(1000);
        return { id: 1, ...exampleWorkout };
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

        return {
          id: 1,
          muscleGroups: input.muscleGroups,
          equipmentStyle: input.equipmentStyle,
          estimatedMinutes: input.minutes,
          exercises,
        };
      } catch (error) {
        console.error("Error creating workout", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
