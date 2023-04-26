import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const exerciseRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.exercise.findFirst({ where: { id: input.id } });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.exercise.findMany({ include: { muscleGroups: true } });
  }),
});
