import { ClerkProvider } from "@clerk/nextjs";
import { extractRouterConfig } from "uploadthing/server";

import type { Metadata } from "next";
import { open_sans } from "@/components/ui/fonts";
import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";
import ModalProvider from "@/providers/modal-provider.";
import { currentProfile } from "@/lib/current-profile";
import { IProfile } from "@/types/data-types";
import { SocketProvider } from "@/providers/socket-provider";
import QueryProvider from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "This is a Discord clone made with Next.js and Tailwind CSS.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile: IProfile = await currentProfile();

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            open_sans.className,
            "antialiased bg-white dark:bg-[#313338]"
          )}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="discord-theme"
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <SocketProvider>
              <ModalProvider profile={profile} />
              <QueryProvider>{children}</QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
