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
            content: "hello world",
          },
        ],
      });
      return response;
    } catch (error) {
      console.error(JSON.stringify(error, null, 2));
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
