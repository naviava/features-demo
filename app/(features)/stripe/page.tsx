"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { trpc } from "~/app/_trpc/client";
import { toast } from "sonner";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
// const stripePromise = loadStripe(
//   process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
// );

export default function PreviewPage() {
  const { data: user } = trpc.user.getAuthProfile.useQuery();

  const { mutate: handleCheckout, isLoading } =
    trpc.stripe.checkout.useMutation({
      onError: ({ message }) => toast.error(message),
      onSuccess: ({ url }) => {
        if (!!url) window.location.href = url;
      },
    });

  return (
    <div className="mx-auto w-fit">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCheckout();
        }}
      >
        <section>
          <div className="m-auto text-black">
            {`\u20B9 ${(2000).toLocaleString("en-IN")}`}
          </div>
          <p></p>
          <button type="submit" role="link" disabled={isLoading}>
            Checkout
          </button>
        </section>
        <style jsx>
          {`
            section {
              background: #ffffff;
              display: flex;
              flex-direction: column;
              width: 400px;
              height: 112px;
              border-radius: 6px;
              justify-content: space-between;
            }
            button {
              height: 36px;
              background: #556cd6;
              border-radius: 4px;
              color: white;
              border: 0;
              font-weight: 600;
              cursor: pointer;
              transition: all 0.2s ease;
              box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
            }
            button:hover {
              opacity: 0.8;
            }
          `}
        </style>
      </form>
      <h1 className="mt-10 text-center text-4xl font-bold">
        Total purchases: {user?.purchaseCount}
      </h1>
    </div>
  );
}
