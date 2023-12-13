import { publicProcedure, router } from "./trpc";

export const appRouter = router({
  getTodos: publicProcedure.query(async () => {
    // API call to get todos.
    return "Hello World!";
  }),
});

export type AppRouter = typeof appRouter;
