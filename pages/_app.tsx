import "../global.css";
import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";

import { Inter, Manrope } from "next/font/google";
import { ApiPlayground } from "@/components/playground";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
  const { theme } = useTheme();

  return (
    <main className={`${inter.variable} ${manrope.variable}`}>
      <ApiPlayground></ApiPlayground>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
        <Toaster
          position="bottom-right"
          theme={theme as "light" | "dark" | "system"}
          className="toaster group"
          toastOptions={{
            classNames: {
              toast: "group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
              description: "group-[.toast]:text-muted-foreground",
              actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
              cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
              success: "group-[.toaster]:bg-card group-[.toaster]:text-green-500 group-[.toaster]:border-green-500/20",
              error: "group-[.toaster]:bg-card group-[.toaster]:text-red-500 group-[.toaster]:border-red-500/20",
              info: "group-[.toaster]:bg-card group-[.toaster]:text-blue-500 group-[.toaster]:border-blue-500/20",
              warning: "group-[.toaster]:bg-card group-[.toaster]:text-yellow-500 group-[.toaster]:border-yellow-500/20",
            },
          }}
        />
      </QueryClientProvider>
    </main>
  );
}
