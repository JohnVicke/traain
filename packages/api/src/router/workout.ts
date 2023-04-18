import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createOpenAiClient } from "@traain/openai-client/src/openai-client";

import { equipmentStyleSchema } from "../schemas/equipment-style";
import { muscleGroupSchema } from "../schemas/muscle-group";
import { createTRPCRouter, protectedProcedure } from "../trpc";

const aiClient = createOpenAiClient();

export const workoutRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        muscleGroups: z.array(muscleGroupSchema),
        minutes: z.number().min(1),
        equipmentStyle: equipmentStyleSchema,
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const hours = Math.floor(input.minutes / 60);
        const content = `1. ${input.muscleGroups.join(
          ", ",
        )}, 2. ${hours}h, 3. ${input.equipmentStyle}`;
        const response = await aiClient.complete({
          messages: [
            {
              role: "user",
              content,
            },
          ],
        });
        return {
          muscleGroups: input.muscleGroups,
          equipmentStyle: input.equipmentStyle,
          estimatedMinutes: input.minutes,
          exercises: response,
        };
      } catch (error) {
        console.error("Error creating workout", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }),
});
