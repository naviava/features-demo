import Link from "next/link";
import { Button } from "~/components/ui/button";

interface Props {}

export function Options({}: Props) {
  return (
    <div className="flex gap-x-6">
      <Button asChild size="sm">
        <Link href="/">Stripe Premium</Link>
      </Button>
      <Button asChild size="sm">
        <Link href="/webrtc">WebRTC</Link>
      </Button>
    </div>
  );
}
