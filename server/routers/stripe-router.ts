import { router } from "~/server/trpc";
import { checkout } from "~/server/actions/stripe/checkout";

export const stripeRouter = router({
  checkout,
});
