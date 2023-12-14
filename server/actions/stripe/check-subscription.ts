import { TRPCError } from "@trpc/server";

import { db } from "~/lib/db";
import { authProcedure } from "~/server/trpc";

export const checkSubscription = authProcedure.query(async ({ ctx }) => {
  const { user } = ctx;

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to checkout.",
    });
  }

  const subscription = await db.stripeCustomer.findUnique({
    where: { userId: user.id },
  });

  if (!subscription) {
    return { isSubscribed: false, endDate: null };
  }

  const isSubscribed =
    !!subscription.stripePriceId &&
    subscription.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now();

  return {
    isSubscribed,
    endDate: subscription.stripeCurrentPeriodEnd
      ? new Date(subscription.stripeCurrentPeriodEnd.getTime() + 86_400_000)
      : null,
  };
});
