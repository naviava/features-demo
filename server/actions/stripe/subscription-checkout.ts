import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { db } from "~/lib/db";
import { stripe } from "~/lib/stripe";
import { authProcedure } from "~/server/trpc";

export const subscriptionCheckout = authProcedure.mutation(async ({ ctx }) => {
  const { user } = ctx;

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to checkout.",
    });
  }

  let stripeCustomer = await db.stripeCustomer.findUnique({
    where: { userId: user.id },
  });

  if (!stripeCustomer) {
    const customer = await stripe.customers.create({
      email: user.email,
    });

    stripeCustomer = await db.stripeCustomer.create({
      data: {
        userId: user.id,
        stripeCustomerId: customer.id,
      },
    });
  }

  const isSubscribed =
    !!stripeCustomer.stripePriceId &&
    stripeCustomer.stripeCurrentPeriodEnd?.getTime()! + 86_400_000 > Date.now();

  if (!!stripeCustomer && isSubscribed) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/stripe`,
    });
    return { url: stripeSession.url };
  } else {
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomer.stripeCustomerId,
      currency: "INR",
      mode: "subscription",
      billing_address_collection: "auto",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "INR",
            product_data: {
              name: "1-day Subscription",
              description: "Enjoy for day!",
            },
            unit_amount: 10000,
            recurring: {
              interval: "day",
              interval_count: 1,
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/stripe?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/stripe?canceled=true`,
      metadata: { userId: user.id },
    });
    return { url: checkoutSession.url };
  }
});
