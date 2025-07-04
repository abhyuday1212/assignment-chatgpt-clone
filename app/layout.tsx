import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "../store/providers/Provider";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ChatGPT Clone",
  description: "A professional ChatGPT clone built with Next.js 15",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning={true}>
        <body className={inter.className} cz-shortcut-listen="true">
          <SignedIn>
            <Providers>{children}</Providers>
          </SignedIn>
          <SignedOut>
            <div className="flex items-center justify-center min-h-screen bg-background">
              <SignIn routing="hash" />
            </div>
          </SignedOut>
        </body>
      </html>
    </ClerkProvider>
  );
}
