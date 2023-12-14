import { getServerSession } from "next-auth";
import { TRPCError, initTRPC } from "@trpc/server";

import { db } from "~/lib/db";

const t = initTRPC.create();
const middleware = t.middleware;

const isAuthenticated = middleware(async (opts) => {
  const session = await getServerSession();

  if (!session || !session.user || !session.user.email) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in",
    });
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "User not found",
    });
  }

  const { hashedPassword, ...rest } = user;
  return opts.next({
    ctx: { user: rest },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const authProcedure = t.procedure.use(isAuthenticated);
