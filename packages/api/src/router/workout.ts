import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createOpenAiClient } from "@traain/openai-client/src/openai-client";

import { createTRPCRouter, publicProcedure } from "../trpc";

const aiClient = createOpenAiClient();

export const workoutRouter = createTRPCRouter({
  create: publicProcedure.mutation(async ({ ctx }) => {
    try {
      const response = await aiClient.complete({
        messages: [
          {
            role: "user",
            content:
              "1. Chest, triceps, biceps, back, 2. 2 hours, 3. Fully equipped gym",
          },
        ],
      });
      return response;
    } catch (error) {
      console.error("Error creating workout", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }),
  byId: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.post.findFirst({ where: { id: input.id } });
    }),
  delete: publicProcedure.input(z.string()).mutation(({ ctx, input }) => {
    return ctx.prisma.post.delete({ where: { id: input } });
  }),
});
