import { ThemeProvider } from "./theme.provider";

interface Props {
  children: React.ReactNode;
}

export function Providers({ children }: Props) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
