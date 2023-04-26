import { exerciseRouter } from "./router/exercise";
import { postRouter } from "./router/post";
import { workoutRouter } from "./router/workout";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  workout: workoutRouter,
  exercise: exerciseRouter,
});

export type AppRouter = typeof appRouter;
