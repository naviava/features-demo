"use client";

import { signIn, signOut, useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  function handleClick() {
    if (!!session) {
      signOut();
    } else {
      signIn();
    }
  }

  return <button onClick={handleClick}>Sign {!!session ? "Out" : "In"}</button>;
}
