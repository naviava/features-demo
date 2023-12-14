import { router } from "./trpc";
import { userRouter } from "./routers/user-router";
import { stripeRouter } from "./routers/stripe-router";

export const appRouter = router({
  user: userRouter,
  stripe: stripeRouter,
});

export type AppRouter = typeof appRouter;
