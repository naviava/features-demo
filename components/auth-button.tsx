"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "~/components/ui/button";

interface Props {}

export function AuthButton({}: Props) {
  const { data: session } = useSession();

  function handleClick() {
    if (!!session) {
      signOut();
    } else {
      signIn();
    }
  }

  return (
    <Button size="sm" onClick={handleClick}>
      Sign {!!session ? "Out" : "In"}
    </Button>
  );
}
