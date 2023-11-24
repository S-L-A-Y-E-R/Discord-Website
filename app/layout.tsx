import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { open_sans } from "@/components/ui/fonts";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: "Discord Clone",
  description: "This is a Discord clone made with Next.js and Tailwind CSS.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${open_sans.className} antialiased`}>{children}</body>
      </html>
    </ClerkProvider>
  );
}
