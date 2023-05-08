import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const setRouter = createTRPCRouter({
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        reps: z.number().optional(),
        weight: z.number().optional(),
        notes: z.string().optional(),
      }),
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const workout = await ctx.prisma.workoutSet.update({
        where: { id },
        data,
      });
      if (!workout) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      return workout;
    }),
});
