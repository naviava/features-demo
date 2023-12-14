import { router } from "~/server/trpc";
import { checkSubscription } from "../actions/stripe/check-subscription";
import { paymentCheckout } from "~/server/actions/stripe/paymentCheckout";
import { subscriptionCheckout } from "~/server/actions/stripe/subscription-checkout";

export const stripeRouter = router({
  paymentCheckout,
  subscriptionCheckout,
  checkSubscription,
});
