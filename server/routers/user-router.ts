import { router } from "~/server/trpc";
import { getAuthProfile } from "~/server/actions/user-router/getAuthProfile";

export const userRouter = router({
  getAuthProfile,
});
