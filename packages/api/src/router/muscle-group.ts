import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "../trpc";

export const muscleGroupRouter = createTRPCRouter({
  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      return ctx.prisma.muscleGroup.findFirst({ where: { id: input.id } });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.muscleGroup.findMany();
  }),
});
