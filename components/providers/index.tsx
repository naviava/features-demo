import { serverClient } from "~/app/_trpc/server-client";
import { ThemeProvider } from "./theme.provider";
import { TRPCProvider } from "./trpc-provider";

interface Props {
  children: React.ReactNode;
  initialTodos: Awaited<ReturnType<typeof serverClient.getTodos>>;
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
        {children}
      </ThemeProvider>
    </TRPCProvider>
  );
}
