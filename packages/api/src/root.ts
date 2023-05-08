import { exerciseRouter } from "./router/exercise";
import { muscleGroupRouter } from "./router/muscle-group";
import { postRouter } from "./router/post";
import { workoutRouter } from "./router/workout";
import { workoutSetRouter } from "./router/workout-set";
import { createTRPCRouter } from "./trpc";

export const appRouter = createTRPCRouter({
  post: postRouter,
  workout: workoutRouter,
  exercise: exerciseRouter,
  muscleGroup: muscleGroupRouter,
  workoutSet: workoutSetRouter,
});

export type AppRouter = typeof appRouter;
