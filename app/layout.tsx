import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { getServerSession } from "next-auth";

import { Button } from "~/components/ui/button";
import { Providers } from "~/components/providers";
import { AuthButton } from "~/components/auth-button";
import SessionProvider from "~/components/providers/session-provider";

import { cn } from "~/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Features Demo",
  description: "A Next.js app to showcase various features.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body className={cn("bg-zinc-800 text-base", font.className)}>
        <SessionProvider session={session}>
          <Providers>
            <div className="flex h-full flex-col">
              <nav className="flex justify-between px-6 py-2">
                <Button asChild size="sm">
                  <Link href="/">Home</Link>
                </Button>
                <AuthButton />
              </nav>
              {children}
            </div>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}
