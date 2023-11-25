import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { open_sans } from "@/components/ui/fonts";
import { extractRouterConfig } from "uploadthing/server";

import "@/styles/globals.css";
import { ThemeProvider } from "@/providers/theme-provider";
import { cn } from "@/lib/utils";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { ourFileRouter } from "./api/uploadthing/core";
import ModalProvider from "@/providers/modal-provider.";
import { currentProfile } from "@/lib/current-profile";
import { IProfile } from "@/types/data-types";

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
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            storageKey="discord-theme"
          >
            <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
            <ModalProvider profile={profile} />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
