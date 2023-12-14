import { serverClient } from "../_trpc/server-client";
import { Options } from "./_components/options";

export default async function Home() {
  const user = await serverClient.user.getAuthProfile();

  console.log(user);

  return (
    <div className="flex flex-1 items-center justify-center">
      <Options />
    </div>
  );
}
