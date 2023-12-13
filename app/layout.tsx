import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { Providers } from "~/components/providers";

import { cn } from "~/lib/utils";

const font = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Features Demo",
  description: "A Next.js app to showcase various features.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={cn("bg-zinc-800", font.className)}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
