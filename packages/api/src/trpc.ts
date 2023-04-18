import type {
  SignedInAuthObject,
  SignedOutAuthObject,
} from "@clerk/nextjs/api";
import { getAuth } from "@clerk/nextjs/server";
import { TRPCError, initTRPC } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import superjson from "superjson";
import { ZodError } from "zod";

import { prisma } from "@traain/db";

type CreateContextOptions = {
  auth: SignedInAuthObject | SignedOutAuthObject;
};

const createInnerTRPCContext = ({ auth }: CreateContextOptions) => {
  return {
    auth,
    prisma,
  };
};

export const createTRPCContext = (opts: CreateNextContextOptions) =>
  createInnerTRPCContext({
    auth: getAuth(opts.req),
  });
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.auth.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED", message: "Not authenticated" });
  }
  return next({
    ctx,
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);
