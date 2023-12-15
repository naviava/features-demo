"use client";

import { Toaster } from "sonner";
import { ProgressLoader } from "nextjs-progressloader";

import { TRPCProvider } from "./trpc-provider";
import { ThemeProvider } from "./theme.provider";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <TRPCProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem
        disableTransitionOnChange
      >
        <ProgressLoader />
        <Toaster position="top-right" />
        {children}
      </ThemeProvider>
    </TRPCProvider>
  );
}
