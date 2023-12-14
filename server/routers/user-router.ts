import { router } from "~/server/trpc";
import { getAuthProfile } from "~/server/actions/user/getAuthProfile";

export const userRouter = router({
  getAuthProfile,
});
