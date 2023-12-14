import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "~/lib/db";
import { stripe } from "~/lib/stripe";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature") as string;
  let event: Stripe.Event;

  try {
    event = Stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET as string,
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const userId = session?.metadata?.userId;

  if (event.type === "checkout.session.completed") {
    if (!userId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    let subscription: Stripe.Response<Stripe.Subscription> | null = null;
    if (!!session.subscription) {
      subscription = await stripe.subscriptions.retrieve(
        session.subscription as string,
      );
    }

    if (!!subscription) {
      await db.stripeCustomer.upsert({
        where: { userId },
        update: {
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
        create: {
          userId,
          stripeCustomerId: subscription.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: subscription.items.data[0].price.id,
          stripeCurrentPeriodEnd: new Date(
            subscription.current_period_end * 1000,
          ),
        },
      });
    } else {
      await db.user.update({
        where: { id: userId },
        data: {
          purchaseCount: { increment: 1 },
        },
      });
      return new NextResponse(null, { status: 200 });
    }
  }

  if (event.type === "invoice.payment_succeeded") {
    if (!userId) {
      return new NextResponse("Missing metadata", { status: 400 });
    }

    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string,
    );

    await db.stripeCustomer.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000,
        ),
      },
    });
  }

  return new NextResponse(null, { status: 200 });
}
