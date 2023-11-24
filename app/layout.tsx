import type { Metadata } from "next";
import { roboto } from "@/components/ui/fonts";
import "@/styles/global.css";

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
    <html lang="en">
      <body className={`${roboto.className} antialiased`}>{children}</body>
    </html>
  );
}
