"use client";

import * as React from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { MotionConfig } from "framer-motion";
import { wagmiConfig } from "@/lib/wagmi";
import { useThemeStore } from "@/store/theme";

/** Keeps <html> class + color-scheme in sync with the persisted theme store. */
function ThemeSync() {
  const theme = useThemeStore((s) => s.theme);
  React.useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.style.colorScheme = theme;
  }, [theme]);
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );
  const theme = useThemeStore((s) => s.theme);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={
            theme === "dark"
              ? darkTheme({
                  accentColor: "#4cbd93",
                  accentColorForeground: "#0a1611",
                  borderRadius: "medium",
                })
              : lightTheme({
                  accentColor: "#2b6e5a",
                  accentColorForeground: "#ffffff",
                  borderRadius: "medium",
                })
          }
        >
          <ThemeSync />
          <MotionConfig reducedMotion="user">{children}</MotionConfig>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
